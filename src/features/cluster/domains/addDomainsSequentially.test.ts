import {
	addDomainsSequentially,
	describeDomainFailures,
	domainNameCounts,
	MAX_DOMAINS_PER_SUBMIT,
	MAX_INPUT_LENGTH,
	namesCreated,
	NOT_ATTEMPTED,
	parseDomainList,
	unresolvedFailures,
	withinReconcileWindow,
} from '@/features/cluster/domains/addDomainsSequentially';
import { errorStatus } from '@/lib/errorStatus';
import { AxiosError, AxiosHeaders } from 'axios';
import { afterEach, beforeEach, describe, expect, it, type MockInstance, vi } from 'vitest';

/** Traced from central-manager's `addDomain` through Harper's REST serializer, where
 *  `code = error.code ?? constructor.name` — so it is the class name, not the status phrase. */
const CONFLICT_BODY = {
	type: 'error:ClientError',
	code: 'ClientError',
	title: 'Domain already exists',
	status: 409,
	instance: '/Domain/',
};

function axiosFailure(status: number, data: unknown): AxiosError {
	const config = { headers: new AxiosHeaders() };
	return new AxiosError(`Request failed with status code ${status}`, 'ERR_BAD_RESPONSE', config, undefined, {
		status,
		statusText: '',
		headers: {},
		config,
		data,
	});
}

function conflict(data: unknown = CONFLICT_BODY): AxiosError {
	return axiosFailure(409, data);
}

let consoleMock: MockInstance<typeof console.error>;

beforeEach(() => {
	consoleMock = vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
	consoleMock.mockRestore();
});

describe('parseDomainList', () => {
	it('splits the comma-and-space form the "Add www as well" button writes', () => {
		expect(parseDomainList('example.com, www.example.com')).toEqual(['example.com', 'www.example.com']);
	});

	it('collapses a repeat, which the server would otherwise accept twice as separate pending rows', () => {
		expect(parseDomainList('example.com, example.com')).toEqual(['example.com']);
		expect(parseDomainList('example.com, www.example.com, example.com')).toEqual([
			'example.com',
			'www.example.com',
		]);
	});

	it('case-folds, because DNS names are case-insensitive and the duplicate check is not', () => {
		expect(parseDomainList('Example.COM, example.com')).toEqual(['example.com']);
		expect(parseDomainList('WWW.Example.com')).toEqual(['www.example.com']);
	});

	it('drops empty entries rather than submitting a blank domain', () => {
		expect(parseDomainList('  example.com ,, \n ')).toEqual(['example.com']);
		expect(parseDomainList('')).toEqual([]);
	});
});

describe('addDomainsSequentially', () => {
	it('resolves instead of rejecting when an add fails, so the rejection cannot escape the submit handler', async () => {
		const outcome = await addDomainsSequentially(['example.com'], () => Promise.reject(conflict()));

		expect(outcome.added).toEqual([]);
		expect(outcome.failures).toMatchObject([{ domain: 'example.com', message: 'Domain already exists' }]);
	});

	it("reports the reason as one sentence, not the toast's heading-plus-body split", async () => {
		// The toast would head this with `code`, which is the thrown class name — "ClientError".
		const real = await addDomainsSequentially(['a.example.com'], () => Promise.reject(conflict()));
		const withDetail = await addDomainsSequentially(
			['b.example.com'],
			() => Promise.reject(conflict({ ...CONFLICT_BODY, detail: 'in this organization' })),
		);
		const legacyString = await addDomainsSequentially(
			['c.example.com'],
			() => Promise.reject(conflict('Conflict: domain already exists')),
		);

		expect(real.failures[0].message).toBe('Domain already exists');
		expect(withDetail.failures[0].message).toBe('Domain already exists: in this organization');
		expect(legacyString.failures[0].message).toBe('Conflict: domain already exists');
	});

	it('keeps the domains added before a failure, and reports only the ones that failed', async () => {
		const addOne = vi.fn((domain: string) =>
			domain === 'www.example.com' ? Promise.reject(conflict()) : Promise.resolve({ id: 'dom-1' })
		);

		const outcome = await addDomainsSequentially(['example.com', 'www.example.com'], addOne);

		expect(outcome.added).toEqual(['example.com']);
		expect(outcome.failures.map(({ domain }) => domain)).toEqual(['www.example.com']);
	});

	it('attempts every entry after a failure rather than stopping at the first', async () => {
		const addOne = vi.fn((domain: string) =>
			domain === 'first.example.com' ? Promise.reject(conflict()) : Promise.resolve({ id: 'dom-2' })
		);

		const outcome = await addDomainsSequentially(
			['first.example.com', 'second.example.com', 'third.example.com'],
			addOne,
		);

		expect(addOne).toHaveBeenCalledTimes(3);
		expect(outcome.added).toEqual(['second.example.com', 'third.example.com']);
	});

	it('adds one at a time, because the endpoint conflicts on duplicates', async () => {
		const inFlight: string[] = [];
		const addOne = vi.fn(async (domain: string) => {
			inFlight.push(domain);
			expect(inFlight).toHaveLength(1);
			await Promise.resolve();
			inFlight.pop();
		});

		await addDomainsSequentially(['a.example.com', 'b.example.com'], addOne);

		expect(addOne.mock.calls.map(([domain]) => domain)).toEqual(['a.example.com', 'b.example.com']);
	});

	it('reports nothing for a submit that only conflicted — the form already says so inline', async () => {
		const outcome = await addDomainsSequentially(
			['a.example.com', 'b.example.com', 'c.example.com'],
			() => Promise.reject(conflict()),
		);

		expect(outcome.failures).toHaveLength(3);
		expect(console.error).not.toHaveBeenCalled();
	});

	it('reports a server failure even when an expected conflict came first', async () => {
		const serverError = axiosFailure(500, { code: 'Error', title: 'boom' });
		await addDomainsSequentially(
			['owned.example.com', 'new.example.com'],
			(domain) => domain === 'owned.example.com' ? Promise.reject(conflict()) : Promise.reject(serverError),
		);

		expect(console.error).toHaveBeenCalledExactlyOnceWith(serverError);
	});

	it('reports one event for a batch that failed the same way, however many entries', async () => {
		const same = axiosFailure(500, { code: 'Error', title: 'boom' });
		await addDomainsSequentially(
			['a.example.com', 'b.example.com', 'c.example.com'],
			() => Promise.reject(same),
		);

		expect(console.error).toHaveBeenCalledOnce();
	});

	it('reports each distinct refusal, so a 400 is not hidden behind a 403', async () => {
		const forbidden = axiosFailure(403, { code: 'ClientError', title: 'not permitted' });
		const badRequest = axiosFailure(400, { code: 'ClientError', title: 'not a domain' });
		await addDomainsSequentially(
			['a.example.com', 'b.example.com', 'c.example.com'],
			(domain) =>
				domain === 'a.example.com'
					? Promise.reject(conflict())
					: domain === 'b.example.com'
					? Promise.reject(forbidden)
					: Promise.reject(badRequest),
		);

		expect(console.error).toHaveBeenCalledTimes(2);
		expect(console.error).toHaveBeenCalledWith(forbidden);
		expect(console.error).toHaveBeenCalledWith(badRequest);
	});

	it('stops the batch on a response-less failure instead of spending a timeout per name', async () => {
		const offline = new AxiosError('Network Error', 'ERR_NETWORK');
		const addOne = vi.fn(() => Promise.reject(offline));

		const outcome = await addDomainsSequentially(
			['a.example.com', 'b.example.com', 'c.example.com'],
			addOne,
		);

		expect(addOne).toHaveBeenCalledOnce();
		expect(outcome.failures.map(({ domain, message }) => [domain, message])).toEqual([
			['a.example.com', 'Network Error'],
			['b.example.com', NOT_ATTEMPTED],
			['c.example.com', NOT_ATTEMPTED],
		]);
	});

	it('keeps every un-attempted name in the outcome, so none is silently dropped', async () => {
		const outcome = await addDomainsSequentially(
			['a.example.com', 'b.example.com'],
			() => Promise.reject(new AxiosError('timeout of 60000ms exceeded', 'ECONNABORTED')),
		);

		expect(outcome.added).toEqual([]);
		expect(outcome.failures).toHaveLength(2);
	});

	it('does not report an un-attempted entry, which has no failure of its own', async () => {
		await addDomainsSequentially(
			['a.example.com', 'b.example.com', 'c.example.com'],
			() => Promise.reject(new AxiosError('Network Error', 'ERR_NETWORK')),
		);

		expect(console.error).toHaveBeenCalledOnce();
	});

	it('reports a client exception that follows a refusal', async () => {
		// The dedup keys on status, so the pairing that could hide one is a status plus a
		// statusless error. A 403 is a per-name refusal and does not abort, so the `TypeError`
		// is still reached — and it is the only statusless failure the batch can reach.
		const forbidden = axiosFailure(403, { code: 'ClientError', title: 'not permitted' });
		const bug = new TypeError('x is not a function');
		await addDomainsSequentially(
			['a.example.com', 'b.example.com'],
			(domain) => domain === 'a.example.com' ? Promise.reject(forbidden) : Promise.reject(bug),
		);

		expect(console.error).toHaveBeenCalledTimes(2);
		expect(console.error).toHaveBeenCalledWith(forbidden);
		expect(console.error).toHaveBeenCalledWith(bug);
	});

	it('stops on a 500, so a degraded server is not asked 19 more times at 60s each', async () => {
		const serverError = axiosFailure(500, { code: 'Error', title: 'boom' });
		const addOne = vi.fn(() => Promise.reject(serverError));

		const outcome = await addDomainsSequentially(
			['a.example.com', 'b.example.com', 'c.example.com'],
			addOne,
		);

		expect(addOne).toHaveBeenCalledOnce();
		expect(outcome.failures.map(({ message }) => message)).toEqual([
			'boom',
			NOT_ATTEMPTED,
			NOT_ATTEMPTED,
		]);
	});

	it('never produces two attempted failures without a status, which is what the status dedup relies on', async () => {
		const outcome = await addDomainsSequentially(
			['a.example.com', 'b.example.com', 'c.example.com'],
			() => Promise.reject(new TypeError('x is not a function')),
		);
		const responseless = outcome.failures.filter(({ error, attempted }) =>
			attempted && errorStatus(error) === undefined
		);

		expect(responseless).toHaveLength(1);
	});

	it('keeps going after a status-carrying failure, which says nothing about the next name', async () => {
		const addOne = vi.fn((domain: string) =>
			domain === 'a.example.com' ? Promise.reject(conflict()) : Promise.resolve({ id: 'dom-1' })
		);

		const outcome = await addDomainsSequentially(['a.example.com', 'b.example.com'], addOne);

		expect(addOne).toHaveBeenCalledTimes(2);
		expect(outcome.added).toEqual(['b.example.com']);
	});

	it('reports a network failure, which carries no status at all', async () => {
		const offline = new AxiosError('Network Error', 'ERR_NETWORK');
		await addDomainsSequentially(['a.example.com'], () => Promise.reject(offline));

		expect(console.error).toHaveBeenCalledExactlyOnceWith(offline);
	});
});

describe('describeDomainFailures', () => {
	it('names the domain alongside the reason', () => {
		expect(
			describeDomainFailures([{
				domain: 'example.com',
				message: 'Domain already exists',
				error: undefined,
				attempted: true,
			}]),
		)
			.toBe('example.com — Domain already exists');
	});

	it('keeps every failure on one line', () => {
		const text = describeDomainFailures([
			{ domain: 'a.example.com', message: 'Domain already exists', error: undefined, attempted: true },
			{ domain: 'b.example.com', message: 'not a domain', error: undefined, attempted: true },
		]);

		expect(text).toBe('a.example.com — Domain already exists; b.example.com — not a domain');
		expect(text).not.toContain('\n');
	});
});

describe('unresolvedFailures', () => {
	const timedOut = { domain: 'example.com', message: 'timeout of 0ms exceeded', error: undefined, attempted: true };
	const conflicted = {
		domain: 'other.example.com',
		message: 'Domain already exists',
		error: undefined,
		attempted: true,
	};

	it('drops a failure the refreshed list corroborates, because the POST committed before it timed out', () => {
		const created = namesCreated(new Map(), domainNameCounts([{ domain: 'example.com' }] as never));

		expect(unresolvedFailures([timedOut, conflicted], created)).toEqual([conflicted]);
	});

	it('keeps a response-less failure on a name the org already held, since nothing was created', () => {
		const held = domainNameCounts([{ domain: 'example.com' }] as never);

		expect(unresolvedFailures([timedOut], namesCreated(held, held))).toEqual([timedOut]);
	});

	it('keeps a 409 the list contains: already owning the domain is the reason it 409d', () => {
		const owned = {
			domain: 'example.com',
			message: 'Domain already exists',
			error: axiosFailure(409, CONFLICT_BODY),
			attempted: true,
		};
		const created = namesCreated(new Map(), domainNameCounts([{ domain: 'example.com' }] as never));

		expect(unresolvedFailures([owned], created)).toEqual([owned]);
	});

	it('keeps another 4xx refusal the list happens to contain', () => {
		const forbidden = {
			domain: 'example.com',
			message: 'not permitted',
			error: axiosFailure(403, { code: 'ClientError', title: 'not permitted' }),
			attempted: true,
		};
		const created = namesCreated(new Map(), domainNameCounts([{ domain: 'example.com' }] as never));

		expect(unresolvedFailures([forbidden], created)).toEqual([forbidden]);
	});

	it('keeps every failure the list does not mention', () => {
		expect(unresolvedFailures([timedOut, conflicted], new Set())).toEqual([timedOut, conflicted]);
	});
});

describe('a committed duplicate PENDING row', () => {
	it('is credited, because central-manager accepts a second row for the same name', () => {
		// The POST landed and then timed out, so it reports as a failure. Presence-based
		// reconciliation could not see the new row and the retry would create a third.
		const before = domainNameCounts([{ domain: 'example.com' }] as never);
		const after = domainNameCounts([{ domain: 'example.com' }, { domain: 'example.com' }] as never);
		const timedOut = { domain: 'example.com', message: 'timeout of 0ms exceeded', error: undefined, attempted: true };

		expect([...namesCreated(before, after)]).toEqual(['example.com']);
		expect(unresolvedFailures([timedOut], namesCreated(before, after))).toEqual([]);
	});
});

describe('domainNameCounts', () => {
	it('case-folds so the names compare against parseDomainList output', () => {
		expect(domainNameCounts([{ domain: 'Example.COM' }] as never).has('example.com')).toBe(true);
	});

	it('treats a missing list as nothing present', () => {
		expect(domainNameCounts(undefined).size).toBe(0);
	});
});

describe('namesCreated', () => {
	it('keeps only what the submit added', () => {
		const before = domainNameCounts([{ domain: 'old.example.com' }] as never);
		const after = domainNameCounts([{ domain: 'old.example.com' }, { domain: 'new.example.com' }] as never);

		expect([...namesCreated(before, after)]).toEqual(['new.example.com']);
	});

	it('credits nothing when the org already held the name', () => {
		const held = domainNameCounts([{ domain: 'example.com' }] as never);

		expect(namesCreated(held, held).size).toBe(0);
	});
});

describe('indeterminate statuses', () => {
	const created = domainNameCounts([{ domain: 'example.com' }] as never);
	const before = domainNameCounts([] as never);

	// AGENTS.md's rule for the auth forms' non-idempotent POSTs: only a 4xx refusal proves the
	// request was not applied. A 500 can be a failure after the insert, so it has to be excusable
	// or a committed-then-500'd row stays invisible and every retry 409s.
	it.each([408, 500, 502, 503, 504])('excuses a %i, because the write may already have landed', (status) => {
		const failure = { domain: 'example.com', message: 'server', error: axiosFailure(status, {}), attempted: true };

		expect(unresolvedFailures([failure], namesCreated(before, created))).toEqual([]);
	});

	it.each([400, 403, 404, 409, 422])('keeps a %i, a refusal made before any work', (status) => {
		const failure = { domain: 'example.com', message: 'refused', error: axiosFailure(status, {}), attempted: true };

		expect(unresolvedFailures([failure], namesCreated(before, created))).toEqual([failure]);
	});
});

describe('namesCreated with no pre-submit list', () => {
	it('credits nothing, because an unloaded list looks the same as an empty org', () => {
		const after = domainNameCounts([{ domain: 'example.com' }] as never);

		expect(namesCreated(undefined, after).size).toBe(0);
	});

	it('so a response-less failure on an already-owned domain still stands', () => {
		const failure = { domain: 'example.com', message: 'timeout of 0ms exceeded', error: undefined, attempted: true };
		const after = domainNameCounts([{ domain: 'example.com' }] as never);

		expect(unresolvedFailures([failure], namesCreated(undefined, after))).toEqual([failure]);
	});
});

describe('MAX_DOMAINS_PER_SUBMIT', () => {
	it('is small enough that a stray paste is refused rather than attempted', () => {
		expect(MAX_DOMAINS_PER_SUBMIT).toBeLessThanOrEqual(20);
	});
});

describe('MAX_INPUT_LENGTH', () => {
	it('leaves room for a maximal legitimate batch, so the cap is what refuses one', () => {
		const maximal = Array.from(
			{ length: MAX_DOMAINS_PER_SUBMIT },
			(_, i) => `${String(i).padStart(3, '0')}${'a'.repeat(237)}.example.com`,
		).join(', ');

		expect(maximal.length).toBeLessThanOrEqual(MAX_INPUT_LENGTH);
		expect(parseDomainList(maximal)).toHaveLength(MAX_DOMAINS_PER_SUBMIT);
	});
});

describe('an entry the batch never reached', () => {
	const skipped = { domain: 'example.com', message: NOT_ATTEMPTED, error: undefined, attempted: false };

	it('is never excused, even when the refreshed list shows the name', () => {
		// Somebody else's write during the outage. This submit never POSTed it, so crediting it
		// would toast "1 Domain added!" for a request that was never sent.
		const created = namesCreated(new Map(), domainNameCounts([{ domain: 'example.com' }] as never));

		expect(unresolvedFailures([skipped], created)).toEqual([skipped]);
	});

	it('stays in the retry list rather than silently leaving it', async () => {
		const outcome = await addDomainsSequentially(
			['a.example.com', 'b.example.com'],
			() => Promise.reject(new AxiosError('Network Error', 'ERR_NETWORK')),
		);
		const created = namesCreated(new Map(), domainNameCounts([{ domain: 'b.example.com' }] as never));

		expect(unresolvedFailures(outcome.failures, created).map(({ domain }) => domain)).toEqual([
			'a.example.com',
			'b.example.com',
		]);
	});
});

describe('stopsBatch', () => {
	it.each([401, 429])('stops on a %i, which is about the session or the client, not the name', async (status) => {
		const addOne = vi.fn(() => Promise.reject(axiosFailure(status, {})));

		await addDomainsSequentially(['a.example.com', 'b.example.com', 'c.example.com'], addOne);

		expect(addOne).toHaveBeenCalledOnce();
	});

	it.each([400, 403, 404, 409, 422])('keeps going past a %i, which refuses only that name', async (status) => {
		const addOne = vi.fn(() => Promise.reject(axiosFailure(status, {})));

		await addDomainsSequentially(['a.example.com', 'b.example.com', 'c.example.com'], addOne);

		expect(addOne).toHaveBeenCalledTimes(3);
	});
});

describe('withinReconcileWindow', () => {
	it('passes the value through when the list answers in time', async () => {
		await expect(withinReconcileWindow(Promise.resolve('listed'), 50)).resolves.toBe('listed');
	});

	it('gives up rather than holding the inline message behind a retried GET', async () => {
		const neverAnswers = new Promise<string>(() => {});

		await expect(withinReconcileWindow(neverAnswers, 10)).resolves.toBeUndefined();
	});
});

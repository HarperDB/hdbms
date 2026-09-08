import { SchemaOrganizationDomain } from '@/integrations/api/api.patch';
import { errorStatus } from '@/lib/errorStatus';
import { describeError } from '@/react-query/queryClient';

export interface DomainAdditionFailure {
	domain: string;
	message: string;
	error: unknown;
	/** False for a name the batch stopped before reaching. Nothing can excuse it: this submit
	 *  never sent it, so its appearance in the refreshed list is somebody else's write. */
	attempted: boolean;
}

export interface DomainAdditionOutcome {
	added: string[];
	failures: DomainAdditionFailure[];
}

/** Attempting every entry means nothing else bounds a stray paste, which splits into one POST
 *  per whitespace-delimited token. */
export const MAX_DOMAINS_PER_SUBMIT = 20;

/**
 * Whether the write may have landed despite the failure — the only question that decides if the
 * refreshed list gets to overrule the rejection.
 *
 * A 4xx other than 408 is the server refusing the request before doing work, so nothing was
 * written. Everything else may already have been applied: no response at all and a 408 say nothing
 * about the origin, and a 5xx can be a failure *after* the insert. AGENTS.md states the same rule
 * for the auth forms' non-idempotent POSTs — "only 503 promises a plain retry ... each of those
 * means the request may already have been applied" (RFC 9110 §9.2.2). Erring toward indeterminate
 * is safe here because crediting also requires the name to be newly present in the list, so an
 * add that never happened cannot be credited either way.
 */
export function isIndeterminate(error: unknown): boolean {
	const status = errorStatus(error);
	if (status === undefined || status === 408) {
		return true;
	}
	return status >= 500;
}

/** Room for `MAX_DOMAINS_PER_SUBMIT` names at the 253-character DNS maximum plus separators, so a
 *  legitimate maximal batch never hits it — the bound exists only to keep a pasted file from
 *  running the split and its allocations over megabytes of text. */
export const MAX_INPUT_LENGTH = 20 * 254 + 64;

export const NOT_ATTEMPTED = 'Not attempted.';

/** One submit can carry several domains — the "Add www as well" button writes
 *  `example.com, www.example.com` into the field. Case-folded because central-manager's
 *  `addDomain` only rejects a duplicate that is already ACTIVE, so `Example.com, example.com`
 *  would create two PENDING_VALIDATION rows and two DNS challenges for one identity. */
export function parseDomainList(input: string): string[] {
	return [...new Set(input.split(/[,\s]+/).map((domain) => domain.trim().toLowerCase()).filter(Boolean))];
}

/**
 * Whether this failure is about more than the one name, and so ends the batch.
 *
 * A per-name refusal (400/403/404/409/422) says nothing about the next name, so the loop goes on.
 * Everything else is about the server or the session: an indeterminate failure means a degraded or
 * unreachable server that would answer the next 19 names the same way, each costing the client's
 * full 60s timeout; a 401 has already cleared auth and started a redirect
 * (`src/lib/unauthorizedResponseHandler.ts`), so the rest would POST unauthenticated; a 429 is the
 * limiter refusing this client, and 19 immediate retries are the one thing not to send it.
 */
function stopsBatch(error: unknown): boolean {
	const status = errorStatus(error);
	return isIndeterminate(error) || status === 401 || status === 429;
}

/**
 * Resolves with both halves, never rejects — for two reasons. The form has to be able to commit
 * the domains created before a failure, and react-hook-form re-throws whatever `handleSubmit`'s
 * callback throws, so a rejection here escapes as an unhandled promise rejection.
 */
export async function addDomainsSequentially(
	domains: string[],
	addOne: (domain: string) => Promise<unknown>,
): Promise<DomainAdditionOutcome> {
	const added: string[] = [];
	const failures: DomainAdditionFailure[] = [];
	for (let i = 0; i < domains.length; i += 1) {
		const domain = domains[i];
		try {
			await addOne(domain);
			added.push(domain);
		} catch (error) {
			failures.push({ domain, message: describeError(error).message, error, attempted: true });
			if (stopsBatch(error)) {
				for (const skipped of domains.slice(i + 1)) {
					failures.push({ domain: skipped, message: NOT_ATTEMPTED, error: undefined, attempted: false });
				}
				break;
			}
		}
	}
	reportUnexpectedFailures(failures);
	return { added, failures };
}

/**
 * Stands in for the global mutation handler this mutation opts out of, whose `console.error` the
 * RUM SDK reports.
 *
 * One event per distinct status, which is what keeps both halves. A 409 is expected and stated
 * inline, so it is never reported — a paste of a dozen owned domains would otherwise bury real
 * signal (#1371, #1386, #1645). But collapsing to a single event per submit hid the second class:
 * a 500 on one domain and a 403 on another is a permissions regression behind a server fault, and
 * only one of them reached RUM.
 */
function reportUnexpectedFailures(failures: DomainAdditionFailure[]): void {
	const reported = new Set<number | undefined>();
	for (const { error, attempted } of failures) {
		// An entry the batch never reached is not a failure of its own.
		if (!attempted || errorStatus(error) === 409) {
			continue;
		}
		const status = errorStatus(error);
		if (reported.has(status)) {
			continue;
		}
		reported.add(status);
		console.error(error);
	}
}

/** The reconciliation is an optimisation — it can only ever excuse a failure, never create one —
 *  so it must not hold the inline message. The shared query client sets no `retry`, leaving React
 *  Query's default of 3 retries at up to the 60s client timeout each; a timed-out POST is exactly
 *  the case that reconciles, so without a bound the form would sit disabled for minutes. */
export const RECONCILE_TIMEOUT_MS = 4000;

/** Resolves with `undefined` if the list does not answer in time, which credits nothing. */
export async function withinReconcileWindow<T>(
	pending: Promise<T>,
	timeoutMs = RECONCILE_TIMEOUT_MS,
): Promise<T | undefined> {
	let timer: ReturnType<typeof setTimeout> | undefined;
	try {
		return await Promise.race([
			pending,
			new Promise<undefined>((resolve) => {
				timer = setTimeout(() => resolve(undefined), timeoutMs);
			}),
		]);
	} finally {
		clearTimeout(timer);
	}
}

/** Counts, not a set: central-manager accepts a second PENDING_VALIDATION row for a name it
 *  already holds, so presence alone cannot see one appear. */
export function domainNameCounts(domains: SchemaOrganizationDomain[] | undefined): Map<string, number> {
	const counts = new Map<string, number>();
	for (const row of domains ?? []) {
		const name = String(row?.domain ?? '').toLowerCase();
		counts.set(name, (counts.get(name) ?? 0) + 1);
	}
	return counts;
}

/** `created` is what the submit *added*, not what the list holds: the org list necessarily
 *  contains a name the server rejected as a duplicate. */
export function unresolvedFailures(
	failures: DomainAdditionFailure[],
	created: Set<string>,
): DomainAdditionFailure[] {
	return failures.filter(({ domain, error, attempted }) =>
		!attempted || !isIndeterminate(error) || !created.has(domain)
	);
}

/** Names the list holds more of than it did. An absent `before` is a list that never loaded,
 *  indistinguishable from an org that owns nothing, so nothing can be credited against it. */
export function namesCreated(
	before: Map<string, number> | undefined,
	after: Map<string, number>,
): Set<string> {
	if (!before) {
		return new Set();
	}
	const created = new Set<string>();
	for (const [name, count] of after) {
		if (count > (before.get(name) ?? 0)) {
			created.add(name);
		}
	}
	return created;
}

export function describeDomainFailures(failures: DomainAdditionFailure[]): string {
	return failures.map(({ domain, message }) => `${domain} — ${message}`).join('; ');
}

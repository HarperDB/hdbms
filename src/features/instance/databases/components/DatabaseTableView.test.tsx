/**
 * @vitest-environment jsdom
 */
import { InstanceDatabaseMap, InstanceTable } from '@/integrations/api/api.patch';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { DatabaseTableView } from './DatabaseTableView';

// The dropdown's own permission gate is the thing under test; every other permission hook just
// needs a fixed answer so the toolbar around it renders without pulling in the auth store/router.
const permissionState = vi.hoisted(() => ({
	canManageBrowseInstance: true,
	canImportFromFile: true,
	allowedSources: ['csv-data', 'csv-url', 'json-records'] as string[],
}));

vi.mock('@tanstack/react-router', () => {
	// Stable references: the component keys effects off these objects' identity, and the real
	// router hooks only produce a new one when params/search actually change.
	const params = {};
	const search = {};
	return {
		useParams: () => params,
		useSearch: () => search,
		Link: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
	};
});

vi.mock('@/config/useInstanceClient', () => ({
	useInstanceClientIdParams: () => ({ entityId: 'instance-1', instanceClient: {}, entityType: 'instance' }),
}));

vi.mock('@/hooks/useAuth', () => ({
	useStaffPermission: () => false,
}));

vi.mock('@/hooks/usePermissions', () => ({
	useInstanceBrowseManagePermission: () => permissionState.canManageBrowseInstance,
	useInstanceImportDataPermission: () => true,
	useInstanceImportCapabilities: () => ({
		methods: { sample: true, file: permissionState.canImportFromFile, url: true },
		allowsSource: (kind: string) => permissionState.allowedSources.includes(kind),
		allowsDestination: () => true,
	}),
	useInstanceSchemaTablePermission: () => true,
	useInstanceTablePutPermission: () => true,
}));

// The empty state fires its launches through the watcher; capture them without replacing the module
// (`useWatchedValue` is still read elsewhere in this tree).
const watchedValues = vi.hoisted(() => ({ calls: [] as [string, unknown][] }));

vi.mock('@/lib/events/watcher', async (importOriginal) => {
	const actual = await importOriginal<typeof import('@/lib/events/watcher')>();
	return {
		...actual,
		setWatchedValue: (key: string, value: unknown) => {
			watchedValues.calls.push([key, value]);
		},
	};
});

// The grid and row editor aren't what this file pins -- swap them for stubs so a render doesn't
// need real table data or a Radix Dialog. TableView's stub keeps its props, so a test can still
// show the grid was built from the schema this render actually had.
const tableViewColumns = vi.hoisted(() => ({ current: [] as { accessorKey?: string }[] }));

vi.mock('./TableView', () => ({
	TableView: ({ columns, emptyState }: { columns: { accessorKey?: string }[]; emptyState?: React.ReactNode }) => {
		tableViewColumns.current = columns;
		// Rendering the slot is what lets a test follow a card click through to the launch it fires.
		return <>{emptyState}</>;
	},
}));
vi.mock('./PickColumnsDropdown', () => ({ PickColumnsDropdown: () => null }));
vi.mock('../modals/EditTableRowModal', () => ({ EditTableRowModal: () => null }));

// describe_table is the table's own schema fetch; every other query this component reads is
// irrelevant to the menu and comes back empty. Matching by queryKey (rather than mocking each
// `get*QueryOptions` builder) keeps the real gating logic -- which reads `instanceDatabaseMap`
// straight from props -- exercised as written.
const describeTableData = vi.hoisted(() => ({ current: undefined as InstanceTable | undefined }));

vi.mock('@tanstack/react-query', async (importOriginal) => {
	const actual = await importOriginal<typeof import('@tanstack/react-query')>();
	return {
		...actual,
		useQuery: (options: { queryKey: readonly unknown[] }) =>
			options.queryKey.includes('describe_table')
				? { data: describeTableData.current, isFetching: false, isError: false }
				: { data: undefined, isFetching: false, isError: false, refetch: vi.fn() },
	};
});

// Radix's dropdown opens on pointerdown and probes pointer-capture APIs jsdom doesn't implement.
beforeAll(() => {
	Element.prototype.hasPointerCapture ??= () => false;
	Element.prototype.setPointerCapture ??= () => undefined;
	Element.prototype.releasePointerCapture ??= () => undefined;
	Element.prototype.scrollIntoView ??= () => undefined;
	if (typeof window.PointerEvent === 'undefined') {
		window.PointerEvent = class extends MouseEvent {} as typeof PointerEvent;
	}
});

afterEach(() => {
	cleanup();
	permissionState.canManageBrowseInstance = true;
	permissionState.canImportFromFile = true;
	permissionState.allowedSources = ['csv-data', 'csv-url', 'json-records'];
	tableViewColumns.current = [];
	watchedValues.calls = [];
});

const dogTable = {
	attributes: [{ attribute: 'id', type: 'string', is_primary_key: true, indexed: true }],
	primary_key: 'id',
} as unknown as InstanceTable;

function renderView(
	{ instanceDatabaseMap }: { instanceDatabaseMap?: InstanceDatabaseMap } = {},
) {
	describeTableData.current = dogTable;
	const queryClient = new QueryClient();
	return render(
		<QueryClientProvider client={queryClient}>
			<DatabaseTableView databaseName="data" tableName="dog" instanceDatabaseMap={instanceDatabaseMap} />
		</QueryClientProvider>,
	);
}

function openTableOptions() {
	fireEvent.pointerDown(screen.getByRole('button', { name: /table options/i }), { button: 0, ctrlKey: false });
}

const exportCsvItem = () => screen.queryByRole('menuitem', { name: 'Export CSV' });
const importDataItem = () => screen.queryByRole('menuitem', { name: 'Import Data' });
const dropTableItem = () => screen.queryByRole('menuitem', { name: 'Drop Table' });
const dropDatabaseItem = () => screen.queryByRole('menuitem', { name: 'Drop Database' });

function isDisabled(el: HTMLElement) {
	return el.getAttribute('aria-disabled') === 'true' || el.hasAttribute('data-disabled');
}

describe('DatabaseTableView table options menu', () => {
	// Both actions live in the menu at every width -- no toolbar button duplicates them, and no
	// width-conditional class hides either entry. No Tailwind runs under jsdom, so the width classes
	// are asserted by name rather than by computed visibility.
	it('offers Import Data and Export CSV only as menu entries, at every width', () => {
		renderView();

		expect(screen.queryByRole('button', { name: 'Import Data' })).toBeNull();
		expect(screen.queryByRole('button', { name: 'Export CSV' })).toBeNull();

		openTableOptions();

		for (const item of [importDataItem()!, exportCsvItem()!]) {
			expect(item).not.toBeNull();
			expect([...item.classList].filter((name) => /(^|:)hidden$/.test(name))).toEqual([]);
		}
	});

	// `describe_all` (the map) can be slower or unreachable for a role whose allowlist grants
	// describe_table + search but not describe_all -- the trigger must not gate on it, or Export
	// CSV becomes unreachable for that role.
	it('is not disabled and offers Export CSV and Import Data while the database map is absent', () => {
		renderView({ instanceDatabaseMap: undefined });

		const trigger = screen.getByRole('button', { name: /table options/i });
		expect(trigger.hasAttribute('disabled')).toBe(false);

		openTableOptions();

		expect(exportCsvItem()).not.toBeNull();
		expect(isDisabled(exportCsvItem()!.closest('[role="menuitem"]')!)).toBe(false);
		expect(importDataItem()).not.toBeNull();

		// The grid came up from describe_table on its own, so this is a table the user can read and
		// therefore expects to be able to export -- not a half-loaded view.
		expect(tableViewColumns.current.map(({ accessorKey }) => accessorKey)).toContain('id');
	});

	// Whether another table would remain is something only the map can answer, so Drop Table waits
	// for it. Drop Database never needed the map -- it acts on the database named by the route.
	it('withholds Drop Table but keeps Drop Database while the database map is absent', () => {
		renderView({ instanceDatabaseMap: undefined });

		openTableOptions();

		expect(dropTableItem()).toBeNull();
		expect(dropDatabaseItem()).not.toBeNull();
	});

	// A resolved map that doesn't list this database is just as uninformative as no map at all --
	// counting its (zero) tables would otherwise read as "not the last one".
	it('withholds Drop Table when the map resolved without this database', () => {
		renderView({ instanceDatabaseMap: { other: { cat: {} } } as never });

		openTableOptions();

		expect(dropTableItem()).toBeNull();
	});

	it('offers Drop Table and Drop Database once the map resolves, for a role that can manage', () => {
		renderView({ instanceDatabaseMap: { data: { dog: {}, cat: {} } } as never });

		openTableOptions();

		expect(dropTableItem()).not.toBeNull();
		expect(dropDatabaseItem()).not.toBeNull();
	});

	it('offers neither drop entry to a role that cannot manage', () => {
		permissionState.canManageBrowseInstance = false;
		renderView({ instanceDatabaseMap: { data: { dog: {}, cat: {} } } as never });

		openTableOptions();

		expect(dropTableItem()).toBeNull();
		expect(dropDatabaseItem()).toBeNull();
		expect(exportCsvItem()).not.toBeNull();
	});

	// Dropping the last table in a database is really dropping the database, so that entry alone
	// covers it -- Drop Table would leave nothing to drop.
	it('offers only Drop Database when this is the only table in the database', () => {
		renderView({ instanceDatabaseMap: { data: { dog: {} } } as never });

		openTableOptions();

		expect(dropTableItem()).toBeNull();
		expect(dropDatabaseItem()).not.toBeNull();
	});
});

describe('DatabaseTableView empty state', () => {
	const importCard = () => screen.getByRole('button', { name: /Import your data/ });
	const seedCard = () => screen.getByRole('button', { name: /Seed some data/ });
	const launches = () => watchedValues.calls.filter(([key]) => key === 'ShowImportData').map(([, value]) => value);

	it('launches the import modal on a file import from the Import card', () => {
		renderView();
		fireEvent.click(importCard());
		expect(launches()).toEqual([{ databaseName: 'data', tableName: 'dog', method: 'file' }]);
	});

	it('falls back to the URL method when files are not a granted source', () => {
		permissionState.canImportFromFile = false;
		renderView();
		fireEvent.click(importCard());
		expect(launches()).toEqual([{ databaseName: 'data', tableName: 'dog', method: 'url' }]);
	});

	it('launches the same modal on sample data from the Seed card', () => {
		renderView();
		fireEvent.click(seedCard());
		expect(launches()).toEqual([{ databaseName: 'data', tableName: 'dog', method: 'sample' }]);
	});

	// `dogTable` is primary-key only, so random records have nothing to model. With bundled datasets
	// denied too, Seed would open a dropdown with nothing in it -- an insert-only role's dead end.
	it('withholds Seed when no dataset and no random records are available', () => {
		permissionState.allowedSources = ['json-records'];
		renderView();
		expect(screen.queryByRole('button', { name: /Seed some data/ })).toBeNull();
		expect(screen.getByRole('button', { name: /Import your data/ })).toBeTruthy();
	});
});

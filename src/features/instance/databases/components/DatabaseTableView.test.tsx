/**
 * @vitest-environment jsdom
 */
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { DatabaseTableView } from './DatabaseTableView';

const stableParams = vi.hoisted(() => ({
	instance: { instanceId: 'instance-1' },
	client: { instanceClient: {}, entityId: 'instance-1', entityType: 'instance' },
	search: {},
}));

vi.mock('@tanstack/react-router', () => ({
	Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
	useParams: () => stableParams.instance,
	useSearch: () => stableParams.search,
}));

vi.mock('@tanstack/react-query', async (importOriginal) => {
	const actual = await importOriginal<typeof import('@tanstack/react-query')>();
	return {
		...actual,
		useQuery: (options: { queryKey?: readonly unknown[] }) => ({
			data: options.queryKey?.at(-1) === 'describe_table'
				? { primary_key: 'id', attributes: [{ attribute: 'id', type: 'String', is_primary_key: true }] }
				: undefined,
			isError: false,
			isFetching: false,
			refetch: vi.fn(),
		}),
		useQueryClient: () => ({ invalidateQueries: vi.fn() }),
	};
});

vi.mock('@/config/useInstanceClient', () => ({
	useInstanceClientIdParams: () => stableParams.client,
}));

vi.mock('@/hooks/useAuth', () => ({ useStaffPermission: () => false }));

vi.mock('@/hooks/usePermissions', () => ({
	useInstanceBrowseManagePermission: () => true,
	useInstanceImportDataPermission: () => true,
	useInstanceSchemaTablePermission: () => true,
	useInstanceTablePutPermission: () => true,
}));

vi.mock('@/features/instance/databases/hooks/useExportTableCsv', () => ({
	useExportTableCsv: () => ({ exportCsv: vi.fn(), isExporting: false }),
}));

vi.mock('@/integrations/api/instance/database/cleanupOrphanBlobs', () => ({
	useCleanupOrphanBlobsMutation: () => ({ mutate: vi.fn(), isPending: false }),
}));

vi.mock('@/integrations/api/instance/database/deleteTableRecords', () => ({
	useDeleteTableRecords: () => ({ mutate: vi.fn(), isPending: false }),
}));

vi.mock('@/integrations/api/instance/database/putTableRecords', async (importOriginal) => {
	const actual = await importOriginal<typeof import('@/integrations/api/instance/database/putTableRecords')>();
	return {
		...actual,
		usePutTableRecords: () => ({ mutate: vi.fn(), isPending: false }),
	};
});

vi.mock('@/integrations/api/instance/database/updateTableRecords', async (importOriginal) => {
	const actual = await importOriginal<typeof import('@/integrations/api/instance/database/updateTableRecords')>();
	return {
		...actual,
		useUpdateTableRecords: () => ({ mutate: vi.fn(), isPending: false }),
	};
});

vi.mock('./PickColumnsDropdown', () => ({ PickColumnsDropdown: () => null }));
vi.mock('./TableView', () => ({ TableView: () => null }));
vi.mock('@/features/instance/databases/modals/EditTableRowModal', () => ({ EditTableRowModal: () => null }));

beforeAll(() => {
	Element.prototype.hasPointerCapture ??= () => false;
	Element.prototype.setPointerCapture ??= () => undefined;
	Element.prototype.releasePointerCapture ??= () => undefined;
	Element.prototype.scrollIntoView ??= () => undefined;
	if (typeof window.PointerEvent === 'undefined') {
		window.PointerEvent = class extends MouseEvent {} as typeof PointerEvent;
	}
});

afterEach(() => cleanup());

describe('DatabaseTableView table options', () => {
	it('keeps schema-backed actions available when the database map is unavailable', () => {
		render(<DatabaseTableView databaseName="data" tableName="dog" />);

		const trigger = screen.getByRole('button', { name: 'Table options' });
		expect(trigger.hasAttribute('disabled')).toBe(false);
		fireEvent.pointerDown(trigger, { button: 0, ctrlKey: false });

		expect(screen.getByRole('menuitem', { name: 'Import Data' })).toBeTruthy();
		expect(screen.getByRole('menuitem', { name: 'Export CSV' })).toBeTruthy();
		expect(screen.queryByRole('menuitem', { name: 'Drop Table' })).toBeNull();
		expect(screen.getByRole('menuitem', { name: 'Drop Database' })).toBeTruthy();
	});
});

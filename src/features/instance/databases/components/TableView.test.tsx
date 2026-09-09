/**
 * @vitest-environment jsdom
 */
import { ColumnDef } from '@/lib/table';
import { ColumnSizingState, ColumnVisibilityState } from '@tanstack/react-table';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { z } from 'zod';
import { ColumnFiltersSchema } from './ColumnFilters';
import { TableView } from './TableView';

beforeAll(() => {
	Element.prototype.hasPointerCapture ??= () => false;
	Element.prototype.scrollIntoView ??= () => undefined;
	globalThis.ResizeObserver ??= class {
		observe() {}
		unobserve() {}
		disconnect() {}
	};
});

afterEach(() => cleanup());

const columns: ColumnDef<Record<string, unknown>>[] = [
	{ header: 'id', accessorKey: 'id' },
	{ header: 'type', accessorKey: 'type' },
];
// A stable reference so TanStack reuses the same row objects across re-renders —
// which is exactly the condition under which the cell memo used to go stale.
const data: Record<string, unknown>[] = [{ id: 'abc-123', type: 'demo' }];

function Harness(
	{ columnVisibility, resultSetKey = 'page-0', tableIdentity = 'dev.dog' }: {
		columnVisibility: ColumnVisibilityState;
		resultSetKey?: string;
		tableIdentity?: string;
	},
) {
	const columnFiltersForm = useForm<z.infer<typeof ColumnFiltersSchema>>({ defaultValues: {} });
	const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});
	return (
		<TableView<Record<string, unknown>>
			applyFilters={() => undefined}
			columnFiltersForm={columnFiltersForm}
			columns={columns}
			columnVisibility={columnVisibility}
			columnSizing={columnSizing}
			setColumnSizing={setColumnSizing}
			data={data}
			pageIndex={0}
			pageSize={20}
			primaryKey="id"
			resultSetKey={resultSetKey}
			tableIdentity={tableIdentity}
			setPageIndex={() => undefined}
			setPageSize={() => undefined}
			filtersToggled={false}
			totalPages={1}
			totalRecords={1}
		/>
	);
}

describe('TableView column visibility', () => {
	it('drops a column from the body when it is hidden, not just from the header', () => {
		const { rerender } = render(<Harness columnVisibility={{}} />);
		// All columns visible: both values render in the body.
		expect(screen.getByText('abc-123')).toBeTruthy();
		expect(screen.getByText('demo')).toBeTruthy();

		// Hide the primary-key column.
		rerender(<Harness columnVisibility={{ id: false }} />);

		// The hidden column's cell must disappear from the body too (regression:
		// the body row used to keep rendering the stale cell, misaligning columns).
		expect(screen.queryByText('abc-123')).toBeNull();
		expect(screen.getByText('demo')).toBeTruthy();
	});
});

describe('TableView sorting', () => {
	const sortableColumns: ColumnDef<Record<string, unknown>>[] = [
		{ header: 'id', accessorKey: 'id', enableSorting: true },
	];
	const unsortedRows: Record<string, unknown>[] = [{ id: 'zeta' }, { id: 'alpha' }];

	function SortableHarness({ onColumnClick }: { onColumnClick: (accessorKey: string) => void }) {
		const columnFiltersForm = useForm<z.infer<typeof ColumnFiltersSchema>>({ defaultValues: {} });
		const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});
		return (
			<TableView<Record<string, unknown>>
				applyFilters={() => undefined}
				columnFiltersForm={columnFiltersForm}
				columns={sortableColumns}
				columnVisibility={{}}
				columnSizing={columnSizing}
				setColumnSizing={setColumnSizing}
				data={unsortedRows}
				onColumnClick={onColumnClick}
				pageIndex={0}
				pageSize={20}
				primaryKey="id"
				resultSetKey="page-0"
				tableIdentity="dev.dog"
				setPageIndex={() => undefined}
				setPageSize={() => undefined}
				filtersToggled={false}
			/>
		);
	}

	it('reports the sort to the caller without reordering rows itself', () => {
		// The browse table is server-sorted: the click has to reach onColumnClick (which re-queries)
		// and the rows on screen must stay in the order the server returned them. TanStack v9 shares
		// one feature set across studio's tables, so this table opts out with `manualSorting: true` --
		// without it the registered sorted row model would reorder the current page behind the query.
		const sorts: string[] = [];
		render(<SortableHarness onColumnClick={(accessorKey) => sorts.push(accessorKey)} />);
		expect(Array.from(document.querySelectorAll('tbody td[data-col-id="id"]')).map((c) => c.textContent))
			.toEqual(['zeta', 'alpha']);

		fireEvent.click(screen.getByRole('button', { name: 'id' }));

		expect(sorts).toEqual(['id']);
		expect(Array.from(document.querySelectorAll('tbody td[data-col-id="id"]')).map((c) => c.textContent))
			.toEqual(['zeta', 'alpha']);
	});
});

describe('TableView column resizing', () => {
	it('renders a resize handle for each column header', () => {
		// Regression: the handle used to be gated on columnDef.enableResizing (never set), so it
		// never rendered. It is now gated on getCanResize(), driven by the table-level flag.
		const { container } = render(<Harness columnVisibility={{}} />);
		const handles = container.querySelectorAll('svg.lucide-grip-vertical');
		expect(handles.length).toBe(columns.length);
	});
});

describe('TableView scroll position', () => {
	function scroller(container: HTMLElement) {
		const element = container.querySelector<HTMLElement>('[data-slot="table-container"]');
		if (!element) {
			throw new Error('scroll container not found');
		}
		return element;
	}

	it('returns to the top of a new result set, keeping the sideways position', () => {
		// The scroller is the same DOM node across paging/sorting/filtering, so without an explicit
		// reset page 2 opens wherever page 1 was left. Sideways position survives: the columns are the
		// same ones, so the column the user scrolled out to is still the one they are reading.
		const { container, rerender } = render(<Harness columnVisibility={{}} resultSetKey="page-0" />);
		const element = scroller(container);
		element.scrollTop = 240;
		element.scrollLeft = 500;

		rerender(<Harness columnVisibility={{}} resultSetKey="page-1" />);

		expect(element.scrollTop).toBe(0);
		expect(element.scrollLeft).toBe(500);
	});

	it('returns to the top-left corner when the table itself changes', () => {
		// A different table means different columns, so the old sideways offset points at nothing.
		const { container, rerender } = render(
			<Harness columnVisibility={{}} resultSetKey="dog-page-0" tableIdentity="dev.dog" />,
		);
		const element = scroller(container);
		element.scrollTop = 240;
		element.scrollLeft = 500;

		rerender(<Harness columnVisibility={{}} resultSetKey="breed-page-0" tableIdentity="dev.breed" />);

		expect(element.scrollTop).toBe(0);
		expect(element.scrollLeft).toBe(0);
	});

	it('leaves the scroll position alone when the same rows re-render', () => {
		// A background refetch or a column-visibility toggle must not yank the user back to the top.
		const { container, rerender } = render(<Harness columnVisibility={{}} />);
		const element = scroller(container);
		element.scrollTop = 240;
		element.scrollLeft = 500;

		rerender(<Harness columnVisibility={{ type: false }} />);

		expect(element.scrollTop).toBe(240);
		expect(element.scrollLeft).toBe(500);
	});
});

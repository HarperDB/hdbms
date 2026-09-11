/**
 * @vitest-environment jsdom
 */
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { EmptyResultSet } from './EmptyResultSet';

afterEach(() => cleanup());

function renderEmptyResultSet(overrides: Partial<Parameters<typeof EmptyResultSet>[0]> = {}) {
	const props = {
		tableName: 'users',
		isFiltered: false,
		isPastFirstPage: false,
		canImport: true,
		canSeed: true,
		canAddRecords: true,
		onImport: vi.fn(),
		onSeed: vi.fn(),
		onAddRecords: vi.fn(),
		onClearFilters: vi.fn(),
		...overrides,
	};
	render(<EmptyResultSet {...props} />);
	return props;
}

describe('EmptyResultSet', () => {
	it('offers importing and seeding as two separate invitations on an empty table', () => {
		const props = renderEmptyResultSet();

		const importButton = screen.getByRole('button', { name: /Import your data/ });
		const seedButton = screen.getByRole('button', { name: /Seed some data/ });
		expect(importButton).not.toBe(seedButton);

		fireEvent.click(importButton);
		expect(props.onImport).toHaveBeenCalledTimes(1);
		expect(props.onSeed).not.toHaveBeenCalled();

		fireEvent.click(seedButton);
		expect(props.onSeed).toHaveBeenCalledTimes(1);
		expect(props.onImport).toHaveBeenCalledTimes(1);
	});

	it('names the table it is empty, and offers adding a record by hand', () => {
		const props = renderEmptyResultSet();
		expect(screen.getByRole('heading').textContent).toContain('users');

		fireEvent.click(screen.getByRole('button', { name: /Add New Record/ }));
		expect(props.onAddRecords).toHaveBeenCalledTimes(1);
	});

	// Each invitation is gated on its own permission: a role granted only `csv_url_load` can bring its
	// own data but not seed, and one granted only `insert`/`csv_data_load` the other way round.
	it.each([
		{ canImport: false, canSeed: true, gone: /Import your data/, kept: /Seed some data/ },
		{ canImport: true, canSeed: false, gone: /Seed some data/, kept: /Import your data/ },
	])('drops the invitation the role cannot act on (canImport=$canImport)', ({ canImport, canSeed, gone, kept }) => {
		renderEmptyResultSet({ canImport, canSeed });
		expect(screen.queryByRole('button', { name: gone })).toBeNull();
		expect(screen.getByRole('button', { name: kept })).toBeTruthy();
	});

	it('says nothing about getting data in when the role can do none of it', () => {
		renderEmptyResultSet({ canImport: false, canSeed: false, canAddRecords: false });
		expect(screen.getByRole('heading').textContent).toContain('has no records yet');
		expect(screen.queryAllByRole('button')).toHaveLength(0);
	});

	// An empty *result set* is not an empty table: offering to import into a table that already has
	// records the filters just didn't match would be telling the user something untrue.
	it('points at the filters, not at importing, when filters matched nothing', () => {
		const props = renderEmptyResultSet({ isFiltered: true });
		expect(screen.getByRole('heading').textContent).toContain('No records match these filters');
		expect(screen.queryByRole('button', { name: /Import your data/ })).toBeNull();
		expect(screen.queryByRole('button', { name: /Seed some data/ })).toBeNull();

		fireEvent.click(screen.getByRole('button', { name: /Clear Filters/ }));
		expect(props.onClearFilters).toHaveBeenCalledTimes(1);
	});

	// Likewise past the end of the records: on page 3 of a filtered set "nothing matched" would be
	// wrong too, so the page explanation wins over both of the others.
	it('explains the page instead, past the first page, filtered or not', () => {
		renderEmptyResultSet({ isFiltered: true, isPastFirstPage: true });
		expect(screen.getByRole('heading').textContent).toContain('No records on this page');
		expect(screen.queryByRole('button')).toBeNull();
	});
});

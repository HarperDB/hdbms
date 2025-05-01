'use client';

import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	Row,
	useReactTable,
} from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown } from 'lucide-react';

interface BrowseDataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	totalPages: number;
	totalRecords: number;
	onRowClick?: (row: Row<TData>) => void;
	onColumnClick?: (accessorKey: string, isDescending: boolean) => Promise<void>;
	onSetRowsPerPage: (pageSize: number) => void;
	setPaginationOffset: (pageIndex: number) => void;
}

function BrowseDataTable<TData, TValue>({
	columns,
	data,
	totalPages,
	totalRecords,
	onRowClick,
	onColumnClick,
	onSetRowsPerPage,
	setPaginationOffset,
}: BrowseDataTableProps<TData, TValue>) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		initialState: {
			pagination: {
				pageIndex: 0,
				pageSize: 20,
			},
		},
	});

	return (
		<div>
			<div className="bg-black-dark rounded-md">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id} className="border-none">
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id} className="p-4">
											<Button
												type="button"
												variant="ghost"
												onClick={() => {
													header.column.toggleSorting(header.column.getIsSorted() === 'asc');
													// @ts-expect-error accessorKey does exist unsure why ts is complaining
													onColumnClick?.(header.column.columnDef.accessorKey, header.column.getIsSorted() === 'desc');
												}}
											>
												{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
												<ArrowUpDown />
											</Button>
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody className="bg-black  border-grey-700 border">
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}
									onClick={() => onRowClick?.(row)}
									className="hover:bg-muted/10 data-[state=selected]:bg-muted"
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id} className="p-2 max-w-32 overflow-x-hidden text-ellipsis whitespace-nowrap">
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<div className="flex items-center space-x-2">
					<p className="text-sm font-medium">Rows per page</p>
					<Select
						value={`${table.getState().pagination.pageSize}`}
						onValueChange={(value) => {
							onSetRowsPerPage(Number(value));
							table.setPageSize(Number(value));
						}}
					>
						<SelectTrigger className="h-8 w-[70px]">
							<SelectValue placeholder={table.getState().pagination.pageSize} />
						</SelectTrigger>
						<SelectContent side="top">
							{[20, 50, 100, 250].map((pageSize) => (
								<SelectItem key={pageSize} value={`${pageSize}`}>
									{pageSize}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<span>Total Pages: {totalPages}</span>
				<span>Total Records: {totalRecords}</span>
				<Button
					variant="outline"
					size="sm"
					onClick={() => setPaginationOffset()}
					// disabled={!table.getCanPreviousPage()}
				>
					Previous
				</Button>
				{/* <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
					Next
				</Button> */}
				<Button
					variant="outline"
					size="sm"
					onClick={() => setPaginationOffset(page + 1)}
					// disabled={!table.getCanNextPage()}
				>
					Next
				</Button>
			</div>
		</div>
	);
}

export default BrowseDataTable;

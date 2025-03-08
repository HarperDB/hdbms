import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

function DataTable({ data: [], columns: [] }) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});
	return (
		<table className="w-full border-collapse">
			<thead>
				{table.getHeaderGroups().map((headerGroup) => (
					<tr key={headerGroup.id} className="border-b">
						{headerGroup.headers.map((header) => (
							<th key={header.id} className="px-4 py-2 text-left">
								{flexRender(header.column.columnDef.header, header.getContext())}
							</th>
						))}
					</tr>
				))}
			</thead>
			<tbody>
				{table.getRowModel().rows.map((row) => (
					<tr key={row.id} className="border-b">
						{row.getVisibleCells().map((cell) => (
							<td key={cell.id} className="px-4 py-2">
								{flexRender(cell.column.columnDef.cell, cell.getContext())}
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
}

export default DataTable;

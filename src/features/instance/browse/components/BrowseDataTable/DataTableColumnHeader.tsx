import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ColumnDef, flexRender, Table } from '@tanstack/react-table';

function DataTableColumnHeader(table: Table<TData>, onHeaderColumnClick: (column: ColumnDef<TData>) => void) {
	const { hash_attribute, attributes } = describeTableData.data;
	// console.log('header data:', describeTableData);
	// Build out describe table data types migrate AttributeTypes to it
	const allAttributes = attributes.map((item: AttributesTypes) => item.attribute);

	const orderedColumns = allAttributes.filter(
		(attribute) => ![hash_attribute, '__createdtime__', '__updatedtime__'].includes(attribute)
	);

	if (allAttributes.includes('__createdtime__')) orderedColumns.push('__createdtime__');
	if (allAttributes.includes('__updatedtime__')) orderedColumns.push('__updatedtime__');

	const dataTableColumns: ColumnDef<string[]>[] = (
		hash_attribute ? [hash_attribute, ...orderedColumns] : [...orderedColumns]
	).map((columnKey) => ({
		header: columnKey === 'id' ? 'Primary Key' : columnKey.toString(),
		accessorKey: columnKey.toString(),
	}));

	return (
		<TableHeader>
			{table.getHeaderGroups().map((headerGroup) => (
				<TableRow key={headerGroup.id} className="border-none">
					{headerGroup.headers.map((header) => {
						return (
							<TableHead key={header.id} className="p-4">
								{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
							</TableHead>
						);
					})}
				</TableRow>
			))}
		</TableHeader>
	);
}

export default DataTableColumnHeader;

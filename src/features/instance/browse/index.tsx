import { Suspense, useEffect, useState } from 'react';
import { getRouteApi, Outlet, useNavigate } from '@tanstack/react-router';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import CreateNewTableModal from '@/features/instance/modals/CreateNewTableModal';
import { getDescribeAllQueryOptions } from '@/features/instance/queries/operations/useDescribeAll';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import buildInstanceDataStructure from '@/features/instance/browse/functions/buildInstanceDataStructure';
import { ArrowRight, Check, Minus, Plus, Trash } from 'lucide-react';
import { useCreateDatabaseSubmitMutation } from '@/features/instance/operations/mutations/createDatabase';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import Loading from '@/components/Loading';
import { useDeleteDatabaseMutation } from '@/features/instance/operations/mutations/deleteDatabase';
import { DeleteTableData, useDeleteTableMutation } from '@/features/instance/operations/mutations/deleteTable';
import BrowseSideBar from '@/features/instance/browse/components/BrowseSideBar';

const route = getRouteApi('');

const NewDatabaseSchema = z.object({
	newDatabaseName: z
		.string({
			message: 'Please enter a valid database name.',
		})
		.min(1, { message: 'Database name is required' })
		.max(75, { message: 'Database name must be less than 75 characters' })
		.regex(/^[a-zA-Z0-9_]+$/, { message: 'Database name can only contain letters, numbers, and underscores' }),
});

const getTableList = (structure: Record<string, any>, selectedDatabase: string) => {
	return Object.keys(structure?.[selectedDatabase] || []);
};

function Browse() {
	// const queryClient = useQueryClient();
	// const { organizationId, clusterId, instanceId, schemaName, tableName } = route.useParams();
	const { instanceId, schemaName, tableName } = route.useParams();
	const { data: describeAllQueryData, refetch: refetchDescribeAllQueryData } = useSuspenseQuery(
		getDescribeAllQueryOptions(instanceId)
	);
	const structure = buildInstanceDataStructure(describeAllQueryData);
	// TODO: Figure out how to get structure to update after describeAllQueryData changes and propegate changes to all other data that needs to be updated

	const [databaseList, setDatabaseList] = useState<string[]>(Object.keys(structure || {}));
	const [selectedDatabase, setSelectedDatabase] = useState<string | undefined>(schemaName);
	const [selectedTable, setSelectedTable] = useState<string | undefined>(tableName);
	const [tables, setTables] = useState<string[]>(Object.keys(structure[selectedDatabase] || []));

	const onSelectDatabase = (databaseName: string) => {
		setSelectedDatabase(databaseName);
		// navigate({
		// 	to: `/orgs/${organizationId}/clusters/${clusterId}/instance/${instanceId}/browse/$schemaName`,
		// 	params: { schemaName: selectedSchema },
		// });
		setTables(getTableList(structure, databaseName));
	};

	const onSelectTable = (tableName: string) => {
		setSelectedTable(tableName);
	};

	const handleUpdatedTables = (tableName: string) => {
		setTables((tables) => [...tables, tableName]);
	};

	// Update structure when describeAllQueryData changes

	// const navigate = useNavigate();

	// const form = useForm({
	// 	resolver: zodResolver(NewDatabaseSchema),
	// 	defaultValues: {
	// 		newDatabaseName: '',
	// 	},
	// });

	// const [isCreatingDatabase, setIsCreatingDatabase] = useState(false);
	// const databases = Object.keys(structure || {});
	// const [tables, setTables] = useState<string[]>(Object.keys(structure[selectedDatabase] || []));

	// const handleUpdatedTables = (tableName: string) => {
	// 	setTables((tables) => [...tables, tableName]);
	// };

	// const handleSelectedTable = (selectedTableName: string) => {
	// 	if (!selectedTableName) return;
	// 	setSelectedTable(selectedTableName);
	// 	navigate({
	// 		to: `/orgs/${organizationId}/clusters/${clusterId}/instance/${instanceId}/browse/${selectedDatabase}/${selectedTableName}`,
	// 	});
	// };

	// const { mutate: createNewDatabase } = useCreateDatabaseSubmitMutation();
	// const { mutate: deleteDatabase } = useDeleteDatabaseMutation();
	// const { mutate: deleteTable } = useDeleteTableMutation();

	// const submitNewDatabase = async (formData: z.infer<typeof NewDatabaseSchema>) => {
	// 	await createNewDatabase(formData, {
	// 		onSuccess: () => {
	// 			queryClient.invalidateQueries({ queryKey: [instanceId] });
	// 			toast.success(`Database ${formData.newDatabaseName} created successfully`);
	// 			setIsCreatingDatabase(false);
	// 			form.reset();
	// 		},
	// 	});
	// };

	// const deleteSelectedDatabase = async (databaseName: string) => {
	// 	deleteDatabase(databaseName, {
	// 		onSuccess: () => {
	// 			queryClient.invalidateQueries({ queryKey: [instanceId] });
	// 			toast.success(`Database ${databaseName} deleted successfully`);
	// 			navigate({
	// 				to: `/orgs/${organizationId}/clusters/${clusterId}/instance/${instanceId}/browse`,
	// 			});
	// 			setTables([]);
	// 		},
	// 	});
	// };

	// const deleteSelectedTable = async (data: DeleteTableData) => {
	// 	deleteTable(data, {
	// 		onSuccess: async () => {
	// 			queryClient.invalidateQueries({ queryKey: [instanceId] });
	// 			setSelectedTable(undefined);
	// 			setTables([]);
	// 			setTables(Object.keys(structure?.[selectedDatabase]));
	// 			navigate({
	// 				to: `/orgs/${organizationId}/clusters/${clusterId}/instance/${instanceId}/browse/${schemaName}`,
	// 			});
	// 			toast.success(`Table ${data.tableName} deleted successfully`);
	// 		},
	// 	});
	// };

	// const handleDeleteTable = (tableName: string) => {
	// 	if (!tableName) return;
	// 	deleteSelectedTable({ databaseName: schemaName, tableName });
	// };

	return (
		<main className="grid grid-cols-1 gap-4 md:grid-cols-12">
			<section className='className="col-span-1 text-white md:col-span-4 lg:col-span-3'>
				<BrowseSideBar
					describeAllQueryData={describeAllQueryData}
					databases={databaseList}
					onSelectDatabase={onSelectDatabase}
					selectedDatabase={selectedDatabase}
					tables={tables}
					// onSelectTable={onSelectTable}
					// onUpdateTables={onUpdateTables}
					handleUpdatedTables={handleUpdatedTables}
				/>
			</section>
			<section className="col-span-1 text-white md:col-span-8 lg:col-span-9">
				{!selectedDatabase ? (
					<div className="flex items-center justify-center h-full">
						<p className="pt-2 text-sm text-center">Please select a database.</p>
					</div>
				) : !selectedTable ? (
					<div className="flex items-center justify-center h-full">
						<p className="pt-2 text-sm text-center">Please select a table.</p>
					</div>
				) : (
					<Suspense
						fallback={
							<Loading className="flex flex-col items-center justify-center h-full" text="Loading Data Table" />
						}
					>
						<Outlet />
					</Suspense>
				)}
			</section>
		</main>
	);
}

export default Browse;

import { use, useEffect, useState } from 'react';
import { getRouteApi, Link, Outlet, useNavigate } from '@tanstack/react-router';
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
import buildInstanceDataStructure from './functions/buildInstanceDataStructure';
import { ArrowRight, Check, Minus, Plus, Settings } from 'lucide-react';
import { useCreateDatabaseSubmitMutation } from '@/features/instance/operations/mutations/createDatabase';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';

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

function Browse() {
	const queryClient = useQueryClient();
	const { organizationId, clusterId, instanceId, schemaName } = route.useParams();
	const navigate = useNavigate();

	const form = useForm({
		resolver: zodResolver(NewDatabaseSchema),
		defaultValues: {
			newDatabaseName: '',
		},
	});

	const { data: describeAllQueryData } = useSuspenseQuery(getDescribeAllQueryOptions(instanceId));
	const { structure } = buildInstanceDataStructure(describeAllQueryData.data);

	const [selectedDatabase, setSelectedDatabase] = useState<string | undefined>(schemaName);
	const [isCreatingDatabase, setIsCreatingDatabase] = useState(false);
	const databases = Object.keys(structure || {});
	const [tables, setTables] = useState<string[]>(Object.keys(structure[selectedDatabase] || []));

	const handleUpdatedTables = (tableName: string) => {
		setTables((tables) => [...tables, tableName]);
	};

	const { mutate: createNewDatabase } = useCreateDatabaseSubmitMutation();

	const submitNewDatabase = async (formData: z.infer<typeof NewDatabaseSchema>) => {
		await createNewDatabase(formData, {
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: [instanceId] });
				toast.success(`Database ${formData.newDatabaseName} created successfully`);
				setIsCreatingDatabase(false);
			},
		});
	};

	return (
		<main className="grid grid-cols-1 gap-4 md:grid-cols-12">
			<section className="col-span-1 text-white md:col-span-4 lg:col-span-3">
				<h1 className="pb-6 text-3xl">Browse</h1>
				<div className="max-w-96">
					<div className="flex space-x-2">
						<Select
							name="databaseSelect"
							defaultValue={schemaName}
							onValueChange={(selectedSchema) => {
								setSelectedDatabase(selectedSchema);
								navigate({
									to: `/orgs/${organizationId}/clusters/${clusterId}/instance/${instanceId}/browse/$schemaName`,
									params: { schemaName: selectedSchema },
								});
								setTables(Object.keys(structure?.[selectedSchema]));
							}}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select a Database" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									{databases.map((schema) => (
										<SelectItem key={schema} value={schema}>
											{schema}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
						<Button
							className="inline-block"
							aria-label="Add a new database"
							variant="positiveOutline"
							onClick={() => setIsCreatingDatabase(!isCreatingDatabase)}
						>
							{!isCreatingDatabase ? <Plus /> : <Minus />}
						</Button>
					</div>
					{isCreatingDatabase ? (
						<Form {...form}>
							<form className="items-center space-x-2 mt-2 pl-4" onSubmit={form.handleSubmit(submitNewDatabase)}>
								<FormField
									control={form.control}
									name="newDatabaseName"
									render={({ field }) => (
										<FormItem className="my-4">
											<FormLabel htmlFor="newDatabaseName">New Database</FormLabel>
											<FormControl>
												<Input type="" placeholder="Enter new database name" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button type="submit" variant="positiveOutline" className="w-full">
									<Check />
									Create Database
								</Button>
							</form>
						</Form>
					) : (
						''
					)}
				</div>
				<Tabs defaultValue="tables" className="py-6">
					<TabsList className="w-full">
						<TabsTrigger value="tables">Tables</TabsTrigger>
						<TabsTrigger value="queries">Queries</TabsTrigger>
					</TabsList>
					<ScrollArea className="h-80 border border-grey-700 rounded-md">
						<TabsContent value="tables" className="h-full">
							{tables.length === 0 && selectedDatabase?.length ? (
								<div className="w-full h-full text-center">
									<p className="py-6">No tables found in this database.</p>
									<div className="max-w-48 mx-auto">
										<CreateNewTableModal
											databaseName={selectedDatabase || ''}
											instanceId={instanceId}
											handleUpdatedTables={handleUpdatedTables}
										/>
									</div>
								</div>
							) : tables.length === 0 && !selectedDatabase?.length ? (
								// If no database is selected, show a message
								<p className="text-sm text-center pt-2">Please select a database.</p>
							) : (
								''
							)}
							<ul>
								{tables.map((table) => (
									<li key={table} className="hover:bg-grey-700/80 px-8 py-4">
										<Link
											to={`/orgs/${organizationId}/clusters/${clusterId}/instance/${instanceId}/browse/${selectedDatabase}/${table}`}
											className="w-full flex items-center justify-between"
										>
											<span>{table}</span>
											<span>
												<ArrowRight />
											</span>
										</Link>
									</li>
								))}
							</ul>
						</TabsContent>
						<TabsContent value="queries">
							<p className="text-center pt-2">Create queries</p>
						</TabsContent>
					</ScrollArea>
				</Tabs>
				{selectedDatabase?.length && (
					<CreateNewTableModal
						databaseName={selectedDatabase || ''}
						instanceId={instanceId}
						setTables={setTables}
						handleUpdatedTables={handleUpdatedTables}
					/>
				)}
				<Button
					className="mt-2 bg-linear-(--purple-dark-to-light-gradient) hover:bg-linear-(--purple-gradient) rounded-full w-full"
					size="lg"
				>
					<Settings /> Settings
				</Button>
			</section>
			<section className="col-span-1 md:col-span-8 lg:col-span-9 text-white">
				<Outlet />
			</section>
		</main>
	);
}

export default Browse;

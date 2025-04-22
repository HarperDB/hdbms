import { useState } from 'react';
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

	const { data } = useSuspenseQuery(getDescribeAllQueryOptions(instanceId));
	const { structure } = buildInstanceDataStructure(data.data);

	const [selectedDatabase, setSelectedDatabase] = useState<string | null>(structure);
	const [isCreatingDatabase, setIsCreatingDatabase] = useState(false);
	const databases = Object.keys(structure || {});
	const tables = Object.keys(structure?.[selectedDatabase] || {});
	const { mutate: createNewDatabase } = useCreateDatabaseSubmitMutation();

	const submitNewDatabase = async (formData: z.infer<typeof NewDatabaseSchema>) => {
		await createNewDatabase(formData, {
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: [instanceId], refetchType: 'active' });
				toast.success(`Database ${formData.newDatabaseName} created successfully`);
				setIsCreatingDatabase(false);
				// Refetch the describe all query to get the new database
			},
		});
	};

	return (
		<main className="grid grid-cols-1 gap-4 md:grid-cols-12">
			<section className="col-span-1 text-white md:col-span-4 lg:col-span-3">
				<h1 className="pb-6 text-3xl">Browse</h1>
				<div className="max-w-96">
					<label htmlFor="databaseSelect">Databases</label>
					<div className="flex space-x-2">
						<Select
							name="databaseSelect"
							defaultValue={schemaName ?? databases[0]}
							onValueChange={(value) => {
								setSelectedDatabase(value);
								navigate({
									to: `/orgs/${organizationId}/clusters/${clusterId}/instance/${instanceId}/browse/$schemaName`,
									params: { schemaName: value },
								});
							}}
						>
							<SelectTrigger className="w-full text-2xl">
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
							variant="positive"
							onClick={() => setIsCreatingDatabase(!isCreatingDatabase)}
						>
							{!isCreatingDatabase ? <Plus /> : <Minus />}
						</Button>
					</div>
					{isCreatingDatabase ? (
						<Form {...form}>
							<form className="items-center space-x-2 mt-2" onSubmit={form.handleSubmit(submitNewDatabase)}>
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
								<Button type="submit" variant="positive" className="w-full">
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
					<TabsList className="px-6">
						<TabsTrigger value="tables">Tables</TabsTrigger>
						<TabsTrigger value="queries">Queries</TabsTrigger>
					</TabsList>
					<ScrollArea className="px-4 h-80">
						<TabsContent value="tables">
							{tables.length === 0 && selectedDatabase?.length ? (
								<div className=" w-full h-full">
									<p className="text-sm text-gray-500">No tables found in this database.</p>
									<CreateNewTableModal databaseName={selectedDatabase || ''} instanceId={instanceId} />
								</div>
							) : tables.length === 0 && !selectedDatabase?.length ? (
								// If no database is selected, show a message
								<p className="text-sm text-gray-500">Please select a database.</p>
							) : (
								''
							)}
							<ul>
								{tables.map((table) => (
									<li key={table}>
										<Link
											to={`/orgs/${organizationId}/clusters/${clusterId}/instance/${instanceId}/browse/${selectedDatabase}/${table}`}
											className="w-full my-0.5 flex items-center justify-between p-2 hover:bg-primary rounded-md"
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
							<div>Create queries</div>
						</TabsContent>
					</ScrollArea>
				</Tabs>
				{selectedDatabase?.length && (
					<CreateNewTableModal databaseName={selectedDatabase || ''} instanceId={instanceId} />
				)}
				<Button className="mt-2 w-full">
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

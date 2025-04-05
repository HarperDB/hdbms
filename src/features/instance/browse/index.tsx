import { getRouteApi } from '@tanstack/react-router';
import { QueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getInstanceInfoQueryOptions } from '@/features/instance/queries/getInstanceInfoQuery';
import { getDescribeAllQueryOptions } from '@/features/instance/queries/operation/useDescribeAll';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import buildInstanceDataStructure from './functions/buildInstanceDataStructure';

const route = getRouteApi('');

function Browse() {
	const queryClient = new QueryClient();
	const { instanceId } = route.useParams();
	const { data: instanceInfo, isSuccess } = useSuspenseQuery(getInstanceInfoQueryOptions(instanceId));
	const instanceUrl = instanceInfo.fqdns[0];
	const [databaseList, setDatabaseList] = useState([]);

	const { data } = useSuspenseQuery(getDescribeAllQueryOptions(instanceInfo.fqdns[0]));
	const { structure } = buildInstanceDataStructure(data.data);
	const [selectedSchema, setSelectedSchema] = useState<string | null>(structure[0]);
	console.log('structure', structure);
	const schemas = Object.keys(structure || {});
	const tables = Object.keys(structure?.[selectedSchema] || {});

	// console.log('schemas', schemas);
	// const tables = Object.keys(data.data || {});
	console.log('tables', tables);

	// describeAllInstance(instanceUrl);
	// Set the base URL for the instance client to the first FQDN of the instance
	// This allows all subsequent API calls to use the correct base URL for the instance
	if (!isSuccess) {
		throw new Error('Instance info not found');
	}
	return (
		<main className="grid grid-cols-1 gap-4 md:grid-cols-12">
			<section className="col-span-1 md:col-span-3">
				<Card>
					<CardHeader>
						<h1 className="text-2xl text-white">Browse Sidebar</h1>
						<Select onValueChange={setSelectedSchema} defaultValue={selectedSchema}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select a Database" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									{schemas.map((schema) => (
										<SelectItem value={schema}>{schema}</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
					</CardHeader>
					<CardContent>
						{/* {describeAllDataIsPending ? (
							<p className="text-muted-foreground">Loading...</p>
						) : (
							<ul>{describeAllData?.data.map(())}</ul>
						)} */}
						<Tabs defaultValue="tables">
							<TabsList>
								<TabsTrigger value="tables">Tables</TabsTrigger>
								<TabsTrigger value="queries">Queries</TabsTrigger>
							</TabsList>
							<TabsContent value="tables">
								<ul>
									{tables.map((table) => (
										<li key={table}>{table}</li>
									))}
								</ul>
							</TabsContent>
							<TabsContent value="queries">Create queries</TabsContent>
						</Tabs>
					</CardContent>
					{/* Select Database */}
				</Card>
			</section>
			<section className="col-span-1 md:col-span-9">
				<h2 className="text-lg text-white">Browse Table</h2>
			</section>
			<p>table</p>
		</main>
	);
}

export default Browse;

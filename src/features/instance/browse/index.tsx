import { getRouteApi, Link, Outlet } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getInstanceInfoQueryOptions } from '@/features/instance/queries/getInstanceInfoQuery';
import { getDescribeAllQueryOptions } from '@/features/instance/queries/operations/useDescribeAll';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import buildInstanceDataStructure from './functions/buildInstanceDataStructure';
import { ArrowRight } from 'lucide-react';
import { Label } from '@/components/ui/label';

const route = getRouteApi('');

function Browse() {
	const { organizationId, clusterId, instanceId } = route.useParams();
	const { data: instanceInfo, isSuccess } = useSuspenseQuery(getInstanceInfoQueryOptions(instanceId));

	const { data } = useSuspenseQuery(getDescribeAllQueryOptions(instanceInfo.fqdns[0]));
	const { structure } = buildInstanceDataStructure(data.data);

	const [selectedSchema, setSelectedSchema] = useState<string | null>(structure);
	const schemas = Object.keys(structure || {});
	const tables = Object.keys(structure?.[selectedSchema] || {});

	console.log('tables', tables);

	// describeAllInstance(instanceUrl);
	// Set the base URL for the instance client to the first FQDN of the instance
	// This allows all subsequent API calls to use the correct base URL for the instance
	if (!isSuccess) {
		throw new Error('Instance info not found');
	}
	return (
		<main className="grid grid-cols-1 gap-4 md:grid-cols-12">
			<section className="col-span-1 text-white md:col-span-4 lg:col-span-3">
				<h1 className="pb-6 text-3xl">Browse</h1>
				<Label>
					Databases
					<Select onValueChange={setSelectedSchema} defaultValue={selectedSchema || ''}>
						<SelectTrigger className="w-full text-2xl">
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
				</Label>
				<Tabs defaultValue="tables" className="py-6">
					<TabsList className="px-6">
						<TabsTrigger value="tables">Tables</TabsTrigger>
						<TabsTrigger value="queries">Queries</TabsTrigger>
					</TabsList>
					<ScrollArea className="px-4 h-80">
						<TabsContent value="tables">
							<ul>
								{tables.map((table) => (
									<li key={table}>
										<Link
											to={`/orgs/${organizationId}/clusters/${clusterId}/instance/${instanceId}/browse/${selectedSchema}/${table}`}
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
			</section>
			<section className="col-span-1 md:col-span-8 lg:col-span-9">
				<h2 className="text-lg text-white">Browse Table</h2>
				<Outlet />
			</section>
		</main>
	);
}

export default Browse;

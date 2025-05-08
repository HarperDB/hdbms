import { useSuspenseQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { getReadLogQueryOptions } from '@/features/instance/operations/queries/getReadLog';
import { getRouteApi } from '@tanstack/react-router';
import { LogsDataTable } from '@/features/instance/log/LogsDataTable';
import ViewLogModal from '@/features/instance/modals/ViewLogModal';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { renderBadgeLogLevelText, renderBadgeLogLevelVariant } from '@/components/ui/utils/badgeLogLevel';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface LogRow {
	level: 'notify' | 'error' | 'warn' | 'info' | 'debug' | 'trace' | 'stderr' | 'stdout';
	timestamp: string;
	thread: string;
	tags: string[];
	message: string;
}

const columns: ColumnDef<LogRow>[] = [
	{
		accessorKey: 'level',
		header: 'Status',
		cell: ({ row }) => {
			const { level } = row.original;
			return <Badge variant={renderBadgeLogLevelVariant(level)}>{renderBadgeLogLevelText(level)}</Badge>;
		},
	},
	{
		accessorKey: 'timestamp',
		header: 'Date',
	},
	{
		accessorKey: 'thread',
		header: 'Thread',
	},
	{
		accessorKey: 'tags',
		header: 'Tags',
	},
	{
		accessorKey: 'message',
		header: 'Message',
		cell: ({ row }) => {
			const { message } = row.original;
			row.getIsSelected();
			return (
				<pre>
					<code>{message}</code>
				</pre>
			);
		},
	},
];

const route = getRouteApi('');

function Logs() {
	const { instanceId } = route.useParams();
	const [logFilters, setLogFilters] = useState();
	const [isViewLogModalOpen, setIsViewLogModalOpen] = useState(false);
	const [selectedLogData, setSelectedLogData] = useState();
	const {
		data: instanceLogs,
		isLoading,
		refetch: refetchInstanceLogs,
	} = useSuspenseQuery(getReadLogQueryOptions({ instanceId, logFilters }));

	const form = useForm();

	const onRowClick = (rowData) => {
		setSelectedLogData(rowData.original);
		setIsViewLogModalOpen(true);
	};

	const submitFilters = async (data) => {
		await setLogFilters(data);
		refetchInstanceLogs();
	};

	const resetFilters = () => {
		form.reset();
	};

	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-12 text-white">
			<section className="col-span-1 md:col-span-4 lg:col-span-3">
				<h2 className="text-2xl pb-6">Log Filters</h2>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(submitFilters)} className="flex-col space-y-5">
						<FormField
							control={form.control}
							name="limit"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Log Limit</FormLabel>
									<Select
										onValueChange={(value) => {
											field.onChange(parseInt(value));
										}}
										defaultValue={field.value}
									>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Select log limit" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												<SelectItem value="1000">1000</SelectItem>
												<SelectItem value="500">500</SelectItem>
												<SelectItem value="250">250</SelectItem>
												<SelectItem value="100">100</SelectItem>
												<SelectItem value="10">10</SelectItem>
											</SelectGroup>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="level"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Log Level</FormLabel>
									<Select
										onValueChange={(value) => {
											if (value === 'undefined') {
												field.onChange(undefined);
												return;
											}
											field.onChange(value);
										}}
										defaultValue={field.value}
									>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Select log level" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												<SelectItem value="undefined">All</SelectItem>
												<SelectItem value="notify">Notify</SelectItem>
												<SelectItem value="error">Error</SelectItem>
												<SelectItem value="warn">Warn</SelectItem>
												<SelectItem value="info">Info</SelectItem>
												<SelectItem value="debug">Debug</SelectItem>
												<SelectItem value="trace">Trace</SelectItem>
											</SelectGroup>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="from"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Start Date:</FormLabel>
									<FormControl>
										<Input type="date" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="until"
							render={({ field }) => (
								<FormItem>
									<FormLabel>End Date:</FormLabel>
									<FormControl>
										<Input type="date" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="order"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Log Order</FormLabel>
									<Select
										onValueChange={(value) => {
											field.onChange(value);
										}}
										defaultValue={field.value}
									>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Log order" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												<SelectItem value="asc">Ascending</SelectItem>
												<SelectItem value="desc">Descending</SelectItem>
											</SelectGroup>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" variant="positiveOutline" className="w-full mt-4">
							Apply Filters
						</Button>
						<Button type="reset" variant="destructiveOutline" onClick={resetFilters} className="w-full mt-2">
							Clear Filters
						</Button>
					</form>
				</Form>
			</section>
			<section className="col-span-1 md:col-span-8 lg:col-span-9">
				{isLoading ? (
					<div>Loading...</div>
				) : (
					<div className="h-32">
						<LogsDataTable columns={columns} data={instanceLogs.data} onRowClick={onRowClick} />
					</div>
				)}
			</section>
			<ViewLogModal isModalOpen={isViewLogModalOpen} setIsModalOpen={setIsViewLogModalOpen} data={selectedLogData} />
		</div>
	);
}

export default Logs;

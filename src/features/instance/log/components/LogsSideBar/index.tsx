import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from '@/components/ui/select';

function LogsSideBar({ form }) {
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit((data) => console.log(data))} className="flex-col space-y-5">
				<FormField
					control={form.control}
					name="logLimit"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Log Limit</FormLabel>
							<Select
								onValueChange={(value) => {
									field.onChange(value);
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
					name="logLevel"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Log Level</FormLabel>
							<Select
								onValueChange={(value) => {
									field.onChange(value);
								}}
								defaultValue={field.value}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select log level" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectItem value="all">All</SelectItem>
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
					name="startDate"
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
					name="endDate"
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
					name="logOrder"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Log Limit</FormLabel>
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
				<Button type="reset" variant="destructiveOutline" className="w-full mt-2">
					Clear Filters
				</Button>
			</form>
		</Form>
	);
}

export default LogsSideBar;

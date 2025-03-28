import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/Sidebar';

function Browse() {
	return (
		<>
			<SidebarProvider>
				<AppSidebar />
				<main className="w-full">
					<SidebarTrigger />
					<div>
						<h1 className="text-2xl text-white">Browse</h1>
					</div>
					<p>table</p>
				</main>
			</SidebarProvider>
		</>
	);
}

export default Browse;

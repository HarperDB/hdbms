import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/Sidebar';

function Browse() {
	return (
		<>
			<SidebarProvider>
				<AppSidebar />
				<main>
					<SidebarTrigger />
					<div className="w-full">
						<h1 className="text-2xl text-white">Browse</h1>
					</div>
					<p>table</p>
				</main>
			</SidebarProvider>
		</>
	);
}

export default Browse;

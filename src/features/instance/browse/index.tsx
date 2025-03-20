import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/Sidebar';

function Browse() {
	return (
		<>
			<SidebarProvider>
				<AppSidebar />
				<main>
					<SidebarTrigger />
					<p>table</p>
				</main>
			</SidebarProvider>
		</>
	);
}

export default Browse;

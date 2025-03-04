import { createHashHistory, createRouter, RouterProvider } from '@tanstack/react-router';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { cloudRouteTree } from './router/cloudRouter';
import { localRouteTree } from './router/localRouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/react-query/queryClient';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

function App() {
	const isLocalStudio = import.meta.env.VITE_REACT_APP_LOCALSTUDIO == 'true';
	const hashHistory = createHashHistory();
	const loadedRouter = isLocalStudio ? localRouteTree : cloudRouteTree;

	const router = createRouter({
		routeTree: loadedRouter,
		scrollRestoration: true,
		history: hashHistory,
	});

	return (
		<>
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
				<ReactQueryDevtools buttonPosition="bottom-left" />
				<TanStackRouterDevtools router={router} />
				<button
					className="fixed p-2 text-white bg-blue-400 rounded-md bottom-4 right-4"
					onClick={() => {
						document.documentElement.classList.toggle('dark');
						localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
					}}
				>
					Toggle Theme
				</button>
				{/* <button
					className="fixed p-2 text-white bg-blue-400 rounded-md bottom-20 right-20"
					onClick={() => {
						toast.error('Error', {
							description: 'testinggg',
							action: {
								label: 'Dismiss',
								onClick: () => toast.dismiss(),
							},
						});
					}}
				>
					testing toast component
				</button> */}
				<Toaster />
			</QueryClientProvider>
		</>
	);
}

export default App;

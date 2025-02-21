import { RouterProvider } from 'react-router';
import localRouter from '@/router/localRouter';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// const queryClient = new QueryClient();
function LocalApp() {
	return (
		// <QueryClientProvider client={queryClient}>
		<RouterProvider router={localRouter} />
		// <ReactQueryDevtools buttonPosition="bottom-left" initialIsOpen={false} />
		// </QueryClientProvider>
	);
}

export default LocalApp;

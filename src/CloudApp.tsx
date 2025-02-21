import { RouterProvider } from 'react-router';
import cloudRouter from '@/router/cloudRouter';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// const queryClient = new QueryClient();

function StudioApp() {
	return <RouterProvider router={cloudRouter} />;
}

export default StudioApp;

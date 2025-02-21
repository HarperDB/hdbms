import React, { lazy } from 'react';
import ReactDOM from 'react-dom/client';
import '@/index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const isLocalStudio = import.meta.env.VITE_REACT_APP_LOCALSTUDIO == 'true';
const LocalApp = lazy(() => import('@/LocalApp'));
const CloudApp = lazy(() => import('@/CloudApp'));

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>{isLocalStudio ? <LocalApp /> : <CloudApp />}</QueryClientProvider>
	</React.StrictMode>
);

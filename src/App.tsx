import { createHashHistory, createRouter, RouterProvider } from '@tanstack/react-router';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { cloudRouteTree } from './router/cloudRouter';
import { localRouteTree } from './router/localRouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

function App() {
  const isLocalStudio = import.meta.env.VITE_REACT_APP_LOCALSTUDIO == 'true';
  const hashHistory = createHashHistory();
  const loadedRouter = isLocalStudio ? localRouteTree : cloudRouteTree;
  
  const router = createRouter({ 
    routeTree: loadedRouter,
    scrollRestoration: true,
    history: hashHistory,
  });

const queryClient = new QueryClient();

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
    </QueryClientProvider>
    </>
  )
} 

export default App;

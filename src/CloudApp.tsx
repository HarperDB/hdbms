import { RouterProvider } from "react-router";
import cloudRouter from "@/router/cloudRouter";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'


const queryClient = new QueryClient({})

function StudioApp() {

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={cloudRouter} />
      <ReactQueryDevtools buttonPosition="bottom-left" initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default StudioApp;

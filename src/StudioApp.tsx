import { RouterProvider } from "react-router";
import studioRouter from "@/router/fabricRouter";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'


const queryClient = new QueryClient({})

function StudioApp() {

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={studioRouter} />
    </QueryClientProvider>
  )
}

export default StudioApp;

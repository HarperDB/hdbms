import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
//toast component import

function errorHandler(errorMsg: string, errorStatus: number) {
	toast.error(`Error: ${errorStatus}`, {
		description: errorMsg,
		action: {
			label: 'Dismiss',
			onClick: () => toast.dismiss(),
		},
	});
}

export const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (error) => {
			// @ts-expect-error - error is not typed
			errorHandler(error.message, error.status);
		},
	}),
	mutationCache: new MutationCache({
		onError: (error) => {
			// @ts-expect-error - error is not typed
			errorHandler(error.message, error.status);
		},
	}),
});

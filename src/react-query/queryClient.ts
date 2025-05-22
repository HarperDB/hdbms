import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

function errorHandler(errorMsg: Error) {
	toast.error(`Error`, {
		description: `${errorMsg}`,
		action: {
			label: 'Dismiss',
			onClick: () => toast.dismiss(),
		},
	});
}

export const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (error) => {
			// @ts-expect-error error.response is not defined
			errorHandler(error.response?.data || error.message);
		},
	}),
	mutationCache: new MutationCache({
		onError: (error) => {
			// @ts-expect-error error.response is not defined
			errorHandler(error.response?.data || error.message);
		},
	}),
});

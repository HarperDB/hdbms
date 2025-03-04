import { QueryCache, QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
//toast component import

function errorHandler(errorMsg: string) {
	toast.error('Error:', {
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
			errorHandler(error.message);
		},
	}),
});

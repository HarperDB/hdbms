import DashLayout from '@/features/layouts/DashLayout';
import { Navigate } from 'react-router';
// import { useOnGetCurrentUser } from '@/features/layouts/queries/useOnGetCurrentUser';
import useAuth from '@/shared/hooks/useAuth';
import { QueryCache, useQueryClient } from '@tanstack/react-query';

const ProtectedRoutes = () => {
	const queryClient = useQueryClient();
	const queryCache = new QueryCache();

	console.log('ProtectedRoutes');
	const { user, isPending, isSuccess } = useAuth();

	if (isPending) {
		return <div>Loading...</div>;
	}

	if (!isPending && !user?.id) {
		queryCache.clear();
		queryClient.setQueryData(['user'], null);
		return <Navigate to="/signin" />;
	}

	if (isSuccess) {
		return <DashLayout />;
	}
	// TODO: Use cookies to check if user is logged in
};

export default ProtectedRoutes;

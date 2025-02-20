import DashLayout from '@/features/layouts/DashLayout';
import { Navigate } from 'react-router';
import { useOnGetCurrentUser } from '@/features/layouts/queries/useOnGetCurrentUser';

const ProtectedRoutes = () => {
	const { isPending, isError, isSuccess, data: currentUser } = useOnGetCurrentUser();
	console.log(currentUser);
	if (isPending) {
		return <div>Loading...</div>;
	}

	if (isError) {
		return <Navigate to="/sign-in" />;
	}

	if (isSuccess) {
		return <DashLayout />;
	}
	// TODO: Use cookies to check if user is logged in
};

export default ProtectedRoutes;

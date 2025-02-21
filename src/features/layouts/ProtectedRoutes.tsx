import DashLayout from '@/features/layouts/DashLayout';
import { Navigate } from 'react-router';
// import { useOnGetCurrentUser } from '@/features/layouts/queries/useOnGetCurrentUser';
import useAuth from '@/shared/hooks/useAuth';

const ProtectedRoutes = () => {
	console.log('ProtectedRoutes');
	const { user, isPending, isSuccess } = useAuth();

	if (isPending) {
		return <div>Loading...</div>;
	}

	if (!isPending && !user) {
		return <Navigate to="/sign-in" />;
	}

	if (isSuccess) {
		return <DashLayout />;
	}
	// TODO: Use cookies to check if user is logged in
};

export default ProtectedRoutes;

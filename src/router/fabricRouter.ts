import { createBrowserRouter } from 'react-router';
import SignIn from '@/features/auth/SignIn';
import AuthLayout from '@/features/layouts/AuthLayout';
import SignUp from '@/features/auth/SignUp';
import ResetPassword from '@/features/auth/ResetPassword';
import Organizations from '@/features/organizations';
import ProtectedRoutes from '@/shared/components/ProtectedRoutes';

const localRouter = createBrowserRouter([
	{
		path: '/',
		Component: AuthLayout,
		children: [
			{
				index: true,
				Component: SignIn,
			},
			{
				path: 'sign-up',
				Component: SignUp,
			},
			{
				path: 'reset-password',
				Component: ResetPassword,
			},
		],
	},
	{
		path: '/app',
		Component: ProtectedRoutes,
		children: [
			{
				index: true,
				Component: Organizations,
			},
		],
	},
]);

export default localRouter;

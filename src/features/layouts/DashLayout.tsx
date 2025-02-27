import { NavBar } from '@/components/Navbar';
import useAuth from '@/shared/hooks/useAuth';
import { QueryCache, useQueryClient } from '@tanstack/react-query';
import { Navigate, Outlet } from 'react-router';

function DashLayout() {
	const queryClient = useQueryClient();
	const queryCache = new QueryCache();

	const { user, isUserPending, isUserSuccess } = useAuth();

	if (!isUserPending && !user?.id) {
		queryCache.clear();
		queryClient.setQueryData(['user'], null);
		return <Navigate to="/signin" />;
	}
	return (
		<div>
			{isUserPending ? (
				<div>Loading...</div>
			) : (
				<>
					<header
						className="bg-black-dark dark:bg-black-dark
       py-2 absolute top-0 z-40 w-full dark:border-b dark:border-black"
					>
						<NavBar />
					</header>
					<div className="mt-28 md:mt-24 h-full px-6">
						<Outlet />
					</div>
					<footer className="fixed p-2 text-gray-400 rounded-md bottom-0 right-0">
						<p>Powered by Harper Systems</p>
					</footer>
					<button
						className="fixed p-2 text-white bg-blue-400 rounded-md bottom-4 right-4"
						onClick={() => {
							document.documentElement.classList.toggle('dark');
							localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
						}}
					>
						Toggle Theme
					</button>
				</>
			)}
		</div>
	);
}

export default DashLayout;

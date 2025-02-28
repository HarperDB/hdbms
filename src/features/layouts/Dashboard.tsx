import { Outlet, Navigate } from '@tanstack/react-router';
import { useGetCurrentUser } from '@/hooks/useGetCurrentUser';
import { NavBar } from '@/components/Navbar';

function Dashboard() {
	const { data: user, isLoading: isUserLoading } = useGetCurrentUser();
	if (!user && !isUserLoading) {
		return <Navigate to="/signin" />;
	}

	if (isUserLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<header className="bg-black-dark dark:bg-black-dark sticky top-0 z-40 w-full dark:border-b dark:border-black h-20 py-4 px-4 md:px-12">
				<NavBar />
			</header>
			<main className="pt-4 min-h-[calc(100vh-theme(spacing.20))] px-4 md:px-12">
				<Outlet />
			</main>
		</div>
	);
}

export default Dashboard;

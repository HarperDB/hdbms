import { Outlet, Navigate } from '@tanstack/react-router';
import { useGetCurrentUser } from '@/hooks/useGetCurrentUser';
import { NavBar } from '@/components/Navbar';
import Loading from '@/components/Loading';

const isLocalStudio = import.meta.env.VITE_LOCAL_STUDIO == 'true';

function Dashboard() {
	const { data: user, isLoading: isUserLoading } = useGetCurrentUser();

	if (!user && !isUserLoading) {
		return <Navigate to="/" />;
	}

	if (isUserLoading) {
		return <Loading />;
	}

	return (
		<div>
			<header className="sticky top-0 z-40 w-full h-20 px-4 py-4 bg-black-dark dark:bg-black-dark dark:border-b dark:border-black md:px-12">
				<NavBar />
			</header>
			<main className="pt-4 min-h-[calc(100vh-theme(spacing.20))] px-4 md:px-12">
				<Outlet />
			</main>
		</div>
	);
}

export default Dashboard;

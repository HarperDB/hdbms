import { NavBar } from '@/components/Navbar';
import { Outlet } from 'react-router';

function DashLayout() {
	return (
		<div>
			<header
				className="bg-black-dark
       py-2 absolute top-0 z-40 w-full"
			>
				<NavBar />
			</header>
			<div className=" mt-24 md:mt-20 h-full px-6">
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
		</div>
	);
}

export default DashLayout;

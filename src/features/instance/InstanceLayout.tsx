import { Outlet } from '@tanstack/react-router';

function InstanceLayout() {
	return (
		<>
			<nav>Instance Navbar</nav>
			<div className="px-4 md:px-8 pt-4">
				{/* Create an instance context */}
				<Outlet />
			</div>
		</>
	);
}

export default InstanceLayout;

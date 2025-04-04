import { Outlet } from '@tanstack/react-router';

function InstanceLayout() {
	return (
		<>
			<nav>Instance Navbar</nav>
			<Outlet />
		</>
	);
}

export default InstanceLayout;

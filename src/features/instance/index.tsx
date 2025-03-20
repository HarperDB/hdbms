import { Outlet } from '@tanstack/react-router';

function Instance() {
	// check if user is logged into instance
	// if(import.meta.env.VITE_LOCAL_STUDIO === 'true' && ) {
	// 	return <Outlet />;
	// }
	return (
		<>
			<h2>Instance base page</h2>
			<Outlet />
		</>
	);
}

export default Instance;

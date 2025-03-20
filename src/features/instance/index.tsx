import { Outlet } from '@tanstack/react-router';

function Instance() {
	return (
		<>
			{/* <h2>Instance base page</h2> */}
			<Outlet />
		</>
	);
}

export default Instance;

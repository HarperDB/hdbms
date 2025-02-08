import DashLayout from "@/features/layouts/DashLayout";
import { Navigate } from "react-router";
import { useOnGetCurrentUser } from "@/features/layouts/queries/useOnGetCurrentUser";

const ProtectedRoutes = () => {
		const currentUser = useOnGetCurrentUser();
		console.log(currentUser);
		if(currentUser.isPending) {
			return <div>Loading...</div>;
		}

		if(currentUser.isError) {
			return <Navigate to="/" />;
		}

		if(currentUser.isSuccess) {
			return <DashLayout />;
		}
	// TODO: Use cookies to check if user is logged in
};

export default ProtectedRoutes;

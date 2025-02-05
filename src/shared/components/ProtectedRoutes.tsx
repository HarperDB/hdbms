import DashLayout from "@/features/layouts/DashLayout";
import { Navigate } from "react-router";

const ProtectedRoutes = () => {
	// TODO: Use authentication token
  localStorage.setItem("token", "token"); // dummy token
	const localStorageToken = localStorage.getItem("token");

	return localStorageToken ? <DashLayout /> : <Navigate to="/"  replace />;
};

export default ProtectedRoutes;

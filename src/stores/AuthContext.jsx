// AuthContext.js
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

const orgInfo = {
	customer_id: '',
	customer_name: '',
	status: '',
	owner_user_id: '',
	total_instance_count: 0,
	free_cloud_instance_count: 0,
	active_coupons: [],
};

const authStateDefaultValues = {
	email: '',
	pass: '',
	firstname: '',
	lastname: '',
	user_id: '',
	primary_customer_id: '',
	email_bounced: false,
	update_password: false,
	github_repo: null,
	last_login: 0,
	orgs: [orgInfo], // default to empty array
};
const AuthProvider = ({ children }) => {
	const [authState, setAuthState] = useState(authStateDefaultValues);
	const [authStatePersistedUser, setAuthStatePersistedUser] = useState(
		JSON.parse(localStorage.getItem('persistedUser'))
	);

	return <AuthContext.Provider value={{ authState, setAuthState }}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within a AuthProvider');
	}
	return context;
};

export { AuthProvider, useAuth };

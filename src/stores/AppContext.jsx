// appContext.js
import { createContext, useState } from 'react';

const AppContext = createContext();

const orgInfo = {
	customer_id: '',
	customer_name: '',
	status: '',
	owner_user_id: '',
	total_instance_count: 0,
	free_cloud_instance_count: 0,
	active_coupons: [],
};

const authState = {
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

const AppProvider = ({ children }) => {
	const [appState, setAppState] = useState({
		auth: authState,
		customer: false,
		users: false,
		products: false,
		regions: false,
		integrations: false,
		subscriptions: false,
		instances: false,
		alarms: false,
		alarmsError: false,
		hasCard: false,
		lastUpdate: false,
		orgSearch: '',
		filterSearch: '',
		filterLocal: true,
		filterCloud: true,
		version: false,
		theme: 'dark',
		postmanCollection: false,
	});

	const updateAuthState = (auth) => {
		setAppState((s) => {
			s.auth = auth;
		});
	};

	const updateCustomerState = (customer) => {
		setAppState((s) => {
			s.customer = customer;
		});
	};

	const updateUsersState = (users) => {
		setAppState((s) => {
			s.users = users;
		});
	};

	return (
		<AppContext.Provider value={{ appState, setAppState, updateAuthState, updateUsersState, updateCustomerState }}>
			{children}
		</AppContext.Provider>
	);
};

const useApp = () => {
	const context = useContext(AppContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within a AuthProvider');
	}
	return context;
};
export { AppProvider, useAppState };

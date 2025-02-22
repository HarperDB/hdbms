import apiClient from '@/config/apiClient';
import Cookies from 'js-cookie';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
type OrgRoles = {
	id: string;
	organizationId: string;
	organizationName: string;
	roleName: 'admin' | 'member';
};

type User = {
	id: string;
	email: string;
	firstname: string;
	lastname: string;
	roles?: OrgRoles[];
};

type SignInCredentials = {
	email: string;
	password: string;
};

const useAuth = () => {
	const queryClient = useQueryClient();

	// const isAuthenticated = () => {
	// 	console.log('Cookies.get', Cookies.get('localhost_5173-hdb-session'));
	// 	return !!Cookies.get('localhost_5173-hdb-session');
	// };

	const {
		data: user,
		isPending,
		isSuccess,
	} = useQuery<User | null>({
		queryKey: ['user'],
		queryFn: async () => {
			const isCurrentUser = queryClient.getQueryData(['user']);
			if (isCurrentUser) {
				return isCurrentUser as User;
			}
			const response = await apiClient.get('/User/current');
			if (response.status == 200 && response.data) {
				return response.data as User;
			}
			return null;
		},
		refetchOnWindowFocus: false,
	});
	// const { data: user, isLoading } = useQuery<User | null>({
	// 	queryKey: ['user'],
	// 	queryFn: async () => {
	// 		const res = await fetch('/');
	// 		if (!res.ok) return null;
	// 		return res.json();
	// 	},
	// });

	const login = useMutation({
		mutationFn: async ({ email, password }: SignInCredentials) => {
			const { status, data } = await apiClient.post('/Login', {
				email,
				password,
			});
			if (status === 200 && data) {
				return data as User;
			}
			throw new Error('Login failed');
		},
		onSuccess: (data: User) => {
			queryClient.setQueryData(['user'], data);
		},
	});

	const logout = useMutation({
		mutationFn: async () => {
			const res = await fetch('/api/logout', { method: 'POST' });
			if (!res.ok) throw new Error('Logout failed');
		},
		onSuccess: () => {
			queryClient.setQueryData(['user'], null);
		},
	});

	return { user, isPending, isSuccess, login, logout };
};

export default useAuth;

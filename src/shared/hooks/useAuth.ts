import apiClient from '@/config/apiClient';
import Cookies from 'js-cookie';
import { useQuery, useMutation, useQueryClient, QueryCache } from '@tanstack/react-query';
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
	const queryCache = new QueryCache();

	const isCurrentUser = queryClient.getQueryData(['user']);

	const {
		data: user,
		isPending,
		isSuccess,
	} = useQuery<User | null>({
		queryKey: ['user'],
		queryFn: async () => {
			const response = await apiClient.get('/User/current');
			if (response.status == 200 && response.data) {
				return response.data as User;
			}
			return null;
		},
		enabled: !isCurrentUser,
		refetchOnWindowFocus: false,
	});

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

	const logout = () => {
		queryCache.clear();
		Cookies.remove('localhost_5173-hdb-session');
	};

	return { user, isPending, isSuccess, login, logout };
};

export default useAuth;

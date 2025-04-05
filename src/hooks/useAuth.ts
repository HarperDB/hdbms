// import apiClient from '@/config/apiClient';
// import { queryKeys } from '@/react-query/constants';
// import { useQuery, useMutation, useQueryClient, QueryCache } from '@tanstack/react-query';
// type OrgRoles = {
// 	id: string;
// 	organizationId: string;
// 	organizationName: string;
// 	roleName: 'admin' | 'member';
// };
// type User = {
// 	id: string;
// 	email: string;
// 	firstname: string;
// 	lastname: string;
// 	roles?: OrgRoles[];
// };

// type SignInCredentials = {
// 	email: string;
// 	password: string;
// };

// const useAuth = () => {
// 	const queryClient = useQueryClient();
// 	const queryCache = new QueryCache();

// 	// const {data: user, isLoading: isUserLoading} = useQuery<User | null>({
// 	// 	queryKey: ['user'],
// 	// 	queryFn: async () => {
// 	// 		const response = await apiClient.get('/User/current');
// 	// 		if (response.status == 200 && response.data) {
// 	// 			return response.data as User;
// 	// 		}
// 	// 		return null;
// 	// 	},
// 	// 	retry: false,
// 	// });

// 	const login = useMutation({
// 		mutationFn: async ({ email, password }: SignInCredentials) => {
// 			const { status, data } = await apiClient.post('/Login', {
// 				email,
// 				password,
// 			});
// 			if (status === 200 && data) {
// 				// return data as User;
// 				return console.log('Login successful');
// 			}
// 			throw new Error('Login failed');
// 		},
// 		// onSuccess: (data: User) => {
// 		// 	queryClient.setQueryData(['user'], data);
// 		// },
// 	});

// 	const logout = useQuery<User | null>({
// 		queryKey: [queryKeys.user],
// 		queryFn: async () => {
// 			const response = await apiClient.get('/Logout');
// 			if (response.status == 200 && response.data) {
// 				queryClient.setQueryData(['user'], null);
// 				queryCache.clear();
// 				return null;
// 			}
// 			throw new Error('Logout failed');
// 		},
// 		retry: false,
// 	});

// 	return { login, logout };
// 	// return { user, isPending, isSuccess, login, logout, isAuthenticated };
// };

// export default useAuth;

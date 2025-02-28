import apiClient from '@/config/apiClient';
import { useQuery } from '@tanstack/react-query';


type OrgRoles = {
	id: string;
	organizationId: string;
	organizationName: string;
	roleName: 'admin' | 'member';
};

// TODO: Consolidate with useOnSignUpSubmitMutation
type User = {
	id: string;
	email: string;
	firstname: string;
	lastname: string;
	roles?: OrgRoles[];
};



const getCurrentUser = async () => {
  const response = await apiClient.get('/User/current');
    if (response.status == 200 && response.data) {
      return response.data as User;
    }
    return null;
};




export function useGetCurrentUser() {
  return useQuery<User | null>({
   queryKey: ['user'],
   queryFn: () => getCurrentUser(),
   retry: false,
 });
 }

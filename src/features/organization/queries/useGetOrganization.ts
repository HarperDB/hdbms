import apiClient from '@/config/apiClient';
import { useQuery } from '@tanstack/react-query';


type Cluster = {
	id: string;
	name: string;
	organizationId: string;
};

// TODO: Consolidate with useOnSignUpSubmitMutation
type Organization = {
	id: string;
	name: string;
	subdomain: string;
	createdByUserId: string;
	clusters?: Cluster[];
};



const getOrganization = async (orgId: string) => {
  const response = await apiClient.get(`/Organization/${orgId}`);
    if (response.status == 200 && response.data) {
      return response.data as Organization;
    }
    return null;
};




export function useGetOrganization(orgId: string) {
  return useQuery({
   queryKey: ['Organization', orgId],
   queryFn: () => getOrganization(orgId),
   retry: false,
 });
 }

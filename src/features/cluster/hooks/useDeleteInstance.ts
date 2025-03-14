import apiClient from '@/config/apiClient';
import { useMutation } from '@tanstack/react-query';

const onDeleteInstanceSubmit = async (instanceId: string) => {
	const { data } = await apiClient.delete(`/HDBInstance/${instanceId}`);
	if (data) {
		return data;
	} else {
		throw new Error('Something went wrong');
	}
};

export function useDeleteInstance() {
	return useMutation({
		mutationFn: (instanceId: string) => onDeleteInstanceSubmit(instanceId),
	});
}

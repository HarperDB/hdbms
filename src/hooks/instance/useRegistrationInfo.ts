import instanceClient from '@/config/instanceClient';
import { useMutation } from '@tanstack/react-query';

// TODO: Consolidate with useOnSignUpSubmitMutation
export type InstanceData = {
	instanceURL: string;
};

type RegistrationInfoResponse = {
	id: string;
	email: string;
	firstname: string;
	lastname: string;
};

export const onRegistrationInfoSubmit = async (instanceURL: string): Promise<RegistrationInfoResponse> => {
	const { data } = await instanceClient.post(instanceURL, {
		operation: { operation: 'registration_info' },
	});
	if (data) {
		return data;
	}
	throw new Error('Something went wrong');
};

export function useRegistrationInfo() {
	return useMutation<RegistrationInfoResponse, Error, string>({
		mutationFn: (instanceData) => onRegistrationInfoSubmit(instanceData),
	});
}

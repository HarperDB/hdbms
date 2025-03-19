import instanceClient from '@/config/instanceClient';
import { useMutation } from '@tanstack/react-query';

// TODO: Consolidate with useOnSignUpSubmitMutation
export type InstanceLoginCredentials = {
	instanceURL: string;
	username: string;
	password: string;
};

type RegistrationInfoResponse = {
	message: string;
};

export const onInstanceLoginSubmit = async ({
	instanceURL,
	username,
	password,
}: InstanceLoginCredentials): Promise<RegistrationInfoResponse> => {
	const { data } = await instanceClient.post(instanceURL, {
		operation: 'login',
		username,
		password,
	});
	if (data) {
		return data;
	} else {
		throw new Error('Something went wrong');
	}
};

export function useInstanceLogin() {
	return useMutation<RegistrationInfoResponse, Error, InstanceLoginCredentials>({
		mutationFn: (instanceData) => onInstanceLoginSubmit(instanceData),
	});
}

import instanceClient from '@/config/instanceClient';
import { useMutation } from '@tanstack/react-query';

// TODO: Consolidate with useOnSignUpSubmitMutation
export type InstanceLoginCredentials = {
	instanceUrl: string;
	username: string;
	password: string;
};

type InstanceLoginResponse = {
	message: string;
};

export const onInstanceLoginSubmit = async ({
	instanceUrl,
	username,
	password,
}: InstanceLoginCredentials): Promise<InstanceLoginResponse> => {
	const { data } = await instanceClient.post(`${instanceUrl}`, {
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
	return useMutation<InstanceLoginResponse, Error, InstanceLoginCredentials>({
		mutationFn: (instanceData) => onInstanceLoginSubmit(instanceData),
	});
}

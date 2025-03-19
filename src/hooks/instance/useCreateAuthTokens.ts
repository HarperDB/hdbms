import instanceClient from '@/config/instanceClient';
import { useMutation } from '@tanstack/react-query';

// TODO: Consolidate with useOnSignUpSubmitMutation
export type CreateAuthTokensRequest = {
	instanceId: string;
	instanceUrl: string;
	username: string;
	password: string;
};

type CreateAuthTokensResponse = {
	operation_token: string;
	refresh_token: string;
};

export const onCreateAuthTokensSubmit = async ({
	instanceId,
	instanceUrl,
	username,
	password,
}: CreateAuthTokensRequest): Promise<CreateAuthTokensResponse> => {
	const { data } = await instanceClient.post(`${instanceUrl}`, {
		operation: 'create_authentication_tokens',
		username,
		password,
	});
	if (data) {
		console.log(`instance ${instanceId}:`, data);
		return data;
	} else {
		throw new Error('Something went wrong');
	}
};

export function useCreateAuthTokens() {
	return useMutation<CreateAuthTokensResponse, Error, CreateAuthTokensRequest>({
		mutationFn: (instanceData) => onCreateAuthTokensSubmit(instanceData),
	});
}

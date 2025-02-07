import apiClient from '@/config/apiClient';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

// TODO: Consolidate with useOnSignUpSubmitMutation
export type SignInRequest = {
	email: string;
	password: string;
};

type SignInResponse = {
	id: string;
	email: string;
	firstname: string;
	lastname: string;
};

const onLoginSubmit = async ({ email, password }: SignInRequest): Promise<SignInResponse> => {
	const { data: response } = await apiClient.post('/Login', {
		email,
		password,
	});
	if (response) {
		return response as SignInResponse;
	}
	throw new Error('Something went wrong');
};

export function useOnLoginSubmitMutation(options?: UseMutationOptions<SignInResponse, Error, SignInRequest>) {
	return useMutation<SignInResponse, Error, SignInRequest>({
		...options,
		mutationFn: onLoginSubmit,
		onSuccess: (data, variables, context) => {
			options?.onSuccess?.(data, variables, context);
			// Shared on success logic
		},
	});
}

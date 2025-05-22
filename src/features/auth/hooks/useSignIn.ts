import apiClient from '@/config/apiClient';
import { useMutation } from '@tanstack/react-query';

// TODO: Consolidate with useOnSignUpSubmitMutation
export type SignInCredentials = {
	email: string;
	password: string;
};

type SignInResponse = {
	id: string;
	email: string;
	firstname: string;
	lastname: string;
};

export const onLoginSubmit = async ({ email, password }: SignInCredentials): Promise<SignInResponse> => {
	const { data } = await apiClient.post('/Login', {
		email,
		password,
	});
	if (data) {
		return data as SignInResponse;
	} else {
		throw new Error('Something went wrong');
	}
};

export function useLoginMutation() {
	return useMutation<SignInResponse, Error, SignInCredentials>({
		mutationFn: (loginData) => onLoginSubmit(loginData),
	});
}

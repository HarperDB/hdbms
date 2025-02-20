import apiClient from '@/config/apiClient';
import { useMutation } from '@tanstack/react-query';

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

export const onLoginSubmit = async ({ email, password }: SignInRequest): Promise<SignInResponse> => {
	const { data } = await apiClient.post('/Login', {
		email,
		password,
	});
	if (data) {
		console.log('headers', Headers);
		// return data as SignInResponse;
		return data;
	} else {
		throw new Error('Something went wrong');
	}
};

export function useOnLoginSubmitMutation() {
	return useMutation<SignInResponse, Error, SignInRequest>({
		mutationFn: (loginData) => onLoginSubmit(loginData),
	});
}

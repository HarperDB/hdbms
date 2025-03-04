import apiClient from '@/config/apiClient';
import { useMutation } from '@tanstack/react-query';

// TODO: Consolidate with useOnSignUpSubmitMutation
export type SignUpCredentials = {
	email: string;
	password: string;
	firstname: string;
	lastname: string;
};

type SignUpResponse = {
	id: string;
	email: string;
	firstname: string;
	lastname: string;
};

export const onSignUpSubmit = async (signUpCredentials: SignUpCredentials): Promise<SignUpResponse> => {
	const { data } = await apiClient.post('/User', signUpCredentials);
	if (data) {
		return data as SignUpResponse;
	} else {
		throw new Error('Something went wrong');
	}
};

export function useSignUpMutation() {
	return useMutation<SignUpResponse, Error, SignUpCredentials>({
		mutationFn: (loginData) => onSignUpSubmit(loginData),
	});
}

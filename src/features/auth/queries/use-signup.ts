import apiClient from '@/config/apiClient';
import { useMutation } from '@tanstack/react-query';

// TODO: Consolidate with useOnLoginSubmitMutation
export type SignUpRequest = {
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

const onSignUpSubmit = async ({ email, password, firstname, lastname }: SignUpRequest): Promise<SignUpResponse> => {
	const { data: response } = await apiClient.post('/User', {
		email,
		password,
		firstname,
		lastname,
	});
	if (response) {
		return response as SignUpResponse;
	}
	throw new Error('Something went wrong');
};

export function useOnSignUpSubmitMutation() {
	return useMutation<SignUpResponse, Error, SignUpRequest>({
		mutationFn: onSignUpSubmit,
	});
}

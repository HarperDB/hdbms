import apiClient from '@/config/apiClient';
import { useMutation } from '@tanstack/react-query';

// TODO: Consolidate with useOnSignUpSubmitMutation
export type SignInCredentials = {
	instanceUser: string;
	instancePassword: string;
};

type SignInResponse = {
	id: string;
	email: string;
	firstname: string;
	lastname: string;
};

export const onUserInfoSubmit = async ({
	instanceUser,
	instancePassword,
}: SignInCredentials): Promise<SignInResponse> => {
	const { data } = await apiClient.post('/', {
		operation: 'user_info',
		username: instanceUser,
		password: instancePassword,
	});
	if (data) {
		return data as SignInResponse;
	} else {
		throw new Error('Something went wrong');
	}
};

export function useUserInfoMutation() {
	return useMutation<SignInResponse, Error, SignInCredentials>({
		mutationFn: (loginData) => onUserInfoSubmit(loginData),
	});
}

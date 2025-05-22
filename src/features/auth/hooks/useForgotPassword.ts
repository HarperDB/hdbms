import apiClient from '@/config/apiClient';
import { useMutation } from '@tanstack/react-query';

// TODO: Consolidate with useOnSignUpSubmitMutation
export type ForgotPasswordCredential = {
	email: string;
};

type ForgotPasswordResponse = {
	email: string;
};

export const onResetPasswordSubmit = async ({ email }: ForgotPasswordCredential): Promise<ForgotPasswordResponse> => {
	const { data } = await apiClient.post('/ForgotPassword', {
		email,
	});
	if (data) {
		return data as ForgotPasswordResponse;
	} else {
		throw new Error('Something went wrong');
	}
};

export function useForgotPasswordMutation() {
	return useMutation<ForgotPasswordResponse, Error, ForgotPasswordCredential>({
		mutationFn: (loginData) => onResetPasswordSubmit(loginData),
	});
}

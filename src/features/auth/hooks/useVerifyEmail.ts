import apiClient from '@/config/apiClient';
import { useMutation } from '@tanstack/react-query';

// TODO: Consolidate with useOnSignUpSubmitMutation
export type VerifyEmailToken = {
	token: string;
};

type VerifyEmailResponse = {
	useId: string;
	email: string;
};

export const onResetPasswordSubmit = async (token: VerifyEmailToken): Promise<VerifyEmailResponse> => {
	const { data } = await apiClient.post('/ForgotPassword', token);
	if (data) {
		return data as VerifyEmailResponse;
	} else {
		throw new Error('Something went wrong');
	}
};

export function useVerifyEmailMutation() {
	return useMutation<VerifyEmailResponse, Error, VerifyEmailToken>({
		mutationFn: (emailToken) => onResetPasswordSubmit(emailToken),
	});
}

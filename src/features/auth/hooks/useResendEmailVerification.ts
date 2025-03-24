import apiClient from '@/config/apiClient';
import { useMutation } from '@tanstack/react-query';

// TODO: Consolidate with useOnSignUpSubmitMutation
export type ResendEmailVerificationRequest = {
	email: string;
};

type ResendVerificationEmailResponse = {
	email: string;
};

export const onResendEmailVerificationSubmit = async ({
	email,
}: ResendEmailVerificationRequest): Promise<ResendVerificationEmailResponse> => {
	const { data } = await apiClient.post('/ResendVerificationEmail', {
		email,
	});
	return data as ResendVerificationEmailResponse;
};

export function useResendEmailVerification() {
	return useMutation<ResendVerificationEmailResponse, Error, ResendEmailVerificationRequest>({
		mutationFn: (loginData) => onResendEmailVerificationSubmit(loginData),
	});
}

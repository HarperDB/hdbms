import apiClient from '@/config/apiClient';
import { useMutation } from '@tanstack/react-query';

// TODO: Consolidate with useOnSignUpSubmitMutation
type VerifyEmailToken = {
	token: string;
};

type VerifyEmailResponse = {
	useId: string;
	email: string;
};

const onVerifyEmailTokenSubmit = async (token: VerifyEmailToken): Promise<VerifyEmailResponse> => {
	const { data } = await apiClient.put('/VerifyEmail', {
		token: token.toString(),
	});
	return data as VerifyEmailResponse;
};

function useVerifyEmailMutation() {
	return useMutation<VerifyEmailResponse, Error, VerifyEmailToken>({
		mutationFn: (emailToken) => onVerifyEmailTokenSubmit(emailToken),
	});
}

export type { VerifyEmailToken, VerifyEmailResponse };
export { useVerifyEmailMutation };

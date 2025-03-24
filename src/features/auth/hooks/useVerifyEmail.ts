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
	if (data) {
		return data as VerifyEmailResponse;
	} else {
		throw new Error('Something went wrong');
	}
};

function useVerifyEmailMutation() {
	return useMutation<VerifyEmailResponse, Error, VerifyEmailToken>({
		mutationFn: (emailToken) => onVerifyEmailTokenSubmit(emailToken),
	});
}

export type { VerifyEmailToken, VerifyEmailResponse };
export { useVerifyEmailMutation };

import instanceClient from '@/config/instanceClient';
import { useMutation } from '@tanstack/react-query';

// TODO: Consolidate with useOnSignUpSubmitMutation

type RegistrationInfoResponse = {
	id: string;
	email: string;
	firstname: string;
	lastname: string;
};

const onRegistrationInfoSubmit = async (instanceURL: string): Promise<RegistrationInfoResponse> => {
	const { data } = await instanceClient.post(instanceURL, {
		operation: 'registration_info',
	});
	if (data) {
		return data;
	}
	throw new Error('Something went wrong');
};

function useRegistrationInfoMutation() {
	return useMutation<RegistrationInfoResponse, Error, string>({
		mutationFn: (instanceUrl) => onRegistrationInfoSubmit(instanceUrl),
		retry: false,
	});
}

export { useRegistrationInfoMutation };

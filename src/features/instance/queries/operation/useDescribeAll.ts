import instanceClient from '@/config/instanceClient';
import { useMutation } from '@tanstack/react-query';

// TODO: Consolidate with useOnSignUpSubmitMutation

// type RegistrationInfoResponse = {
// 	id: string;
// 	email: string;
// 	firstname: string;
// 	lastname: string;
// };

const onDescribeAllSubmit = async (instanceURL: string): Promise<object> => {
	const { data } = await instanceClient.post(instanceURL, {
		operation: 'describe_all',
	});
	if (data) {
		return data;
	}
	throw new Error('Something went wrong');
};

function useDescribeAllMutation() {
	return useMutation<object, Error, string>({
		mutationFn: (instanceUrl) => onDescribeAllSubmit(instanceUrl),
		retry: false,
	});
}

export { useDescribeAllMutation };

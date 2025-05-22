import { useMutation } from '@tanstack/react-query';
import instanceClient from '@/config/instanceClient';

const onDeleteDatabase = async (databaseName: string) => {
	const { data } = await instanceClient.post('/', {
		operation: 'drop_database',
		schema: databaseName,
	});
	return data;
};

const useDeleteDatabaseMutation = () => {
	return useMutation({
		mutationFn: (recordsData: string) => onDeleteDatabase(recordsData),
	});
};

export { useDeleteDatabaseMutation };

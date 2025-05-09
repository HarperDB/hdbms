import { useMutation } from '@tanstack/react-query';
import instanceClient from '@/config/instanceClient';

type UpdateTableRecordsData = {
	databaseName: string;
	tableName: string;
	records: object[];
};

const onUpdateTableRecords = async (formData: UpdateTableRecordsData) => {
	const { databaseName, tableName, records } = formData;
	const { data } = await instanceClient.post('/', {
		operation: 'update',
		schema: databaseName,
		table: tableName,
		records: records,
	});
	return data;
};

const useUpdateTableRecords = () => {
	return useMutation({
		mutationFn: (formData: UpdateTableRecordsData) => onUpdateTableRecords(formData),
	});
};

export { useUpdateTableRecords };
export type { UpdateTableRecordsData };

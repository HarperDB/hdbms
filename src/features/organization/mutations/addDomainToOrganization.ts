import { apiClient } from '@/config/apiClient';
import { useMutation } from '@tanstack/react-query';
import z from 'zod';

export const DOMAIN_REQUIRED_MESSAGE = 'Enter a domain name.';

export const AddOrganizationDomainSchema = z.object({
	domain: z.string().trim().min(1, DOMAIN_REQUIRED_MESSAGE),
	organizationId: z.string(),
});

export async function onAddDomainToOrganizationSubmit(formData: z.infer<typeof AddOrganizationDomainSchema>) {
	// TODO: API does not describe this endpoint.
	const { data } = await apiClient.post('/Domain/' as any, formData);
	return data;
}

export function useAddDomainToOrganization() {
	return useMutation({
		mutationFn: (formData: z.infer<typeof AddOrganizationDomainSchema>) => onAddDomainToOrganizationSubmit(formData),
		meta: { skipGlobalErrorToast: true },
		// Not React Query's default `'online'`: that pauses the mutation before `mutationFn` runs
		// while `onlineManager` says offline, so `mutateAsync` never settles, the sequential loop
		// hangs on its first await with the form locked and no message, and the queued POST fires
		// later for a submit the user abandoned. Letting it run means axios rejects with
		// `ERR_NETWORK` immediately, which the caller reports inline like any other failure.
		networkMode: 'always',
	});
}

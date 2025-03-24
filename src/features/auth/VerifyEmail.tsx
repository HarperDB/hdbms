import { useNavigate, useSearch } from '@tanstack/react-router';
import { useVerifyEmailMutation, VerifyEmailToken } from '@/features/auth/hooks/useVerifyEmail';
import { useCallback, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useResendEmailVerification } from './hooks/useResendEmailVerification';

const VerifyEmailSchema = z.object({
	email: z
		.string({
			message: 'Please enter a valid email address',
		})
		.max(75, { message: 'Email must be less than 75 characters' })
		.email({ message: 'Please enter a valid email address' }),
});

function VerifyEmail() {
	const { token } = useSearch({ strict: false });
	const navigate = useNavigate();

	const { mutate: submitEmailVerificationToken, data, isPending } = useVerifyEmailMutation();
	const { mutate: submitResendEmailVerification } = useResendEmailVerification();

	const form = useForm<z.infer<typeof VerifyEmailSchema>>({
		resolver: zodResolver(VerifyEmailSchema),
		defaultValues: {
			email: '',
		},
	});

	console.log('searchParams', token);

	const submitEmailToken = useCallback(
		(emailToken: VerifyEmailToken) => {
			submitEmailVerificationToken(emailToken, {
				onSuccess: () => {
					//TODO - Trigger a success toast message
					navigate({ to: '/' });
				},
			});
		},
		[submitEmailVerificationToken, navigate]
	);

	useEffect(() => {
		if (token) {
			submitEmailToken(token);
		}
	}, [submitEmailToken, token]);

	const submitForm = async (formData: z.infer<typeof VerifyEmailSchema>) => {
		submitResendEmailVerification(formData, {
			onSuccess: () => {
				//TODO - Trigger a success toast message
				navigate({ to: '/' });
			},
		});
	};

	return (
		<div className="text-white w-xs">
			<h1 className="text-3xl font-light">Verify Email</h1>
			{data?.email ? (
				<p className="text-sm pt-1">Email verified successfully</p>
			) : isPending ? (
				<p className="text-sm pt-1">Verifying email...</p>
			) : (
				<div>
					<p className="text-sm py-2">Please Enter an Email</p>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(submitForm)} className="my-4">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem className="my-2">
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												type="email"
												placeholder="jane.smith@harperdb.io"
												className="bg-purple-400 border-purple-400 dark:bg-black dark:border-black"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit" variant="submit" className="w-full my-2 rounded-full">
								Send Password Reset Email
							</Button>
						</form>
					</Form>
				</div>
			)}
		</div>
	);
}

export default VerifyEmail;

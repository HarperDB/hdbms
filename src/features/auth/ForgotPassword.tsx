import { Link, useNavigate } from '@tanstack/react-router';
import { useForgotPasswordMutation } from '@/features/auth/hooks/useForgotPassword';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const ForgotPasswordSchema = z.object({
	email: z
		.string({
			message: 'Please select an email to display.',
		})
		.max(75, { message: 'Email must be less than 75 characters' })
		.email(),
});

function ForgotPassword() {
	const navigate = useNavigate();
	const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
		resolver: zodResolver(ForgotPasswordSchema),
		defaultValues: {
			email: '',
		},
	});

	const { mutate: submitForgotPasswordData } = useForgotPasswordMutation();

	const submitForm = async (formData: z.infer<typeof ForgotPasswordSchema>) => {
		await submitForgotPasswordData(formData, {
			onSuccess: () => {
				//TODO - Trigger a success toast message
				navigate({ to: '/' });
			},
		});
	};

	return (
		<div className="text-white w-xs">
			<h1 className="text-3xl font-light">Sign in to Harper Fabric</h1>
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
										className="bg-purple-400 border-purple-400"
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
			<div className="flex px-4 mt-4 underline place-content-between">
				<Link className="text-sm" to="/">
					Sign in to your account
				</Link>
				<Link className="text-sm" to="/signup">
					Sign up for free
				</Link>
			</div>
		</div>
	);
}

export default ForgotPassword;

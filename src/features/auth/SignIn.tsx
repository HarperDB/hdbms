import { Link, useNavigate } from 'react-router';
import { useOnLoginSubmitMutation } from '@/features/auth/queries/useSignIn';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const SignInSchema = z.object({
	email: z
		.string({
			message: 'Please select an email to display.',
		})
		.max(75, { message: 'Email must be less than 75 characters' })
		.email(),
	password: z
		.string({
			message: 'Please enter your password',
		})
		.min(1, { message: 'Password is required' })
		.max(50, { message: 'Password must be less than 50 characters' }),
});

function SignIn() {
	const navigate = useNavigate();
	const form = useForm<z.infer<typeof SignInSchema>>({
		resolver: zodResolver(SignInSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const { mutate: submitLoginData } = useOnLoginSubmitMutation();

	const submitForm = async (formData: z.infer<typeof SignInSchema>) => {
		await submitLoginData(formData, {
			onSuccess: () => {
				form.reset();
				navigate('/');
			},
			onError: (error) => {
				console.log('error:', error);
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
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input type="email" placeholder="jane.smith@harperdb.io" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input type="password" placeholder="password" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" variant="submit" className="w-full rounded-full">
						Sign In
					</Button>
				</form>
			</Form>
			<div className="flex px-4 mt-4 underline place-content-between">
				<Link className="text-sm" to="/sign-up">
					Sign up for free
				</Link>
				<Link className="text-sm" to="/reset-password">
					Reset password
				</Link>
			</div>
		</div>
	);
}

export default SignIn;

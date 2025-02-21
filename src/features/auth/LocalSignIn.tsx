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

function LocalSignIn() {
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
		<main className="flex items-center justify-center h-screen px-6 blue-pink-gradient dark:bg-black-dark">
			<div className="text-white">
				<h1 className="text-3xl font-light">Please sign into Harper Fabric</h1>
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
				<button
					className="fixed p-2 text-white bg-blue-400 rounded-md bottom-4 right-4"
					onClick={() => {
						document.documentElement.classList.toggle('dark');
						localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
					}}
				>
					Toggle Theme
				</button>
			</div>
		</main>
	);
}

export default LocalSignIn;

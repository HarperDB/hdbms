import { Link, useNavigate, useRouter } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSignUpMutation } from '@/features/auth/hooks/useSignUp';

const SignInSchema = z.object({
	firstname: z
		.string({
			message: 'Please enter your first name.',
		})
		.max(50, { message: 'First name must be less than 50 characters.' }),
	lastname: z
		.string({
			message: 'Please enter your last name.',
		})
		.max(50, { message: 'Last name must be less than 50 characters.' }),
	email: z
		.string({
			message: 'Please select an email to display.',
		})
		.max(75, { message: 'Email must be less than 75 characters.' })
		.email(),
	password: z
		.string({
			message: 'Please enter your password.',
		})
		.min(1, { message: 'Password is required.' })
		.max(50, { message: 'Password must be less than 50 characters.' }),
});

function SignUp() {
	const navigate = useNavigate();
	const form = useForm<z.infer<typeof SignInSchema>>({
		resolver: zodResolver(SignInSchema),
		defaultValues: {
			firstname: '',
			lastname: '',
			email: '',
			password: '',
		},
	});

	const { mutate: submitSignUpData } = useSignUpMutation();

	const submitForm = async (formData: z.infer<typeof SignInSchema>) => {
		await submitSignUpData(formData, {
			onSuccess: () => {
				//TODO: Trigger a success toast message
				navigate({ to: '/' });
			},
		});
	};

	return (
		<div className="text-white w-xs">
			<h1 className="text-3xl font-light">Sign up for Harper Studio</h1>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(submitForm)} className="grid gap-4 my-4">
					<FormField
						control={form.control}
						name="firstname"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="pb-1">First Name</FormLabel>
								<FormControl>
									<Input type="text" placeholder="Jane" className="bg-purple-400 border-purple-400" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="lastname"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="pb-1">Last Name</FormLabel>
								<FormControl>
									<Input type="text" placeholder="Doe" className="bg-purple-400 border-purple-400" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="pb-1">Email</FormLabel>
								<FormControl>
									<Input
										type="email"
										placeholder="jane.doe@harpersystems.dev"
										className="bg-purple-400 border-purple-400"
										{...field}
									/>
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
								<FormLabel className="pb-1">Password</FormLabel>
								<FormControl>
									<Input
										type="password"
										placeholder="password"
										className="bg-purple-400 border-purple-400"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit" variant="submit" className="w-full my-2 rounded-full">
						Sign Up For Free
					</Button>
				</form>
			</Form>
			<div className="flex px-4 mt-4 underline place-content-between">
				<Link className="m-auto text-sm" to="/">
					Already have an account? Sign in instead.
				</Link>
			</div>
		</div>
	);
}

export default SignUp;

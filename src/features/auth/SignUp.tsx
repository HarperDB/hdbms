import { Link } from 'react-router';
import { useForm, SubmitHandler } from 'react-hook-form';
import { SignUpRequest, useOnSignUpSubmitMutation } from '@/features/auth/queries/useSignUp';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function SignUp() {
	const form = useForm<SignUpRequest>({
		defaultValues: {
			email: '',
			password: '',
			firstname: '',
			lastname: '',
		},
	});

	const {
		mutate: signUpSubmit,
		data: signUpResponse,
		// isLoading,
		// isError,
		// isSuccess,
		// error
	} = useOnSignUpSubmitMutation();

	const submitForm: SubmitHandler<SignUpRequest> = ({ email, password, firstname, lastname }) => {
		signUpSubmit({ email, password, firstname, lastname });
		console.log(signUpResponse);
	};

	return (
		<div className="text-white w-xs">
			<h1 className="text-3xl font-light">Sign Up</h1>
			<Form {...form}>
				<form className="mt-6" onSubmit={form.handleSubmit(submitForm)}>
					<FormField
						control={form.control}
						name="firstname"
						render={({ field }) => (
							<FormItem>
								<FormLabel>First Name</FormLabel>
								<FormControl>
									<Input {...field} id="firstname" type="text" placeholder="Jane" />
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="lastname"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Last Name</FormLabel>
								<FormControl>
									<Input {...field} id="lastname" type="text" placeholder="Doe" />
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input {...field} id="email" type="email" placeholder="jane.doe@harperdb.io" />
								</FormControl>
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
									<Input {...field} id="password" type="password" placeholder="Password" />
								</FormControl>
							</FormItem>
						)}
					/>
					<Button type="submit" variant="submit" className="w-full rounded-full">
						Sign Up
					</Button>
				</form>
			</Form>
			<div className="w-full px-4 mt-4 text-center underline place-content-between">
				<Link className="text-sm" to="/signin">
					Already have an account? Sign in instead.
				</Link>
			</div>
		</div>
	);
}

export default SignUp;

import { Link, useNavigate } from 'react-router';
import { useOnLoginSubmitMutation, SignInRequest } from '@/features/auth/queries/useSignIn';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function SignIn() {
	const navigate = useNavigate();
	const form = useForm<SignInRequest>();

	const {
		mutate: submitLoginData,
		isPending: isSubmitLoginDataPending,
		//  isError,
		//  isSuccess,
		//  error
	} = useOnLoginSubmitMutation();

	//  console.log(formErrors);

	const submitForm: SubmitHandler<SignInRequest> = async ({ email, password }) => {
		await submitLoginData(
			{ email, password },
			{
				onSuccess: () => {
					navigate('/');
				},
				onError: (error) => {
					console.log('error:', error);
				},
			}
		);
	};

	return (
		<div className="text-white">
			<h1 className="text-3xl font-light">Sign in to Harper Fabric</h1>
			{/* <form onSubmit={handleSubmit(submitForm)}>
				<div className="py-4">
					<label className="block pb-2 text-sm" htmlFor="email">
						Email
					</label>
					<input
						id="email"
						{...register('email', { required: true })}
						type="email"
						placeholder="jane.doe@harperdb.io"
					/>
				</div>
				<div>
					<label className="block pb-2 text-sm" htmlFor="password">
						Password
					</label>
					<input id="password" {...register('password', { required: true })} type="password" placeholder="password" />
				</div>
				<button
					type="submit"
					className="w-full py-2 mt-6 text-sm rounded-full blue-gradient"
					disabled={isSubmitLoginDataPending || isFormLoading || isFormDirty}
				>
					Sign In
				</button>
			</form> */}
			<Form {...form}>
				<form onSubmit={form.handleSubmit(submitForm)} className="my-4">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="block text-sm">Email</FormLabel>
								<FormControl>
									<Input placeholder="jane.smith@harperdb.io" {...field} />
								</FormControl>
								{/* <FormDescription>This is your public display name.</FormDescription> */}
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="block text-sm">Password</FormLabel>
								<FormControl>
									<Input placeholder="password" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" disabled={isSubmitLoginDataPending} variant="submit" className="w-full rounded-full">
						{' '}
						Sign In{' '}
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

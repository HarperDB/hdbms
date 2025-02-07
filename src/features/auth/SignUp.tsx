import { Link } from 'react-router';
import { useForm, SubmitHandler } from 'react-hook-form';
import { SignUpRequest, useOnSignUpSubmitMutation } from '@/features/auth/queries/use-signup';

function SignUp() {
	const {
		register, 
		handleSubmit, 
		formState: { errors: formErrors } 
	} = useForm<SignUpRequest>();

	const { 
		mutate: signUpSubmit,
		data: signUpResponse,
		isLoading,
		isError,
		isSuccess,
		error
	} = useOnSignUpSubmitMutation();

	const submitForm: SubmitHandler<SignUpRequest> = ({email, password, firstname, lastname}) => {
		signUpSubmit({email, password, firstname, lastname})
		console.log(signUpResponse);
	}
	
	return (
		<div className="text-white w-sm">
			<h1 className="text-3xl font-light">Sign Up</h1>
			<form className="mt-6" onSubmit={handleSubmit(submitForm)}>
				<div className="mb-2">
					<label className="block pb-2 text-sm" htmlFor="firstname">
						First Name
					</label>
					<input 
						id="firstname" 
						{...register("firstname", { required: true })}
						type="text"
						placeholder="Jane" />
				</div>
				<div className="my-4">
					<label className="block pb-2 text-sm" htmlFor="lastname">
						Last Name
					</label>
					<input
						id="lastname"
						{...register("lastname", { required: true })}
						type="text" 
						placeholder="Doe"
					/>
				</div>
				<div className="my-4">
					<label className="block pb-2 text-sm" htmlFor="email">
						Email
					</label>
					<input
					id="email"
					{...register("email", { required: true })}
					type="email"
					placeholder="jane.doe@harperdb.io" 
					/>
				</div>
				<div className="my-4">
					<label className="block pb-2 text-sm" htmlFor="password">
						Password
					</label>
					<input
						id="password"
						{...register("password", { required: true })}
						type="password"
						placeholder="confirm password"
					/>
				</div>
				<div className="text-xs">
					By creating an account, you agree to the&nbsp;
					<a
          className='underline'
          href="https://harperdb.io/legal/privacy-policy/" target="_blank" rel="noopener noreferrer">
						Privacy Policy
					</a>
					&nbsp;and&nbsp;
					<a
          className='underline'
						href="https://harperdb.io/legal/harperdb-cloud-terms-of-service/"
						target="_blank"
						rel="noopener noreferrer"
					>
						Terms of Service
					</a>
				</div>
				<button type="submit" className="w-full py-2 mt-6 text-sm rounded-full blue-gradient">
					Sign Up
				</button>
				<div className="w-full px-4 mt-4 text-center underline place-content-between">
					<Link className="text-sm" to="/">
						Already have an account? Sign in instead.
					</Link>
				</div>
			</form>
		</div>
	);
}

export default SignUp;

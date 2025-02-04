import { Link } from 'react-router';

function SignUp() {
	return (
		<div className="text-white w-sm">
			<h1 className="text-3xl font-light">Sign Up</h1>

			<form className="mt-6">
				<div className="mb-2">
					<label className="block pb-2 text-sm" htmlFor="firstname">
						First Name
					</label>
					<input id="firstname" name="firstname" type="text" placeholder="Jane" />
				</div>
				<div className="my-4">
					<label className="block pb-2 text-sm" htmlFor="lastname">
						Last Name
					</label>
					<input id="lastname" name="lastname" type="text" placeholder="Doe" />
				</div>
				<div className="my-4">
					<label className="block pb-2 text-sm" htmlFor="email">
						Email
					</label>
					<input id="email" name="email" type="email" placeholder="jane.doe@harperdb.io" />
				</div>
				<div className="my-4">
					<label className="block pb-2 text-sm" htmlFor="password">
						Password
					</label>
					<input id="password" name="password" type="password" placeholder="confirm password" />
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

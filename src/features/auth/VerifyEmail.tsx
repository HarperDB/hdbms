import { getRouteApi, Link, useNavigate } from '@tanstack/react-router';
import { useVerifyEmailMutation, VerifyEmailToken } from '@/features/auth/hooks/useVerifyEmail';
import { useCallback, useEffect } from 'react';

const route = getRouteApi('');

function VerifyEmail() {
	const navigate = useNavigate();

	const { mutate: submitForgotPasswordData } = useVerifyEmailMutation();

	const submitEmailToken = useCallback(
		(emailToken: VerifyEmailToken) => {
			submitForgotPasswordData(emailToken, {
				onSuccess: () => {
					//TODO - Trigger a success toast message
					navigate({ to: '/' });
				},
			});
		},
		[navigate, submitForgotPasswordData]
	);

	useEffect(() => {
		// TODO - Get the email token from the URL
		const { token } = route.useParams();
		submitEmailToken(token);
	}, [submitEmailToken]);

	return (
		<div className="text-white w-xs">
			<h1 className="text-3xl font-light">Sign in to Harper Fabric</h1>
			<div>You successfully verified your email address. Please sign in to your account.</div>
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

export default VerifyEmail;

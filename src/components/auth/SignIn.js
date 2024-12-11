import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Label } from 'reactstrap';
import { NavLink, useLocation } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import queryString from 'query-string';
import queryFabric from '../../functions/api/functions/queryFabric';

import appState from '../../functions/state/appState';

import getUser from '../../functions/api/lms/getUser';
import Loader from '../shared/Loader';
import usePersistedUser from '../../functions/state/persistedUser';

function SignIn() {
	const { search } = useLocation();
	const { user, token } = queryString.parse(search, { decode: false });
	const theme = useStoreState(appState, (s) => s.theme);
	const [formState, setFormState] = useState({});
	const [formData, setFormData] = useState({});
	const [persistedUser, setPersistedUser] = usePersistedUser({});

	const submit = async () => {
		setFormState({ submitted: true });
		const { email, pass } = formData;
		if (
			theme === 'akamai' &&
			formData.email.indexOf('harperdb.io') === -1 &&
			formData.email.indexOf('akamai.com') === -1 &&
			formData.email.indexOf('walmart.com') === -1
		) {
			setFormState({ error: 'Portal access denied' });
		} else {
			setFormState({ processing: true });

			// const newAuth = await getUser({ email, pass, loggingIn: true });
			const newAuth = await queryFabric({
				url: '/Login',
				method: 'POST',
				// TODO: headers might not be needed
				headers: {
					'Authorization': `Basic ${window.btoa(`${email}:${pass}`)}`,
					'Content-Type': 'application/json',
				},
				body: {
					username: email,
					password: pass,
				},
			});
			// if (!newAuth.status < 400) {

			// }
			console.log('newAuth', newAuth);
			if (!newAuth || newAuth?.error || newAuth.status >= 400) {
				setFormState({
					error: ['Unauthorized', 'User does not exist'].includes(newAuth?.message)
						? 'Login Failed'
						: newAuth?.message || 'Login Failed',
				});
				setTimeout(() => setFormState({}), 5000);
			} else {
				setPersistedUser({ ...persistedUser, email, pass });
				const identity = {
					username: email,
					type: 'email',
					company: email.split('@')[1], // domain name
				};
				/* global Reo */
				Reo.identify(identity);
			}
		}
	};

	useEffect(() => {
		if (user && token) {
			getUser({ email: user, pass: token, loggingIn: true });
		}
	}, [user, token]);

	return (
		<div className="login-form">
			{formState.processing ? (
				<Loader header="signing in" spinner relative />
			) : (
				<>
					<Form>
						<h2 className="mb-2 instructions">Sign in to HarperDB Studio</h2>
						<span className="login-nav-link error d-inline-block">{formState.error}</span>
						<Label className="mb-3 d-block">
							<span className="mb-2 d-inline-block">Email</span>
							<Input
								name="email"
								autoComplete="email"
								required
								minLength={5}
								id="email"
								onChange={(e) => {
									e.currentTarget.focus();
									setFormData({ ...formData, email: e.target.value.trim().toLowerCase() });
								}}
								value={formData.email || ''}
								disabled={formState.submitted}
								type="text"
								title="email"
								placeholder="email address"
							/>
						</Label>
						<Label className="mb-4 d-block">
							<span className="mb-2 d-inline-block">Password</span>
							<Input
								id="password"
								required
								minLength={2}
								onChange={(e) => {
									e.currentTarget.focus();
									setFormData({ ...formData, pass: e.target.value });
								}}
								value={formData.pass || ''}
								disabled={formState.submitted}
								type="password"
								title="password"
								name="password"
								autoComplete="current-password"
								placeholder="password"
							/>
						</Label>
						<Button
							id="signIn"
							type="submit"
							className="border-0 rounded-pill btn-gradient-blue"
							onClick={submit}
							title="Sign In My Account"
							block
							disabled={formState.submitted}
						>
							Sign In
						</Button>
					</Form>
					<div className="px-4 mt-3 d-flex justify-content-between">
						<NavLink to="/sign-up" className="login-nav-link d-inline-block">
							Sign Up for Free
						</NavLink>
						<NavLink to="/reset-password" className="login-nav-link d-inline-block">
							Reset Password
						</NavLink>
					</div>
				</>
			)}
		</div>
	);
}

export default SignIn;

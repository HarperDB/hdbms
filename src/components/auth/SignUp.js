import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Row, Col, Label } from 'reactstrap';
import { NavLink, useLocation } from 'react-router-dom';
import useAsyncEffect from 'use-async-effect';
import queryString from 'query-string';
import { useStoreState } from 'pullstate';

import handleSignup from '../../functions/auth/handleSignup';
import Loader from '../shared/Loader';
import appState from '../../functions/state/appState';
import queryFabric from '../../functions/api/functions/queryFabric';

const defaultFormData = {
	firstname: '',
	lastname: '',
	email: '',
	subdomain: '',
	password: '',
};

/**
 * Default state of a form.
 * @typedef {Object} defaultFormState
 * @property {('idle'|'pending'|'resolved'|'rejected')} status - The current status of the form.
 * @property {Error|null} error - Any error that occurred during form submission.
 */

const defaultFormState = {
	status: 'idle',
	submitted: false,
	pending: false,
	error: null,
};

function SignUp() {
	const { search } = useLocation();
	const { htuk, pageName, pageUri } = queryString.parse(search);
	const auth = useStoreState(appState, (s) => s.auth);
	const theme = useStoreState(appState, (s) => s.theme);
	const [formState, setFormState] = useState(defaultFormState);
	const [formData, setFormData] = useState(defaultFormData);
	const [showToolTip, setShowToolTip] = useState(false);

	const submitForm = async (e) => {
		e.preventDefault();
		setFormState({ status: 'pending' });
		console.log('formData', formData);
		// setFormData({ ...formData, htuk, pageName, pageUri });
		const newFormState = await queryFabric({
			url: '/User',
			method: 'POST',
			body: formData,
		});
		setFormState({ status: 'idle' });
		if (!newFormState.email) {
			setFormState({ error: newFormState });
		}

		if (newFormState.email) {
			setFormData(defaultFormData);
		}
	};

	// useAsyncEffect(async () => {
	// 	if (formState.submitted) {
	// 		const newFormState = await handleSignup({ formData, theme });
	// 		if (!auth.email && newFormState) setFormState(newFormState);
	// 	}
	// }, [formState]);

	return (
		<div className="login-form">
			{formState.status === 'pending' ? (
				<Loader header="creating your account" spinner relative />
			) : (
				<>
					<Form onSubmit={submitForm}>
						<h2 className="mb-2 instructions">Sign Up</h2>
						<span className="mb-2 login-nav-link error d-inline-block">{formState.error}</span>
						<Label className="mb-3 d-block">
							<span className="mb-2 d-inline-block">First Name</span>
							<Input
								id="firstname"
								name="fname"
								minLength={2}
								maxLength={40}
								required
								autoComplete="given-name"
								type="text"
								title="first name"
								placeholder="Jane"
								value={formData.firstname || ''}
								disabled={formState.status === 'pending'}
								onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
							/>
						</Label>
						<Label className="mb-3 d-block">
							<span className="mb-2 d-inline-block">Last Name</span>
							<Input
								id="lastname"
								name="lname"
								maxLength={40}
								minLength={2}
								required
								autoComplete="family-name"
								type="text"
								title="last name"
								placeholder="Doe"
								value={formData.lastname || ''}
								disabled={formState.status === 'pending'}
								onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
							/>
						</Label>
						<Label className="mb-3 d-block">
							<span className="mb-2 d-inline-block">Email</span>
							<Input
								id="email"
								autoComplete="email"
								name="email"
								minLength={5}
								maxLength={80}
								required
								className="mb-2"
								type="text"
								title="email"
								placeholder="jane.doe@harperdb.io"
								value={formData.email || ''}
								disabled={formState.status === 'pending'}
								onChange={(e) => setFormData({ ...formData, email: e.target.value.toLowerCase() })}
							/>
						</Label>
						<Label className="mb-3 d-block">
							<span className="mb-2 d-inline-block">Password</span>
							<Input
								id="password"
								name="password"
								required
								type="password"
								minLength={6}
								className="mb-2"
								title="user password"
								placeholder="Min. 6 characters"
								value={formData.password || ''}
								onChange={(e) => setFormData({ ...formData, password: e.target.value })}
								disabled={formState.status === 'pending'}
							/>
						</Label>
						<Label className="mb-3 d-block">
							<Row>
								<span className="mb-2 d-inline-block">Subdomain</span>
								<Col className="subdomain-form">
									<Input
										id="subdomain"
										name="subdomain"
										required
										className=""
										type="text"
										maxLength={14}
										title="subdomain"
										placeholder="janedev"
										value={formData.subdomain || ''}
										disabled={formState.status === 'pending'}
										onChange={(e) =>
											setFormData({ ...formData, subdomain: e.target.value.substring(0, 14).toLowerCase() })
										}
									/>
								</Col>
								<Col className="subdomain-label">
									.harperdbcloud.com{' '}
									<Button color="link" onClick={() => setShowToolTip(!showToolTip)}>
										<i className="fa fa-question-circle" />
									</Button>
								</Col>
							</Row>
						</Label>
						{showToolTip && <i className="subdomain-explanation">The URL of your HarperDB Cloud Instances</i>}

						<div className="mt-3 mb-3 d-block">
							<div className="disclaimer">
								By creating an account, you agree to the&nbsp;
								<a href="https://harperdb.io/legal/privacy-policy/" target="_blank" rel="noopener noreferrer">
									Privacy Policy
								</a>
								&nbsp;and&nbsp;
								<a
									href="https://harperdb.io/legal/harperdb-cloud-terms-of-service/"
									target="_blank"
									rel="noopener noreferrer"
								>
									Terms of Service
								</a>
							</div>
						</div>
						<Button
							block
							type="submit"
							className="border-0 rounded-pill btn-gradient-blue"
							disabled={formState.status === 'pending'}
						>
							{formState.status === 'pending' ? (
								<i className="text-white fa fa-spinner fa-spin" />
							) : (
								<span>Sign Up For Free</span>
							)}
						</Button>
					</Form>
					<div className="px-4 mt-3">
						<NavLink to="/" className="login-nav-link d-inline-block">
							Already Have An Account? Sign In Instead.
						</NavLink>
					</div>
				</>
			)}
		</div>
	);
}

export default SignUp;

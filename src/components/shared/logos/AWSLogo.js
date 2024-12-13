import React from 'react';

function AWSLogo({ height = 25, theme = 'dark' }) {
	return theme === 'dark' ? (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 511.9 306.4" height={height}>
			<path
				d="M144.3,111.5a51.73,51.73,0,0,0,1.9,15.2,119.35,119.35,0,0,0,5.4,12.3,7,7,0,0,1,1.2,3.9c0,1.7-1,3.4-3.2,5.1l-10.7,7.2a8.28,8.28,0,0,1-4.4,1.5,8,8,0,0,1-5.1-2.4,54.73,54.73,0,0,1-6.1-8c-1.7-2.9-3.4-6.1-5.3-10q-19.95,23.55-50.1,23.5c-14.3,0-25.7-4.1-34.1-12.3s-12.6-19.1-12.6-32.7c0-14.5,5.1-26.2,15.5-35.1S60.9,66.4,78.4,66.4a129.15,129.15,0,0,1,18.1,1.4c6.3.9,12.8,2.2,19.6,3.7V59.1c0-12.9-2.7-22-8-27.2s-14.6-7.8-27.8-7.8a79,79,0,0,0-18.4,2.2,131,131,0,0,0-18.4,5.8,39.81,39.81,0,0,1-6,2.2,12.09,12.09,0,0,1-2.7.5c-2.4,0-3.6-1.7-3.6-5.3V21.2c0-2.7.3-4.8,1.2-6a13.21,13.21,0,0,1,4.8-3.6A99.24,99.24,0,0,1,58.7,3.9,103.71,103.71,0,0,1,85.3.7c20.3,0,35.1,4.6,44.6,13.8S144,37.7,144,56.4v55.2h.3ZM75.2,137.4a53.46,53.46,0,0,0,17.5-3.1,37.9,37.9,0,0,0,16.2-10.9,26.78,26.78,0,0,0,5.8-10.9,62.13,62.13,0,0,0,1.7-14.8V90.5a141.49,141.49,0,0,0-15.7-2.9,123.85,123.85,0,0,0-16-1c-11.4,0-19.8,2.2-25.4,6.8S51,104.5,51,113c0,8,2,14,6.3,18.1C61.4,135.3,67.3,137.4,75.2,137.4Zm136.7,18.4c-3.1,0-5.1-.5-6.5-1.7-1.4-1-2.6-3.4-3.6-6.6l-40-131.6a30.18,30.18,0,0,1-1.5-6.8c0-2.7,1.4-4.3,4.1-4.3h16.7c3.2,0,5.4.5,6.6,1.7,1.4,1,2.4,3.4,3.4,6.6l28.6,112.7L246.3,13.1c.9-3.4,1.9-5.6,3.2-6.6a11.85,11.85,0,0,1,6.8-1.7H270c3.2,0,5.4.5,6.8,1.7,1.4,1,2.6,3.4,3.2,6.6l26.9,114.1L336.4,13.1c1-3.4,2.2-5.6,3.4-6.6a11.36,11.36,0,0,1,6.6-1.7h15.8c2.7,0,4.3,1.4,4.3,4.3,0,.9-.2,1.7-.3,2.7a27,27,0,0,1-1.2,4.3L324,147.7q-1.5,5.1-3.6,6.6a11.23,11.23,0,0,1-6.5,1.7H299.3c-3.2,0-5.4-.5-6.8-1.7s-2.6-3.4-3.2-6.8L262.9,37.7,236.7,147.4c-.9,3.4-1.9,5.6-3.2,6.8s-3.7,1.7-6.8,1.7H211.9Zm218.8,4.6a109.2,109.2,0,0,1-26.2-3.1c-8.5-2.1-15.2-4.3-19.6-6.8-2.7-1.5-4.6-3.2-5.3-4.8a11.49,11.49,0,0,1-1-4.8v-8.7c0-3.6,1.4-5.3,3.9-5.3a11.77,11.77,0,0,1,3.1.5c1,.3,2.6,1,4.3,1.7a92.93,92.93,0,0,0,18.7,6,99.81,99.81,0,0,0,20.3,2c10.7,0,19.1-1.9,24.9-5.6a18.32,18.32,0,0,0,8.9-16.2,16.29,16.29,0,0,0-4.6-11.9c-3.1-3.2-8.9-6.1-17.2-8.9l-24.7-7.7c-12.4-3.9-21.6-9.7-27.2-17.4a40.62,40.62,0,0,1-8.5-24.7,37.28,37.28,0,0,1,4.6-18.9,45.72,45.72,0,0,1,12.3-14,55.57,55.57,0,0,1,17.7-8.9A76,76,0,0,1,436.6,0,87.22,87.22,0,0,1,448,.7c3.9.5,7.5,1.2,11.1,1.9,3.4.9,6.6,1.7,9.7,2.7A33.51,33.51,0,0,1,476,8.4c2.4,1.4,4.1,2.7,5.1,4.3a9.3,9.3,0,0,1,1.5,5.6v8c0,3.6-1.4,5.4-3.9,5.4-1.4,0-3.6-.7-6.5-2q-14.55-6.6-32.7-6.6c-9.7,0-17.4,1.5-22.6,4.8s-8,8.2-8,15.2A16,16,0,0,0,414,55.2c3.4,3.2,9.7,6.5,18.7,9.4l24.2,7.7c12.3,3.9,21.1,9.4,26.4,16.3a38.41,38.41,0,0,1,7.8,23.8,44,44,0,0,1-4.4,19.8,47.24,47.24,0,0,1-12.4,15,54.23,54.23,0,0,1-18.9,9.5A81.19,81.19,0,0,1,430.7,160.4Z"
				transform="translate(-0.02)"
				style={{ fill: '#ffffff' }}
			/>
			<path
				d="M462.9,243.1c-56,41.4-137.4,63.3-207.4,63.3-98.1,0-186.5-36.3-253.2-96.6-5.3-4.8-.5-11.2,5.8-7.5,72.2,41.9,161.3,67.3,253.4,67.3,62.2,0,130.4-12.9,193.3-39.5C464.1,225.9,472.1,236.3,462.9,243.1Zm23.3-26.5c-7.2-9.2-47.3-4.4-65.6-2.2-5.4.7-6.3-4.1-1.4-7.7,32-22.5,84.6-16,90.8-8.5,6.1,7.7-1.7,60.3-31.7,85.5-4.6,3.9-9,1.9-7-3.2C478.2,263.6,493.4,225.6,486.2,216.6Z"
				transform="translate(-0.02)"
				style={{ fill: '#f90' }}
			/>
		</svg>
	) : (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 511.9 306.4" height={height}>
			<path
				d="M144.3,111.5a51.73,51.73,0,0,0,1.9,15.2,119.35,119.35,0,0,0,5.4,12.3,7,7,0,0,1,1.2,3.9c0,1.7-1,3.4-3.2,5.1l-10.7,7.2a8.28,8.28,0,0,1-4.4,1.5,8,8,0,0,1-5.1-2.4,54.73,54.73,0,0,1-6.1-8c-1.7-2.9-3.4-6.1-5.3-10q-19.95,23.55-50.1,23.5c-14.3,0-25.7-4.1-34.1-12.3s-12.6-19.1-12.6-32.7c0-14.5,5.1-26.2,15.5-35.1S60.9,66.4,78.4,66.4a129.15,129.15,0,0,1,18.1,1.4c6.3.9,12.8,2.2,19.6,3.7V59.1c0-12.9-2.7-22-8-27.2s-14.6-7.8-27.8-7.8a79,79,0,0,0-18.4,2.2,131,131,0,0,0-18.4,5.8,39.81,39.81,0,0,1-6,2.2,12.09,12.09,0,0,1-2.7.5c-2.4,0-3.6-1.7-3.6-5.3V21.2c0-2.7.3-4.8,1.2-6a13.21,13.21,0,0,1,4.8-3.6A99.24,99.24,0,0,1,58.7,3.9,103.71,103.71,0,0,1,85.3.7c20.3,0,35.1,4.6,44.6,13.8S144,37.7,144,56.4v55.2h.3ZM75.2,137.4a53.46,53.46,0,0,0,17.5-3.1,37.9,37.9,0,0,0,16.2-10.9,26.78,26.78,0,0,0,5.8-10.9,62.13,62.13,0,0,0,1.7-14.8V90.5a141.49,141.49,0,0,0-15.7-2.9,123.85,123.85,0,0,0-16-1c-11.4,0-19.8,2.2-25.4,6.8S51,104.5,51,113c0,8,2,14,6.3,18.1C61.4,135.3,67.3,137.4,75.2,137.4Zm136.7,18.4c-3.1,0-5.1-.5-6.5-1.7-1.4-1-2.6-3.4-3.6-6.6l-40-131.6a30.18,30.18,0,0,1-1.5-6.8c0-2.7,1.4-4.3,4.1-4.3h16.7c3.2,0,5.4.5,6.6,1.7,1.4,1,2.4,3.4,3.4,6.6l28.6,112.7L246.3,13.1c.9-3.4,1.9-5.6,3.2-6.6a11.85,11.85,0,0,1,6.8-1.7H270c3.2,0,5.4.5,6.8,1.7,1.4,1,2.6,3.4,3.2,6.6l26.9,114.1L336.4,13.1c1-3.4,2.2-5.6,3.4-6.6a11.36,11.36,0,0,1,6.6-1.7h15.8c2.7,0,4.3,1.4,4.3,4.3,0,.9-.2,1.7-.3,2.7a27,27,0,0,1-1.2,4.3L324,147.7q-1.5,5.1-3.6,6.6a11.23,11.23,0,0,1-6.5,1.7H299.3c-3.2,0-5.4-.5-6.8-1.7s-2.6-3.4-3.2-6.8L262.9,37.7,236.7,147.4c-.9,3.4-1.9,5.6-3.2,6.8s-3.7,1.7-6.8,1.7H211.9Zm218.8,4.6a109.2,109.2,0,0,1-26.2-3.1c-8.5-2.1-15.2-4.3-19.6-6.8-2.7-1.5-4.6-3.2-5.3-4.8a11.49,11.49,0,0,1-1-4.8v-8.7c0-3.6,1.4-5.3,3.9-5.3a11.77,11.77,0,0,1,3.1.5c1,.3,2.6,1,4.3,1.7a92.93,92.93,0,0,0,18.7,6,99.81,99.81,0,0,0,20.3,2c10.7,0,19.1-1.9,24.9-5.6a18.32,18.32,0,0,0,8.9-16.2,16.29,16.29,0,0,0-4.6-11.9c-3.1-3.2-8.9-6.1-17.2-8.9l-24.7-7.7c-12.4-3.9-21.6-9.7-27.2-17.4a40.62,40.62,0,0,1-8.5-24.7,37.28,37.28,0,0,1,4.6-18.9,45.72,45.72,0,0,1,12.3-14,55.57,55.57,0,0,1,17.7-8.9A76,76,0,0,1,436.6,0,87.22,87.22,0,0,1,448,.7c3.9.5,7.5,1.2,11.1,1.9,3.4.9,6.6,1.7,9.7,2.7A33.51,33.51,0,0,1,476,8.4c2.4,1.4,4.1,2.7,5.1,4.3a9.3,9.3,0,0,1,1.5,5.6v8c0,3.6-1.4,5.4-3.9,5.4-1.4,0-3.6-.7-6.5-2q-14.55-6.6-32.7-6.6c-9.7,0-17.4,1.5-22.6,4.8s-8,8.2-8,15.2A16,16,0,0,0,414,55.2c3.4,3.2,9.7,6.5,18.7,9.4l24.2,7.7c12.3,3.9,21.1,9.4,26.4,16.3a38.41,38.41,0,0,1,7.8,23.8,44,44,0,0,1-4.4,19.8,47.24,47.24,0,0,1-12.4,15,54.23,54.23,0,0,1-18.9,9.5A81.19,81.19,0,0,1,430.7,160.4Z"
				transform="translate(-0.02)"
				style={{ fill: '#252f3e' }}
			/>
			<path
				d="M462.9,243.1c-56,41.4-137.4,63.3-207.4,63.3-98.1,0-186.5-36.3-253.2-96.6-5.3-4.8-.5-11.2,5.8-7.5,72.2,41.9,161.3,67.3,253.4,67.3,62.2,0,130.4-12.9,193.3-39.5C464.1,225.9,472.1,236.3,462.9,243.1Zm23.3-26.5c-7.2-9.2-47.3-4.4-65.6-2.2-5.4.7-6.3-4.1-1.4-7.7,32-22.5,84.6-16,90.8-8.5,6.1,7.7-1.7,60.3-31.7,85.5-4.6,3.9-9,1.9-7-3.2C478.2,263.6,493.4,225.6,486.2,216.6Z"
				transform="translate(-0.02)"
				style={{ fill: '#f90' }}
			/>
		</svg>
	);
}

export default AWSLogo;

import React from 'react';

import Loader from './Loader';

function Maintenance() {
	return (
		<Loader
			header="HarperDB Studio Is Being Updated"
			body="Please check back in a few minutes and get ready for a whole new batch of awesome!"
		/>
	);
}

export default Maintenance;

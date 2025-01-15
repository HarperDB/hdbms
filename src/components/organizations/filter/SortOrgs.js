import React from 'react';
import { Button } from 'reactstrap';
import { useStoreState } from 'pullstate';

import appState from '../../../functions/state/appState';

const sortOrgsList = (orgs, isAscending) => {
	const orgsList = [...orgs];
	if (isAscending) {
		orgsList.sort((a, b) => a.customer_name.localeCompare(b.customer_name));
	} else {
		orgsList.sort((a, b) => b.customer_name.localeCompare(a.customer_name));
	}
	return orgsList;
};

function SortOrgs() {
	const orgs = useStoreState(appState, (s) => s.auth.orgs);
	const [sortAsc, setSortAsc] = React.useState(true);

	return (
		<Button
			color="link"
			className="me-2"
			onClick={() => {
				appState.update((s) => {
					s.auth.orgs = sortOrgsList(orgs, sortAsc);
					setSortAsc(!sortAsc);
				});
			}}
		>
			{sortAsc ? (
				<span>
					<i className="fa fa-sort-alpha-up" /> Sort by Name: Ascending
				</span>
			) : (
				<span>
					<i className="fa fa-sort-alpha-down" /> Sort by Name: Descending
				</span>
			)}
		</Button>
	);
}

export default SortOrgs;

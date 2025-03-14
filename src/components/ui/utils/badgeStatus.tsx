const renderBadgeVariant = (value: string) => {
	switch (value) {
		case 'PROVISIONING':
			return 'warning';
		case 'RUNNING':
			return 'success';
		case 'STOPPED':
			return 'secondary';
		case 'TERMINATED':
			return 'destructive';
		case 'CLONE_PENDING':
			return 'warning';
		case 'UPDATING_HDB_NODES':
			return 'warning';
		case 'UPDATING':
			return 'warning';
		case 'UPDATED':
			return 'success';
		case 'ERROR':
			return 'destructive';
		case 'TERMINATING':
			return 'destructive';
		case 'CLONE_READY':
			return 'success';
		default:
			return 'default';
	}
};

const renderBadgeText = (value: string) => {
	switch (value) {
		case 'PROVISIONING':
			return 'Provisioning';
		case 'RUNNING':
			return 'Running';
		case 'STOPPED':
			return 'Stopped';
		case 'TERMINATED':
			return 'Terminated';
		case 'CLONE_PENDING':
			return 'Clone Pending';
		case 'UPDATING_HDB_NODES':
			return 'Updating HDB Nodes';
		case 'UPDATING':
			return 'Updating';
		case 'UPDATED':
			return 'Updated';
		case 'ERROR':
			return 'Error';
		case 'TERMINATING':
			return 'Terminating';
		case 'CLONE_READY':
			return 'Clone Ready';
		default:
			return '';
	}
};

export { renderBadgeVariant, renderBadgeText };

export type BadgeStatusVariant =
	| 'PROVISIONING'
	| 'CLONE_PENDING'
	| 'UPDATING_HDB_NODES'
	| 'UPDATING'
	| 'CLONE_READY'
	| 'RUNNING'
	| 'UPDATED'
	| 'STOPPED'
	| 'TERMINATED'
	| 'TERMINATING'
	| 'ERROR'
	| 'REMOVED';

type BadgeStatusVariantValues = 'warning' | 'success' | 'secondary' | 'destructive';

const renderBadgeStatusVariant = (value: BadgeStatusVariant): BadgeStatusVariantValues => {
	switch (value) {
		case 'PROVISIONING':
		case 'CLONE_PENDING':
		case 'UPDATING_HDB_NODES':
		case 'UPDATING':
			return 'warning';
		case 'CLONE_READY':
		case 'RUNNING':
		case 'UPDATED':
			return 'success';
		case 'STOPPED':
			return 'secondary';
		case 'TERMINATED':
		case 'TERMINATING':
		case 'ERROR':
		case 'REMOVED':
			return 'destructive';
		default:
			return value;
	}
};

const BADGE_STATUS_TEXT = {
	PROVISIONING: 'Provisioning',
	RUNNING: 'Running',
	STOPPED: 'Stopped',
	TERMINATED: 'Terminated',
	CLONE_PENDING: 'Clone Pending',
	UPDATING_HDB_NODES: 'Updating HDB Nodes',
	UPDATING: 'Updating',
	UPDATED: 'Updated',
	ERROR: 'Error',
	TERMINATING: 'Terminating',
	CLONE_READY: 'Clone Ready',
	REMOVED: 'Removed',
} as const;

export type BadgeStatus = keyof typeof BADGE_STATUS_TEXT;

const renderBadgeStatusText = (value: BadgeStatus) => {
	const status = BADGE_STATUS_TEXT[value];
	if (status) return status;
	throw new Error('Unsupported Status');
};

export { renderBadgeStatusVariant, renderBadgeStatusText };

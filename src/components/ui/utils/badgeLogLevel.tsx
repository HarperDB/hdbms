export type BadgeLogLevelVariant =
	| 'notify'
	| 'error'
	| 'warn'
	| 'info'
	| 'debug'
	| 'trace'
	| 'stderr'
	| 'stdout'
	| undefined;

type BadgeStatusVariantValues = 'warning' | 'success' | 'secondary' | 'destructive';

const renderBadgeLogLevelVariant = (value: BadgeLogLevelVariant): BadgeStatusVariantValues => {
	switch (value) {
		case 'warn':
			return 'warning';
		case 'notify':
			return 'success';
		case 'info':
		case 'debug':
		case 'trace':
		case undefined:
		case 'stdout':
			return 'secondary';
		case 'stderr':
		case 'error':
			return 'destructive';
		default:
			return value;
	}
};

const BADGE_STATUS_TEXT = {
	notify: 'Notify',
	error: 'Error',
	warn: 'Warning',
	info: 'Info',
	debug: 'Debug',
	trace: 'Trace',
	stdout: 'Stdout',
	stderr: 'Stderr',
	undefined: 'Unknown',
} as const;

export type BadgeStatus = keyof typeof BADGE_STATUS_TEXT;

const renderBadgeLogLevelText = (value: BadgeStatus) => {
	const status = BADGE_STATUS_TEXT[value];
	if (status) return status;
	throw new Error('Unsupported Status');
};

export { renderBadgeLogLevelVariant, renderBadgeLogLevelText };

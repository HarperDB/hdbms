import { Button } from '@/components/ui/button';
import { CloudUploadIcon, FunnelXIcon, PackageIcon, PlusIcon, TableIcon } from 'lucide-react';
import { ComponentType, ReactNode } from 'react';

/**
 * What the result set shows when it has no rows. Three different situations arrive here looking
 * identical, and only the last one is an invitation to do anything:
 *
 *   - a page past the end (paging, or records removed behind you) -- the table has records,
 *     just not here;
 *   - filters that matched nothing -- likewise, and the way out is the filters;
 *   - a genuinely empty table -- the first thing a new user sees, and the moment to offer the two
 *     separate ways of getting data in.
 *
 * Import and Seed are deliberately two cards rather than one "Import Data" button: they are
 * different intentions (bring the data you already have vs. get *some* data to look at), even
 * though both open the same modal -- each on its own method.
 */
export function EmptyResultSet({
	tableName,
	isFiltered,
	isPastFirstPage,
	canImport,
	canSeed,
	canAddRecords,
	onImport,
	onSeed,
	onAddRecords,
	onClearFilters,
}: {
	readonly tableName: string;
	readonly isFiltered: boolean;
	readonly isPastFirstPage: boolean;
	readonly canImport: boolean;
	readonly canSeed: boolean;
	readonly canAddRecords: boolean;
	readonly onImport: () => void;
	readonly onSeed: () => void;
	readonly onAddRecords: () => void;
	readonly onClearFilters: () => void;
}) {
	// Page before filters: on page 3 of a filtered set, "nothing matched" would be wrong -- the
	// matches are on an earlier page.
	if (isPastFirstPage) {
		return (
			<EmptyResultSetShell>
				<Heading>No records on this page</Heading>
				<p className="text-sm text-muted-foreground">
					There are fewer records than this page starts at. Try an earlier page.
				</p>
			</EmptyResultSetShell>
		);
	}

	if (isFiltered) {
		return (
			<EmptyResultSetShell>
				<Heading>No records match these filters</Heading>
				<Button variant="ghost" onClick={onClearFilters}>
					<FunnelXIcon />
					Clear Filters
				</Button>
			</EmptyResultSetShell>
		);
	}

	return (
		<EmptyResultSetShell>
			<Heading>
				<span className="font-mono">{tableName}</span> has no records yet
			</Heading>
			{(canImport || canSeed) && (
				<>
					<p className="text-sm text-muted-foreground">
						Two ways to get some in — bring your own, or start from data we provide.
					</p>
					<div className="flex w-full flex-col gap-3 sm:flex-row">
						{canImport && (
							<GuidanceCard
								Icon={CloudUploadIcon}
								title="Import your data"
								description="Upload a CSV or JSON file, or load a CSV from a URL the instance can reach."
								action="Import data"
								onClick={onImport}
							/>
						)}
						{canSeed && (
							<GuidanceCard
								Icon={PackageIcon}
								title="Seed some data"
								description="Load a ready-made sample dataset, or generate random records to experiment with."
								action="Seed data"
								onClick={onSeed}
							/>
						)}
					</div>
				</>
			)}
			{canAddRecords && (
				<p className="text-sm text-muted-foreground">
					Or write one yourself:{' '}
					<Button variant="link" className="h-auto p-0 text-sm dark:text-violet-300" onClick={onAddRecords}>
						<PlusIcon />
						Add New Record(s)
					</Button>
				</p>
			)}
		</EmptyResultSetShell>
	);
}

function EmptyResultSetShell({ children }: { readonly children: ReactNode }) {
	// Scrolling lives on the outer box and the centring on an inner one with `min-h-full`: centring a
	// taller-than-the-box child directly in a scroll container puts its top above the scrollport,
	// where it can't be scrolled back to. Short panes (a filtered table on a laptop) hit this.
	return (
		<div className="h-full overflow-y-auto p-6">
			<div className="flex min-h-full items-center justify-center">
				<div className="flex w-full max-w-2xl flex-col items-center gap-4 text-center">
					<TableIcon aria-hidden className="size-8 text-muted-foreground/50" />
					{children}
				</div>
			</div>
		</div>
	);
}

function Heading({ children }: { readonly children: ReactNode }) {
	return <h2 className="text-base font-medium">{children}</h2>;
}

function GuidanceCard({
	Icon,
	title,
	description,
	action,
	onClick,
}: {
	readonly Icon: ComponentType<{ className?: string }>;
	readonly title: string;
	readonly description: string;
	readonly action: string;
	readonly onClick: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			// `--primary` is a dark indigo, so every accent here needs the dark-mode violet the rest of
			// the app pairs it with (see ClusterHome); unqualified it disappears into the table's black.
			className="group flex flex-1 cursor-pointer flex-col items-start gap-1.5 rounded-lg border border-border p-4 text-left transition-colors hover:border-primary hover:bg-accent/50 focus-visible:ring-1 focus-visible:ring-purple-200 focus-visible:outline-1 dark:border-grey-700 dark:hover:border-violet-300"
		>
			<span className="flex items-center gap-2 font-medium">
				<Icon className="size-4 text-primary dark:text-violet-300" />
				{title}
			</span>
			<span className="text-sm text-muted-foreground">{description}</span>
			<span className="mt-1 text-sm text-primary group-hover:underline dark:text-violet-300">{action} →</span>
		</button>
	);
}

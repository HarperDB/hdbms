import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Ellipsis } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { renderBadgeStatusText, renderBadgeStatusVariant } from '@/components/ui/utils/badgeStatus';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function ClusterCard({
	clusterId,
	clusterName,
	organizationId,
	status,
}: {
	clusterId: string;
	clusterName: string;
	organizationId: string;
	status: string;
}) {
	return (
		<Card className="relative">
			<CardHeader>
				<CardDescription className="flex justify-between items-center">
					<span>CLUSTER ID: {clusterId}</span>
					<DropdownMenu>
						<DropdownMenuTrigger>
							<Ellipsis aria-label="Cluster options" />
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuLabel>Cluster options</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>Edit</DropdownMenuItem>
							<DropdownMenuItem>Delete</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</CardDescription>
				<CardTitle>
					<h2>{clusterName}</h2>
				</CardTitle>
			</CardHeader>
			<CardContent className="flex justify-between">
				<Badge variant={renderBadgeStatusVariant(status)}>{renderBadgeStatusText(status)}</Badge>
				<Link
					to={`/orgs/${organizationId}/clusters/${clusterId}`}
					className="text-sm"
					aria-label={`View ${clusterName}`}
					title={`View ${clusterName}`}
				>
					<span className="hover:border-b-2 py-2">
						View <ArrowRight className="inline-block" />
					</span>
				</Link>
			</CardContent>
		</Card>
	);
}

export default ClusterCard;

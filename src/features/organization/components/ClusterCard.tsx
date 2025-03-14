import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Ellipsis } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { renderBadgeText, renderBadgeVariant } from '@/components/ui/utils/badgeStatus';

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
	const [isClusterMenuOpen, setIsClusterMenuOpen] = useState(false);
	return (
		<Card className="relative">
			<CardHeader className="">
				<CardDescription className="flex justify-between items-center">
					<span>CLUSTER ID: {clusterId}</span>
					<Button
						className="cursor-pointer"
						variant="ghost"
						onClick={() => {
							setIsClusterMenuOpen(!isClusterMenuOpen);
						}}
					>
						<Ellipsis />
					</Button>
				</CardDescription>
				<CardTitle>
					<h2>{clusterName}</h2>
				</CardTitle>
			</CardHeader>
			<CardContent className="flex justify-between">
				<Badge variant={renderBadgeVariant(status)}>{renderBadgeText(status)}</Badge>
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
			{isClusterMenuOpen && (
				<Card className="absolute top-12 right-5 gap-3 z-40 border border-gray-700 shadow-xl p-3 rounded-md">
					<Button className="block w-20" size="sm">
						Edit
					</Button>
					<Button className="block w-20" size="sm" variant="destructive">
						Delete
					</Button>
				</Card>
			)}
		</Card>
	);
}

export default ClusterCard;

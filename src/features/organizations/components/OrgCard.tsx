import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Ellipsis } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
function OrgCard({
	organizationId,
	organizationName,
	roleName,
}: {
	organizationId: string;
	organizationName: string;
	roleName: string;
}) {
	const [isOrgMenuOpen, setIsOrgMenuOpen] = useState(false);
	return (
		<Card className="relative">
			<CardHeader className="">
				<CardDescription className="flex justify-between items-center">
					<span>ORG ID: {organizationId}</span>
					<Button
						className="cursor-pointer"
						variant="ghost"
						onClick={() => {
							setIsOrgMenuOpen(!isOrgMenuOpen);
						}}
					>
						<Ellipsis />
					</Button>
				</CardDescription>
				<CardTitle>{organizationName}</CardTitle>
			</CardHeader>
			<CardContent className="flex justify-between">
				<Badge>{roleName}</Badge>
				<Link
					to={`/orgs/${organizationId}/clusters/list`}
					className="text-sm"
					aria-label={`View ${organizationName}`}
					title={`View ${organizationName}`}
				>
					<span className="hover:border-b-2 border-0 transition-all duration-100 ease-in-out py-2">
						View <ArrowRight className="inline-block" />
					</span>
				</Link>
			</CardContent>
			{/* TODO: Replace with navigation menu component */}
			{isOrgMenuOpen && (
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

export default OrgCard;

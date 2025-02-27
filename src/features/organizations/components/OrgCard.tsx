import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Ellipsis } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';
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
		<Card className="relative ring-1 ring-black">
			<CardHeader className="p-4">
				<CardDescription className="flex justify-between">
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
			<CardContent className="flex justify-between pb-4">
				<Badge>{roleName}</Badge>
				<Link
					to={`/${organizationId}`}
					className="text-sm "
					aria-label={`View ${organizationName}`}
					title={`View ${organizationName}`}
				>
					View <ArrowRight className="inline-block" />
				</Link>
			</CardContent>
			{isOrgMenuOpen && (
				<Card className="absolute top-12 right-5 z-40 border border-gray-700 shadow-xl p-3 rounded-md">
					<Button className="block w-20" size="sm">
						Edit
					</Button>
					<Button className="block w-20 mt-2" size="sm" variant="destructive">
						Delete
					</Button>
				</Card>
			)}
		</Card>
	);
}

export default OrgCard;

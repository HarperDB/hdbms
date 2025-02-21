import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Ellipsis } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
			<CardHeader>
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
			<CardContent>
				<Badge>{roleName}</Badge>
			</CardContent>
			{isOrgMenuOpen && (
				<Card className="absolute top-12 right-5 z-40 border dark:border-gray-700 shadow-xl p-3 rounded-md">
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

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Ellipsis } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
function OrgCard({
	organizationId,
	organizationName,
	roleName,
}: {
	organizationId: string;
	organizationName: string;
	roleName: string;
}) {
	return (
		<Card className="relative">
			<CardHeader>
				<CardDescription className="flex justify-between items-center">
					<span>ORG ID: {organizationId}</span>
					<DropdownMenu>
						<DropdownMenuTrigger>
							<Ellipsis aria-label="Organization options" />
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuLabel>Org options</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>Edit</DropdownMenuItem>
							<DropdownMenuItem>Delete</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</CardDescription>
				<CardTitle>
					<h2>{organizationName}</h2>
				</CardTitle>
			</CardHeader>
			<CardContent className="flex justify-between">
				<Badge>{roleName}</Badge>
				<Link
					to={`/orgs/${organizationId}/clusters`}
					className="text-sm"
					aria-label={`View ${organizationName}`}
					title={`View ${organizationName}`}
				>
					<span className="hover:border-b-2 border-0 transition-all duration-100 ease-in-out py-2">
						View <ArrowRight className="inline-block" />
					</span>
				</Link>
			</CardContent>
		</Card>
	);
}

export default OrgCard;

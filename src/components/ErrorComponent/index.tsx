import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

const ErrorComponent = ({ error }: { error: Error }) => {
	return (
		<Card className="text-red p-5 border border-red rounded-md">
			<CardHeader>
				<CardTitle className="text-2xl">
					<h2>Not Found</h2>
				</CardTitle>
				<CardDescription>{error.message}</CardDescription>
			</CardHeader>
			<CardContent>
				<Link to="/orgs">
					<Button>
						{' '}
						<ArrowLeft /> Go To Orgs List
					</Button>
				</Link>
			</CardContent>
		</Card>
	);
};

export default ErrorComponent;

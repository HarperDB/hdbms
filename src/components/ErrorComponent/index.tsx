import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useGetCurrentUser } from '@/hooks/useGetCurrentUser';

const ErrorComponent = ({ error }: { error: Error }) => {
	const { data: user, isLoading: isUserLoading } = useGetCurrentUser();

	return (
		<Card className="text-red p-5 border border-red rounded-md">
			<CardHeader>
				<CardTitle className="text-2xl">
					<h2>Component Error</h2>
				</CardTitle>
				<CardDescription>{error.message}</CardDescription>
			</CardHeader>
			<CardContent>
				{user && !isUserLoading ? (
					<Link to="/orgs">
						<Button>
							{' '}
							<ArrowLeft /> See Orgs List
						</Button>
					</Link>
				) : (
					<Link to="/">
						<Button>
							{' '}
							<ArrowLeft /> Go Sign In Page
						</Button>
					</Link>
				)}
			</CardContent>
		</Card>
	);
};

export default ErrorComponent;

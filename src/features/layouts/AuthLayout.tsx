import { Provider } from '@/components/ui/provider';
import { Box, SimpleGrid, Text } from '@chakra-ui/react';
import { Outlet } from 'react-router';

function AuthLayout() {
	return (
		<Provider>
		<SimpleGrid columns={[1, 2]}>
				<Box as='section' display={{ base: "none", md: "block" }}>
					<Box>
						<Text as='h1'>HarperDB Studio</Text>
						<Text as='span'>Manage all your HarperDB instances.</Text>
						<ul>
							<li>
								<h3>Manage All Instances</h3>
								<span>Set access, cluster, monitor, and more.</span>
							</li>
							<li>
								<h3>Embedded API Server</h3>
								<span>HarperDB components give you unlimited application flexibility.</span>
							</li>
							<li>
								<h3>Fully Managed Cloud & 5G Instances</h3>
								<span>Go from zero to code in minutes.</span>
							</li>
							<li>
								<h3>Deploy Anywhere</h3>
								<div>
									<a
										href="https://hub.docker.com/r/harperdb/harperdb"
										target="_blank"
										rel="noreferrer noopener"
									>
										Docker
									</a>
									<a
										href="https://www.npmjs.com/package/harperdb"
										target="_blank"
										rel="noreferrer noopener"
									>
										npm
									</a>
									<a
										href="https://docs.harperdb.io/docs/deployments/install-harperdb"
										target="_blank"
										rel="noreferrer noopener"
									>
										all options
									</a>
								</div>
							</li>
						</ul>
					</Box>
				</Box>
				<Box as='section' display='flex' justifyContent='center' alignItems='center' minHeight='100vh'>
					<Outlet />
				</Box>
		</SimpleGrid>
		</Provider>
	);
}

export default AuthLayout;

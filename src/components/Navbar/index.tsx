'use client';
import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { X, Menu } from 'lucide-react';

import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { useSignOutMutation } from '@/features/auth/hooks/useSignOut';
import { QueryCache } from '@tanstack/react-query';
import { toast } from 'sonner';

function MobileNav({ signOut }: { signOut: () => void }) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	return (
		<div className="md:hidden" id="mobile-menu">
			<div className="flex items-center justify-between">
				<Link to="/orgs">
					<img src="/logo_harper_db_studio.png" alt="logo" className="w-64" />
				</Link>
				<button
					type="button"
					className="text-grey-400 hover:text-white shadow-xs hover:bg-black-dark"
					onClick={() => {
						setIsMenuOpen(!isMenuOpen);
					}}
				>
					<span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
					{isMenuOpen ? <X /> : <Menu />}
				</button>
			</div>
			<div
				className={`${
					isMenuOpen ? 'block' : 'hidden'
				} md:hidden space-y-1 pb-3 bg-black-dark absolute left-0 top-full w-full rounded-b-md`}
			>
				<Link to="/orgs" className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white">
					Organizations
				</Link>
				<Link
					to="/profile"
					className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
				>
					Profile
				</Link>
				<Link
					to="/docs"
					className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
				>
					Resources
				</Link>
				<Link
					to="#"
					className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
				>
					Theme
				</Link>
				<Link
					to={undefined}
					onClick={signOut}
					className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
				>
					Sign Out
				</Link>
			</div>
		</div>
	);
}

const DesktopNav = ({ signOut }: { signOut: () => void }) => {
	return (
		<div className="hidden md:block">
			<div className="flex items-center justify-between">
				<div className="inline-block">
					<Link to="/orgs">
						<img src="/logo_harper_db_studio.png" alt="logo" className="w-64" />
					</Link>
				</div>
				<NavigationMenu>
					<NavigationMenuList>
						<NavigationMenuItem>
							<NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
								<Link to="/orgs">Organizations</Link>
							</NavigationMenuLink>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
								<Link to="/profile">Profile</Link>
							</NavigationMenuLink>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
								<Link to="https://docs.harperdb.io/docs" target="_blank" rel="noreferrer noopener">
									Resources
								</Link>
							</NavigationMenuLink>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
								<Link to="/">Theme</Link>
							</NavigationMenuLink>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
								<Link to={undefined} onClick={signOut}>
									Sign Out
								</Link>
							</NavigationMenuLink>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>
			</div>
		</div>
	);
};

export function NavBar() {
	const { mutate: signOut } = useSignOutMutation();
	const navigate = useNavigate();
	const queryCache = new QueryCache();
	const handleSignOut = () => {
		signOut(undefined, {
			onSuccess: () => {
				toast.success('Success', {
					description: 'You have been signed out successfully.',
					action: {
						label: 'Dismiss',
						onClick: () => toast.dismiss(),
					},
				});
				navigate({ to: '/' });
			},
		});
		queryCache.clear();
	};
	return (
		<>
			<MobileNav signOut={handleSignOut} />
			<DesktopNav signOut={handleSignOut} />
		</>
	);
}

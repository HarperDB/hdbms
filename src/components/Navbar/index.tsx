'use client';
import {useState} from 'react';
import { Link } from '@tanstack/react-router';
import { X, Menu } from 'lucide-react';

import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

function MobileNav() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	return (
		<div className="md:hidden" id="mobile-menu">
			<div className="flex items-center justify-between">
				<div>
					<img src="/logo_harper_db_studio.png" alt="logo" className="w-64" />
				</div>
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
			<div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden space-y-1 pb-3 bg-black-dark absolute left-0 top-full w-full rounded-b-md`}>
				<Link to="/" className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white">
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
					to="/sign-in"
					className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
				>
					Sign Out
				</Link>
			</div>
		</div>
	);
}

const DesktopNav = () => {
	return (
		<div className="hidden md:block">
			<div className="flex items-center justify-between">
				<div className="inline-block">
					<img src="/logo_harper_db_studio.png" alt="logo" className="w-64" />
				</div>
				<NavigationMenu>
					<NavigationMenuList>
						<NavigationMenuItem>
							<NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
								<Link to="/">Organizations</Link>
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
								<Link
									to="/signin"
	
								>
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
	return (
		<>
			<MobileNav />
			<DesktopNav />
		</>
	);
}

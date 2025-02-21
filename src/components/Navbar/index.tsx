'use client';

import * as React from 'react';
import { Link } from 'react-router';
import { X, Menu } from 'lucide-react';

import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

function MobileNav() {
	const [isMenuOpen, setIsMenuOpen] = React.useState(false);
	return (
		<div className="md:hidden" id="mobile-menu">
			<div className="flex items-center justify-between px-4 pt-5 pb-4">
				<div>
					<img src="/logo_harper_db_studio.png" alt="logo" className="w-64" />
				</div>
				<button
					type="button"
					className="text-grey-400 hover:text-white shadow-xs bg-black-dark hover:bg-black-dark"
					onClick={() => {
						setIsMenuOpen(!isMenuOpen);
					}}
				>
					<span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
					{isMenuOpen ? <X /> : <Menu />}
				</button>
			</div>
			<div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden space-y-1 px-2 pt-2 pb-3`}>
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
			<div className="flex h-16 items-center justify-between px-12">
				<div className="inline-block">
					<img src="/logo_harper_db_studio.png" alt="logo" className="w-64" />
				</div>
				<NavigationMenu>
					<NavigationMenuList>
						<NavigationMenuItem>
							<NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
								<Link to="/docs">Organizations</Link>
							</NavigationMenuLink>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
								<Link to="/docs">Profile</Link>
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
								<Link to="/sign-in">Sign Out</Link>
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

function ListItem({ title, children, href, ...props }: React.ComponentPropsWithoutRef<'li'> & { href: string }) {
	return (
		<li {...props}>
			<NavigationMenuLink asChild>
				<Link href={href}>
					<div className="text-sm leading-none font-medium">{title}</div>
					<p className="text-muted-foreground line-clamp-2 text-sm leading-snug">{children}</p>
				</Link>
			</NavigationMenuLink>
		</li>
	);
}

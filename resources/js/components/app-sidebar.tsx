import { Link } from '@inertiajs/react';
import { BookOpen, FolderGit2, LayoutGrid, Tag, Package, Award, ShoppingCart, FileText, MapPin, MessageSquare, Star } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
    { title: 'Categories', href: '/dashboard/categories', icon: Tag },
    { title: 'Brands', href: '/dashboard/brands', icon: Award },
    { title: 'Products', href: '/dashboard/products', icon: Package },
    { title: 'Orders', href: '/dashboard/orders', icon: ShoppingCart },
    { title: 'Blogs', href: '/dashboard/blogs', icon: FileText },
    { title: 'Stores', href: '/dashboard/stores', icon: MapPin },
    { title: 'Consultations', href: '/dashboard/consultations', icon: MessageSquare },
    { title: 'Reviews', href: '/dashboard/reviews', icon: Star },
];

const footerNavItems: NavItem[] = [
    { title: 'Repository', href: 'https://github.com/laravel/react-starter-kit', icon: FolderGit2 },
    { title: 'Documentation', href: 'https://laravel.com/docs/starter-kits#react', icon: BookOpen },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

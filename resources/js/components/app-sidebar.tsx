import * as React from 'react';
import { Link } from '@inertiajs/react';
import {
    LayoutGrid, Tag, Package, Award, ShoppingCart, FileText,
    MapPin, MessageSquare, Star, BookOpen, FolderGit2,
    Store, Newspaper, Settings,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarSeparator,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const overviewItems: NavItem[] = [
    { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
];

const catalogItems: NavItem[] = [
    { title: 'Categories', href: '/dashboard/categories', icon: Tag },
    { title: 'Brands', href: '/dashboard/brands', icon: Award },
    { title: 'Products', href: '/dashboard/products', icon: Package },
];

const salesItems: NavItem[] = [
    { title: 'Orders', href: '/dashboard/orders', icon: ShoppingCart },
    { title: 'Reviews', href: '/dashboard/reviews', icon: Star },
    { title: 'Consultations', href: '/dashboard/consultations', icon: MessageSquare },
];

const contentItems: NavItem[] = [
    { title: 'Blogs', href: '/dashboard/blogs', icon: FileText },
    { title: 'Stores', href: '/dashboard/stores', icon: MapPin },
];

const footerNavItems: NavItem[] = [
    { title: 'Repository', href: 'https://github.com/laravel/react-starter-kit', icon: FolderGit2 },
    { title: 'Documentation', href: 'https://laravel.com/docs/starter-kits#react', icon: BookOpen },
];

function NavGroup({ label, items }: { label: string; items: NavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarGroup className="px-3 py-0">
            <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60 mb-1">
                {label}
            </SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={isCurrentUrl(item.href)}
                            tooltip={{ children: item.title }}
                            className="rounded-xl h-10 px-3 transition-all duration-300 data-[active=true]:bg-indigo-600 data-[active=true]:text-white data-[active=true]:font-bold data-[active=true]:shadow-lg data-[active=true]:shadow-indigo-500/25 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon className="!h-4 !w-4" />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset" className="border-r-0 bg-transparent">
            <SidebarHeader className="pb-4 pt-4 px-6">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-transparent">
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="gap-2">
                <NavGroup label="Overview" items={overviewItems} />
                <NavGroup label="Catalog" items={catalogItems} />
                <NavGroup label="Sales & Support" items={salesItems} />
                <NavGroup label="Content" items={contentItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

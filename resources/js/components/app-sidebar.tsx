import { Link } from '@inertiajs/react';
import {
    LayoutGrid, Tag, Package, Award, ShoppingCart, FileText,
    MapPin, MessageSquare, Star, BookOpen, FolderGit2,
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
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

type ColoredNavItem = NavItem & { color: string };

const overviewItems: ColoredNavItem[] = [
    { title: 'Dashboard', href: dashboard(), icon: LayoutGrid, color: 'bg-indigo-500' },
];

const catalogItems: ColoredNavItem[] = [
    { title: 'Categories', href: '/dashboard/categories', icon: Tag, color: 'bg-blue-500' },
    { title: 'Brands', href: '/dashboard/brands', icon: Award, color: 'bg-violet-500' },
    { title: 'Products', href: '/dashboard/products', icon: Package, color: 'bg-emerald-500' },
];

const salesItems: ColoredNavItem[] = [
    { title: 'Orders', href: '/dashboard/orders', icon: ShoppingCart, color: 'bg-amber-500' },
    { title: 'Reviews', href: '/dashboard/reviews', icon: Star, color: 'bg-yellow-500' },
    { title: 'Consultations', href: '/dashboard/consultations', icon: MessageSquare, color: 'bg-pink-500' },
];

const contentItems: ColoredNavItem[] = [
    { title: 'Blogs', href: '/dashboard/blogs', icon: FileText, color: 'bg-purple-500' },
    { title: 'Stores', href: '/dashboard/stores', icon: MapPin, color: 'bg-orange-500' },
];

const footerNavItems: NavItem[] = [
    { title: 'Repository', href: 'https://github.com/laravel/react-starter-kit', icon: FolderGit2 },
    { title: 'Documentation', href: 'https://laravel.com/docs/starter-kits#react', icon: BookOpen },
];

function NavGroup({ label, items }: { label: string; items: ColoredNavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarGroup className="px-3 py-0">
            <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400/70 dark:text-zinc-600 mb-1.5 px-3">
                {label}
            </SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const active = isCurrentUrl(item.href);

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={active}
                                tooltip={{ children: item.title }}
                                className={`
                                    rounded-xl h-10 px-3 transition-all duration-200 font-medium
                                    ${active
                                        ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:from-indigo-600 hover:to-blue-600'
                                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-100'
                                    }
                                `}
                            >
                                <Link href={item.href} prefetch className="flex items-center gap-3">
                                    {!active && <span className={`h-2 w-2 rounded-full ${item.color} shrink-0`} />}
                                    {item.icon && <item.icon className={`!h-4 !w-4 ${active ? '' : 'opacity-70'}`} />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader className="pb-4 pt-4">
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

            <SidebarContent className="gap-3">
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

import * as React from 'react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    return (
        <header className="flex h-[4.5rem] shrink-0 items-center gap-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-8 sticky top-0 z-10">
            <div className="flex items-center gap-4">
                <SidebarTrigger className="hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors h-10 w-10" />
                <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
        </header>
    );
}

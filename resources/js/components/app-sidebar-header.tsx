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
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md px-6 sticky top-0 z-10 transition-all duration-300 md:px-4 shadow-sm shadow-zinc-100/20 dark:shadow-black/20">
            <div className="flex items-center gap-3">
                <SidebarTrigger className="-ml-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors h-9 w-9" />
                <div className="h-4 w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-1 hidden sm:block" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
        </header>
    );
}

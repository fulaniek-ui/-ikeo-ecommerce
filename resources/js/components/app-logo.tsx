import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-amber-500 text-white">
                <AppLogoIcon className="size-5 fill-current" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-bold tracking-wide">
                    IKEO
                </span>
                <span className="truncate text-[10px] leading-none text-muted-foreground">
                    Admin Panel
                </span>
            </div>
        </>
    );
}

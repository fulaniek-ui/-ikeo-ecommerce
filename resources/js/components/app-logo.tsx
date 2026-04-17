export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-10 items-center justify-center rounded-xl overflow-hidden bg-gradient-to-br from-[#0058a3] to-[#003d82] shadow-md">
                <span className="text-[#ffdb00] font-black text-xl">I</span>
            </div>
            <div className="ml-1.5 grid flex-1 text-left">
                <span className="truncate leading-tight font-black tracking-[0.15em] text-lg text-[#0058A3] dark:text-[#FFDA1A]">
                    IKEO
                </span>
                <span className="truncate text-[11px] leading-none text-muted-foreground font-medium">
                    Admin Panel
                </span>
            </div>
        </>
    );
}

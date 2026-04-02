import { Link, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';
import { Armchair, Lamp, Sofa } from 'lucide-react';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props;

    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            {/* Left Panel - IKEO Branding */}
            <div className="relative hidden h-full flex-col justify-between overflow-hidden bg-[#0058A3] p-10 text-white lg:flex">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-10 rotate-12">
                        <Sofa className="h-32 w-32" />
                    </div>
                    <div className="absolute top-1/3 right-16 -rotate-12">
                        <Lamp className="h-24 w-24" />
                    </div>
                    <div className="absolute bottom-32 left-1/4 rotate-6">
                        <Armchair className="h-28 w-28" />
                    </div>
                </div>

                {/* Logo */}
                <Link
                    href={home()}
                    className="relative z-20 flex items-center gap-3"
                >
                    <AppLogoIcon className="size-10" />
                    <span className="text-2xl font-extrabold tracking-widest text-[#FFDA1A]">
                        IKEO
                    </span>
                </Link>

                {/* Center content */}
                <div className="relative z-20 space-y-6">
                    <h2 className="text-4xl font-bold leading-tight">
                        Furnish your world,
                        <br />
                        <span className="text-[#FFDA1A]">your way.</span>
                    </h2>
                    <p className="max-w-md text-lg text-blue-100">
                        Manage your furniture store with ease. Track products, orders, and customers all in one place.
                    </p>
                    <div className="flex gap-8 pt-4">
                        <div>
                            <p className="text-3xl font-bold text-[#FFDA1A]">500+</p>
                            <p className="text-sm text-blue-200">Products</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-[#FFDA1A]">50+</p>
                            <p className="text-sm text-blue-200">Categories</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-[#FFDA1A]">10K+</p>
                            <p className="text-sm text-blue-200">Customers</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="relative z-20">
                    <p className="text-sm text-blue-200">
                        &copy; {new Date().getFullYear()} IKEO. Affordable furniture for everyone.
                    </p>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="w-full lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[380px]">
                    <Link
                        href={home()}
                        className="relative z-20 flex items-center justify-center gap-2 lg:hidden"
                    >
                        <AppLogoIcon className="size-12" />
                        <span className="text-2xl font-extrabold tracking-widest text-[#0058A3] dark:text-[#FFDA1A]">
                            IKEO
                        </span>
                    </Link>
                    <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-2xl font-bold">{title}</h1>
                        <p className="text-sm text-balance text-muted-foreground">
                            {description}
                        </p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}

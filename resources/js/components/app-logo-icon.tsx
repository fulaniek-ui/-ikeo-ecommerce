import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="none">
            {/* Blue rounded square background */}
            <rect width="48" height="48" rx="10" fill="#0058A3" />
            {/* House/home icon in yellow */}
            <path
                d="M24 12L10 23h4v13h8v-8h4v8h8V23h4L24 12z"
                fill="#FFDA1A"
            />
            {/* Door */}
            <rect x="21" y="28" width="6" height="8" rx="1" fill="#0058A3" />
        </svg>
    );
}

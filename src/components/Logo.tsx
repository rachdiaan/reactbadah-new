import React from 'react';

interface LogoProps {
    className?: string;
    variant?: 'full' | 'icon';
}

const Logo: React.FC<LogoProps> = ({ className = '', variant = 'full' }) => {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            {/* SVG mark */}
            <svg
                width="36" height="36"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0"
                aria-hidden="true"
            >
                {/* Outer octagram (Rub el Hizb inspired) */}
                <path
                    d="M18 1L22.3 6.3H29.7L29.7 13.7L35 18L29.7 22.3V29.7H22.3L18 35L13.7 29.7H6.3L6.3 22.3L1 18L6.3 13.7V6.3L13.7 6.3L18 1Z"
                    fill="currentColor"
                    className="text-primary opacity-10"
                />

                {/* Middle ring */}
                <circle cx="18" cy="18" r="11"
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-primary opacity-20"
                    strokeDasharray="2 3"
                />

                {/* Arch / Mihrab */}
                <path
                    d="M11 26V16.5C11 12.91 14.13 10 18 10C21.87 10 25 12.91 25 16.5V26"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    className="text-primary"
                    opacity="0.85"
                />

                {/* Glowing orb (sun) */}
                <circle cx="18" cy="17" r="3" fill="#E8C547" opacity="0.95" />
                <circle cx="18" cy="17" r="5" fill="#E8C547" opacity="0.20" />

                {/* Base line */}
                <path
                    d="M13 29.5H23"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="text-primary"
                    opacity="0.55"
                />
            </svg>

            {variant === 'full' && (
                <div className="flex flex-col leading-none">
                    <span className="font-bold text-lg text-[var(--text-main)] tracking-tight">
                        Ibadah
                    </span>
                    <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-[0.18em]">
                        Checkpoint
                    </span>
                </div>
            )}
        </div>
    );
};

export default Logo;

import React from 'react';

interface LogoProps {
    className?: string;
    variant?: 'full' | 'icon';
}

const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10", variant = 'full' }) => {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            {/* Symbol */}
            <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 text-primary flex-shrink-0"
            >
                {/* 1. Base Geometry: Rub el Hizb (8-pointed star shape concept) simplified to a modern octagonal feel */}
                <path
                    d="M20 0L25.8579 5.85786L34.1421 5.85786L34.1421 14.1421L40 20L34.1421 25.8579L34.1421 34.1421L25.8579 34.1421L20 40L14.1421 34.1421L5.85786 34.1421L5.85786 25.8579L0 20L5.85786 14.1421L5.85786 5.85786L14.1421 5.85786L20 0Z"
                    className="opacity-10 fill-current"
                />

                {/* 2. Central Arch (Mihrab/Book) */}
                <path
                    d="M12 28V16C12 11.5817 15.5817 8 20 8C24.4183 8 28 11.5817 28 16V28"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="opacity-80"
                />

                {/* 3. Sun/Moon Elements */}
                {/* Sun Position (Morning Dzikir) - Top Center of Arch */}
                <circle cx="20" cy="18" r="3" className="fill-accent animate-pulse" />

                {/* Moon Crescent (Evening Dzikir) - Subtle overlap or curvature at bottom */}
                <path
                    d="M15 32C15 32 17 34 20 34C23 34 25 32 25 32"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="opacity-60"
                />
            </svg>

            {/* Text Lockup (Only show if full variant) */}
            {variant === 'full' && (
                <div className="flex flex-col">
                    <h1 className="font-sans text-xl font-bold text-gray-800 dark:text-white leading-none tracking-tight">
                        Ibadah Checkpoint
                    </h1>
                </div>
            )}
        </div>
    );
};

export default Logo;

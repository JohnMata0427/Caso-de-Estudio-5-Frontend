'use client';

type Color = 'sky' | 'neutral' | 'white' | 'primary' | 'red';
type TypeButton = 'submit' | 'button' | 'reset';

export default function CustomButton({
    color = 'sky',
    loading,
    type = 'button',
    className,
    text,
    onClick,
}: Readonly<{
    color?: Color;
    loading?: boolean;
    type?: TypeButton;
    className?: string;
    text?: string;
    onClick?: () => void;
}>) {
    const buttonColorsClass: Record<Color, [string, string]> = {
        sky: [
            'border-sky-700 bg-sky-700 hover:text-sky-700 text-white before:bg-white hover:shadow-white',
            'group-hover:text-sky-700',
        ],
        neutral: [
            'border-neutral-700 bg-neutral-700 hover:text-neutral-700 text-white before:bg-white hover:shadow-white',
            'group-hover:text-neutral-700',
        ],
        white: [
            'border-white bg-white hover:text-white text-primary before:bg-primary hover:shadow-primary',
            'group-hover:text-white',
        ],
        primary: [
            'border-primary bg-primary hover:text-primary text-white before:bg-white hover:shadow-white',
            'group-hover:text-primary',
        ],
        red: [
            'border-red-500 bg-red-500 hover:text-red-500 text-white before:bg-white hover:shadow-white',
            'group-hover:text-red-500',
        ],
    };

    return (
        <button
            type={type}
            className={`group relative flex h-9 items-center overflow-hidden rounded-md border px-3 font-medium shadow-2xl transition-all before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:transition-all before:duration-500 hover:before:left-0 hover:before:w-full ${buttonColorsClass[color][0]} mt-4 justify-center ${className}`}
            onClick={onClick}
        >
            {loading ? (
                <svg
                    className={`size-5 animate-spin text-white ${buttonColorsClass[color][1]}`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                </svg>
            ) : (
                <span className="relative z-10">{text}</span>
            )}
        </button>
    );
}

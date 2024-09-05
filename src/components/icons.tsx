export function DeleteIcon({ onClick }: Readonly<{ onClick?: () => void }>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="size-8 cursor-pointer stroke-red-500 transition-all hover:scale-105 hover:stroke-red-700"
            onClick={onClick}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 12v5m4-5v5M4 7h16M6 10v8a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3v-8M9 5c0-1.1.9-2 2-2h2a2 2 0 0 1 2 2v2H9V5Z"
            />
        </svg>
    );
}

export function EditIcon({ onClick }: Readonly<{ onClick?: () => void }>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="group size-7 cursor-pointer transition-all hover:scale-105"
            onClick={onClick}
        >
            <path
                className="fill-sky-700 group-hover:fill-sky-900"
                fillRule="evenodd"
                d="M21.1 2.7a3 3 0 0 0-4.2 0l-1.7 1.7-8 7.9a1 1 0 0 0-.2.5l-1 4A1 1 0 0 0 7.2 18l4-1c.2 0 .4-.2.5-.3L19.6 9l1.7-2a3 3 0 0 0 0-4.2l-.2-.2Zm-2.8 1.4a1 1 0 0 1 1.4 0l.2.2c.4.4.4 1 0 1.4l-1 1-1.6-1.6 1-1Zm-2.4 2.4 1.5 1.6-7 7-2 .5.5-2 7-7ZM4 8c0-.6.4-1 1-1h5a1 1 0 1 0 0-2H5a3 3 0 0 0-3 3v11a3 3 0 0 0 3 3h11a3 3 0 0 0 3-3v-5a1 1 0 0 0-2 0v5c0 .6-.4 1-1 1H5a1 1 0 0 1-1-1V8Z"
                clipRule="evenodd"
            />
        </svg>
    );
}

export function InfoIcon({ onClick }: Readonly<{ onClick?: () => void }>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="size-8 cursor-pointer stroke-neutral-700 transition-all hover:scale-105 hover:stroke-neutral-900"
            onClick={onClick}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 11v5m0 5a9 9 0 1 1 0-18 9 9 0 0 1 0 18Zm0-13v.1h0V8h0Z"
            />
        </svg>
    );
}

export function LoadingIcon({
    className = 'text-black',
}: Readonly<{ className?: string }>) {
    return (
        <svg
            className={`size-5 animate-spin ${className}`}
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
    );
}

type Color = 'sky' | 'neutral';

export default function CustomInput({
    color = 'sky',
    text,
    error,
    type,
    name,
    minLength,
    maxLength,
    value,
    onChange,
    className,
}: Readonly<{
    color?: Color;
    text: string;
    error: string;
    type: string;
    name: string;
    minLength?: number;
    maxLength?: number;
    value?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}>) {
    const inputColorsClass: Record<Color, [string, string]> = {
        sky: [
            'focus:border-sky-700 focus:text-sky-700',
            'peer-focus:text-sky-700',
        ],
        neutral: [
            'focus:border-neutral-700 focus:text-neutral-700',
            'peer-focus:text-neutral-700',
        ],
    };

    return (
        <div className="relative">
            <input
                type={type}
                id={name}
                name={name}
                minLength={minLength}
                maxLength={maxLength}
                value={value}
                onChange={onChange}
                className={`auto peer block w-full appearance-none rounded-lg rounded-t-lg border-0 border-b-2 border-neutral-700 bg-gray-50 p-2.5 pt-5 text-sm font-bold text-gray-900 invalid:border-red-500 invalid:text-red-500 focus:outline-none focus:ring-0 focus:invalid:border-red-500 focus:invalid:text-red-500 ${inputColorsClass[color][0]} ${className}`}
                placeholder=" "
            />
            <label
                className={`absolute start-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text select-none text-sm text-neutral-700 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-invalid:text-red-500 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:peer-invalid:text-red-500 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 ${inputColorsClass[color][1]}`}
                onClick={() => {
                    const input = document.getElementById(name);
                    if (input) input.focus();
                }}
            >
                {text}
            </label>
            <p className="mt-2 hidden text-xs text-red-500 peer-invalid:block">
                {error}
            </p>
        </div>
    );
}

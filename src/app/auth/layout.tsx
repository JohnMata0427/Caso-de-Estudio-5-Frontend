export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="flex min-h-screen w-screen p-4">
            <div className="hidden w-3/5 rounded-lg bg-[url('/auth-banner.webp')] bg-cover bg-center sm:block"></div>
            <div className="flex w-full flex-col items-center justify-center sm:w-2/5">
                {children}
            </div>
        </main>
    );
}

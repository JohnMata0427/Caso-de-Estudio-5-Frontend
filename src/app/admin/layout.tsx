'use client';
import CustomButton from '@/components/custombutton';
import { capitalize } from '@/helpers/helper';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

export default function Dashboard({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const router = useRouter();
    const [perfil, setPerfil] = useState({
        nombre: '',
        apellido: '',
        email: '',
    });
    const [authenticated, setAuthenticated] = useState(false);

    const paths = useMemo(
        () => ['conferencistas', 'auditorios', 'reservas'],
        [],
    );
    const activePath = usePathname().split('/')[2];

    useEffect(() => {
        const getProfile = async () => {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/perfil`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    },
                );
                setPerfil(response.data);
                setAuthenticated(true);
            } catch (error) {
                localStorage.removeItem('token');
            }
        };

        if (paths.includes(activePath)) getProfile();
    }, [activePath, paths]);

    if (!paths.includes(activePath)) return null;

    return (
        <>
            {authenticated && (
                <main className="flex min-h-screen flex-col bg-primary p-4 md:h-screen md:flex-row">
                    <header className="flex flex-col overflow-auto pb-4 md:h-screen md:w-1/5 md:gap-14 md:py-8 md:pl-8 md:pr-12">
                        <div className="flex items-start justify-center gap-8 md:min-h-40 md:flex-col md:items-center md:justify-start md:gap-2">
                            <Image
                                className="rounded-lg"
                                src="/profile.webp"
                                width={80}
                                height={80}
                                alt="logo"
                                priority
                            />
                            {perfil.nombre ? (
                                <div className="flex flex-col-reverse md:flex-col">
                                    <div className="flex items-center justify-center gap-x-2">
                                        <div className="size-2 rounded-full bg-emerald-500"></div>
                                        <span className="text-xs font-bold text-white">
                                            En línea
                                        </span>
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <h2 className="text-center font-bold text-white">
                                            {`Bienvenido ${perfil.nombre} ${perfil.apellido}`}
                                        </h2>
                                        <small className="text-center text-neutral-400">
                                            {perfil.email}
                                        </small>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-x-2">
                                    <div className="size-2 rounded-full bg-red-500"></div>
                                    <span className="text-xs font-bold text-white">
                                        Descconectado
                                    </span>
                                </div>
                            )}
                        </div>
                        <nav>
                            <ul className="flex flex-wrap items-center justify-center gap-x-4 md:flex-col md:flex-nowrap">
                                {paths.map((path) => (
                                    <Link key={path} href={`/admin/${path}`}>
                                        <CustomButton
                                            color={
                                                activePath === path
                                                    ? 'white'
                                                    : 'primary'
                                            }
                                            text={capitalize(path)}
                                            className="min-w-40 border-white"
                                        />
                                    </Link>
                                ))}
                            </ul>
                        </nav>
                        <div className="flex flex-row items-center justify-center gap-4 md:flex-col">
                            <CustomButton
                                color="sky"
                                text="Perfil"
                                onClick={() => {
                                    router.push('/admin/perfil');
                                }}
                                className="min-w-40"
                            />
                            <CustomButton
                                color="red"
                                text="Cerrar sesión"
                                onClick={() => {
                                    localStorage.removeItem('token');
                                    router.push('/auth/login');
                                }}
                                className="min-w-40"
                            />
                        </div>
                    </header>
                    <div className="min-h-3/4 relative flex flex-col items-center justify-center rounded-lg bg-white p-4 md:h-full md:w-4/5 md:overflow-auto">
                        {children}
                    </div>
                </main>
            )}
        </>
    );
}

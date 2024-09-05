'use client';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
    const [perfil, setPerfil] = useState({
        nombre: '',
        apellido: '',
        email: '',
    });

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
            } catch (error) {
                localStorage.removeItem('token');
            }
        };

        getProfile();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <img
                className="rounded-lg"
                src="/profile.webp"
                width={80}
                height={80}
                alt="logo"
            />
            <h1>{perfil.nombre}</h1>
            <h2>{perfil.apellido}</h2>
            <h3>{perfil.email}</h3>
        </div>
    );
}

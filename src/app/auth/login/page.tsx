'use client';

import CustomButton from '@/components/custombutton';
import CustomInput from '@/components/custoninput';
import axios from 'axios';
import { useState } from 'react';

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/login`,
                form,
            );
            localStorage.setItem('token', data.token);
            window.location.href = '/admin/conferencistas';
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <form className="flex w-3/4 flex-col gap-y-4" onSubmit={handleSubmit}>
            <h1 className="bg-gradient-to-r from-sky-700 to-sky-500 bg-clip-text text-center text-3xl font-extrabold text-transparent">
                Iniciar Sesión
            </h1>
            <small className="text-center">
                Ingrese su correo electrónico y contraseña para iniciar sesión
            </small>
            <CustomInput
                text="Correo Electrónico"
                error="Ingrese un correo electrónico válido"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
            />
            <CustomInput
                text="Contraseña"
                error="La contraseña debe tener al menos 8 caracteres"
                type="password"
                name="password"
                minLength={8}
                value={form.password}
                onChange={handleChange}
            />
            <CustomButton
                color="neutral"
                loading={loading}
                type="submit"
                text="Ingresar"
            />
        </form>
    );
}

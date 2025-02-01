'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import CustomButton from '@/components/custombutton';
import CustomInput from '@/components/custoninput';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { token } = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        },
      ).then((res) => res.json());

      localStorage.setItem('token', token);
      router.push('/admin/conferencistas');
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [target.name]: target.value,
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

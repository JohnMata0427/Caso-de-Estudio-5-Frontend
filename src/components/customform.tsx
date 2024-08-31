'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import CustomInput from './custoninput';
import CustomButton from './custombutton';
import axios from 'axios';
import { EditIcon } from './icons';

type Params = 'conferencistas' | 'auditorios' | 'reservas';

export default function CustomForm({ data = {} }: Readonly<{ data?: any }>) {
    const formOf = useParams<{ ofGroup: Params }>().ofGroup;

    const fields: Record<Params, Record<string, string>> = {
        conferencistas: {
            nombre: 'text',
            apellido: 'text',
            cedula: 'text',
            genero: 'select',
            ciudad: 'text',
            direccion: 'text',
            fecha_nacimiento: 'date',
            telefono: 'text',
            email: 'email',
            empresa: 'text',
        },
        auditorios: {
            codigo: 'text',
            nombre: 'text',
            ubicacion: 'text',
            capacidad: 'number',
            descripcion: 'text',
        },
        reservas: {
            codigo: 'text',
            descripcion: 'text',
            id_conferencista: 'select',
            id_auditorio: 'select',
        },
    };

    const [form, setForm] = useState({ ...data });
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (loading || !showModal) return;

        setLoading(true);
        try {
            data?.id
                ? await axios.put(
                      `${process.env.NEXT_PUBLIC_BACKEND_URL}/${formOf.slice(
                          0,
                          -1,
                      )}/${data?.id}`,
                      form,
                      {
                          headers: {
                              'Content-Type': 'application/json',
                              Authorization: `Bearer ${localStorage.getItem('token')}`,
                          },
                      },
                  )
                : await axios.post(
                      `${process.env.NEXT_PUBLIC_BACKEND_URL}/${formOf}`,
                      form,
                      {
                          headers: {
                              'Content-Type': 'application/json',
                              Authorization: `Bearer ${localStorage.getItem('token')}`,
                          },
                      },
                  );
            setShowModal(false);
            window.location.reload();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {data?.id ? (
                <EditIcon onClick={() => setShowModal(true)} />
            ) : (
                <CustomButton
                    color="sky"
                    onClick={() => setShowModal(true)}
                    text={data?.id ? 'Editar' : 'Añadir un nuevo registro'}
                    className="text-sm"
                />
            )}
            {showModal && (
                <div className="absolute inset-0 z-20 m-auto grid place-content-center backdrop-blur-sm">
                    <form
                        className="z-10 m-4 flex max-h-96 flex-col gap-4 overflow-auto rounded-lg border-2 border-primary bg-white p-8 md:m-0 md:max-h-none"
                        onSubmit={handleSubmit}
                    >
                        <h2 className="text-center text-lg font-bold text-gray-900">
                            Registro de{' '}
                            {formOf.charAt(0).toUpperCase() + formOf.slice(1)}
                        </h2>
                        <div className="grid grid-cols-2 place-content-center gap-x-8 gap-y-2">
                            {Object.keys(fields[formOf]).map((field) => {
                                if (field === 'genero') {
                                    return (
                                        <select
                                            key={field}
                                            name={field}
                                            className="w-full appearance-none rounded-lg border-0 border-b-2 border-neutral-700 bg-gray-50 p-2.5 pt-5 text-sm font-bold text-gray-900 focus:outline-none focus:ring-0"
                                            onChange={(e) => {
                                                setForm({
                                                    ...form,
                                                    [field]: e.target.value,
                                                });
                                            }}
                                            value={form[field]}
                                        >
                                            <option value="">
                                                Seleccionar{' '}
                                                {field.charAt(0).toUpperCase() +
                                                    field.slice(1)}
                                            </option>
                                            <option value="Masculino">
                                                Masculino
                                            </option>
                                            <option value="Femenino">
                                                Femenino
                                            </option>
                                        </select>
                                    );
                                }
                                return (
                                    <CustomInput
                                        key={field}
                                        color="sky"
                                        text={
                                            !field.includes('_')
                                                ? field
                                                      .charAt(0)
                                                      .toUpperCase() +
                                                  field.slice(1)
                                                : field
                                                      .split('_')
                                                      .map(
                                                          (word) =>
                                                              word
                                                                  .charAt(0)
                                                                  .toUpperCase() +
                                                              word.slice(1),
                                                      )
                                                      .join(' ')
                                        }
                                        error="El campo es requerido"
                                        type={fields[formOf][field]}
                                        name={field}
                                        maxLength={
                                            field === 'cedula' ||
                                            field === 'telefono'
                                                ? 10
                                                : undefined
                                        }
                                        minLength={
                                            field === 'cedula' ||
                                            field === 'telefono'
                                                ? 10
                                                : undefined
                                        }
                                        onChange={handleChange}
                                        value={
                                            !field.includes('fecha')
                                                ? form[field]
                                                : form[field]?.split('T')[0]
                                        }
                                    />
                                );
                            })}
                        </div>
                        <div className="flex items-center justify-center gap-4">
                            <CustomButton
                                color="sky"
                                loading={loading}
                                type="submit"
                                text={data?.id ? "Actualizar" : "Registrar"}
								className="w-24"
                            />
                            <CustomButton
                                color="neutral"
                                onClick={() => setShowModal(false)}
                                text="Cancelar"
								className="w-24"
                            />
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}

'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { EditIcon } from './icons';
import {
  capitalize,
  separateAndCapitalize,
  singularize,
  type Params,
} from '@/helpers/helper';
import CustomInput from './custoninput';
import CustomButton from './custombutton';

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

  const [form, setForm] = useState(data);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleChange = ({
    target,
  }: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({
      ...form,
      [target.name]: target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading || !showModal) return;

    setLoading(true);
    try {
      const options = {
        method: data?.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(form),
      };
      const url = data?.id ? `${singularize(formOf)}/${data?.id}` : formOf;

      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${url}`, options);

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
            className="border-primary z-10 m-4 flex max-h-96 flex-col gap-4 overflow-auto rounded-lg border-2 bg-white p-8 md:m-0 md:max-h-none [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-track]:rounded-full"
            onSubmit={handleSubmit}
          >
            <h2 className="text-center text-lg font-bold text-gray-900">
              {`Registro de ${capitalize(formOf)}`}
            </h2>
            <div className="grid grid-cols-2 place-content-center gap-x-8 gap-y-2">
              {Object.keys(fields[formOf]).map((field) => {
                if (field === 'genero')
                  return (
                    <select
                      key={field}
                      name={field}
                      className="w-full appearance-none rounded-lg border-0 border-b-2 border-neutral-700 bg-gray-50 p-2.5 pt-5 text-sm font-bold text-gray-900 focus:ring-0 focus:outline-none"
                      onChange={handleChange}
                      value={form[field]}
                    >
                      <option>{`Seleccione el ${field}`}</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                    </select>
                  );
                return (
                  <CustomInput
                    key={field}
                    color="sky"
                    text={
                      !field.includes('_')
                        ? capitalize(field)
                        : separateAndCapitalize(field)
                    }
                    error="El campo es requerido"
                    type={fields[formOf][field]}
                    name={field}
                    maxLength={
                      field === 'cedula' || field === 'telefono'
                        ? 10
                        : undefined
                    }
                    minLength={
                      field === 'cedula' || field === 'telefono'
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
                text={data?.id ? 'Actualizar' : 'Registrar'}
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

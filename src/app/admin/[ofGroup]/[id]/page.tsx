'use client';

import { LoadingIcon } from '@/components/icons';
import {
  capitalize,
  separateAndCapitalize,
  singularize,
} from '@/helpers/helper';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import CustomTable from '@/components/customtable';
import Image from 'next/image';

export default function ViewRegister() {
  const { ofGroup, id } = useParams<{ ofGroup: string; id: string }>();
  const [data, setData] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/${singularize(ofGroup)}/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          },
        ).then((res) => res.json());

        delete response?.id_conferencista;
        delete response?.id_auditorio;
        setData(response);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [ofGroup, id]);

  return (
    <div className="flex size-full flex-col">
      {loading ? (
        <div className="m-auto flex items-center justify-center gap-x-2">
          <LoadingIcon />
          <p>Cargando datos...</p>
        </div>
      ) : data?.id ? (
        <div className="flex flex-col">
          <div className="h-56 w-full">
            <Image
              className="size-full rounded-lg object-cover"
              src="/conference-banner.webp"
              width={500}
              height={200}
              alt="Imagen de una conferencia"
              priority
            />
          </div>
          <div className="flex flex-col p-4">
            {Object.keys(data).map((key) => {
              if (key === 'id')
                return (
                  <h1 key={key} className="mb-4 text-center text-lg font-bold">
                    {`Registro de${ofGroup !== 'reservas' ? `l ${singularize(ofGroup)}` : ' la reserva'} con ID: ${data?.id}`}
                  </h1>
                );

              if (typeof data[key] === 'object')
                return (
                  <div className="flex flex-col" key={key}>
                    <h2 className="mt-2 text-center text-lg font-bold">
                      {capitalize(key) + (ofGroup !== 'reservas' && 's')}
                    </h2>
                    <CustomTable
                      readOnly
                      initData={
                        ofGroup === 'reservas' ? [data[key]] : data[key]
                      }
                      table={key.toLowerCase() + 's'}
                    />
                  </div>
                );

              return (
                <p key={key}>
                  <strong>
                    {!key.includes('_')
                      ? capitalize(key)
                      : separateAndCapitalize(key)}
                  </strong>
                  : {data[key]}
                </p>
              );
            })}
          </div>
        </div>
      ) : (
        <p> No existe el registro solicitado </p>
      )}
    </div>
  );
}

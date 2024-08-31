'use client';
import CustomTable from '@/components/customtable';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ViewRegister() {
    const { ofGroup, id } = useParams<{ ofGroup: string; id: string }>();
    const [data, setData] = useState<{ [key: string]: string }>({
        id: '',
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/${ofGroup.slice(
                0,
                -1,
            )}/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            },
        )
            .then((response) => response.json())
            .then((data) => {
                delete data?.id_conferencista;
                delete data?.id_auditorio;
                setData(data);
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }, [ofGroup, id]);

    return (
        <div className="flex size-full flex-col">
            {loading ? (
                <div className="m-auto flex items-center justify-center gap-x-2">
                    <svg
                        className="size-5 animate-spin text-black"
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
                            if (key === 'id') {
                                return <h1 key={key} className="mb-4 text-center text-lg font-bold">
                                Registro de
                                {ofGroup !== 'reservas'
                                    ? `l ${ofGroup.slice(0, -1)}`
                                    : ' la reserva'}{' con ID: '}
                                {data?.id}
                            </h1>
                            }

                            if (typeof data[key] === 'object') {
                                return (
                                    <div className="flex flex-col" key={key}>
                                        <h2 className="mt-2 text-center text-lg font-bold">
                                            {key.charAt(0).toUpperCase() +
                                                key.slice(1) +
                                                (ofGroup === 'reservas'
                                                    ? ''
                                                    : 's')}
                                        </h2>
                                        <CustomTable
                                            readOnly
                                            initData={
                                                ofGroup === 'reservas'
                                                    ? [data[key]]
                                                    : data[key]
                                            }
                                            table={
                                                key.toLocaleLowerCase() + 's'
                                            }
                                        />
                                    </div>
                                );
                            }

                            return (
                                <p key={key}>
                                    <strong>
                                        {!key.includes('_')
                                            ? key.charAt(0).toUpperCase() +
                                              key.slice(1)
                                            : key
                                                  .split('_')
                                                  .map(
                                                      (k) =>
                                                          k[0].toUpperCase() +
                                                          k.slice(1),
                                                  )
                                                  .join(' ')}
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

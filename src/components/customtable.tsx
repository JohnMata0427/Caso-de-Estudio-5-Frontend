'use client';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import CustomInput from '@/components/custoninput';
import axios from 'axios';
import CustomForm from '@/components/customform';
import { DeleteIcon, InfoIcon } from '@/components/icons';

type Params = 'conferencistas' | 'auditorios' | 'reservas';

export default function CustomTable({
    initData = [],
    readOnly = false,
    table,
}: Readonly<{ initData?: any[]; readOnly?: boolean; table?: string }>) {
    const { ofGroup } = useParams<{ ofGroup: Params }>();
    const tableOf = table || ofGroup;

    const [data, setData] = useState([...initData]);
    const [reload, setReload] = useState(false);
    const [columns, setColumns] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    const handleDelete = async (id: number) => {
        if (!confirm('¿Está seguro de eliminar este registro?')) return;

        try {
            await axios.delete(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/${tableOf.slice(0, -1)}/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                },
            );
            setReload(!reload);
        } catch (error) {
            console.error(error);
        }
    };

    const getData = useCallback(async () => {
        if (initData.length > 0) {
            setData(initData);
            const columnsWithoutIDS = Object.keys(initData[0]).filter(
                (column) => !column.includes('id'),
            );
            setColumns([...columnsWithoutIDS, 'Más información']);
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/${tableOf}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                },
            );
            setData(response.data);
            const columnsWithoutIDS = Object.keys(response.data[0]).filter(
                (column) => !column.includes('id'),
            );
            setColumns([...columnsWithoutIDS, 'Acciones']);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getData();
    }, [getData, initData, tableOf, reload]);


    return (
        <div className={`${!readOnly && 'w-4/5'}`}>
            {!readOnly && (
                <>
                    <h1 className="my-2 text-center text-xl font-bold">
                        Consulta de {tableOf}
                    </h1>
                    <header className="flex flex-col-reverse items-center gap-y-2 md:flex-row md:justify-between">
                        <div className="relative">
                            <CustomInput
                                color="neutral"
                                text={`Buscar ${tableOf}`}
                                error=""
                                type="text"
                                name="search"
                                onChange={({ target }) => {
                                    const search = target.value.toLowerCase();

                                    if (search === '')
                                        return setReload(!reload);

                                    const filteredData = data.filter((row) =>
                                        Object.values(row).some((value) =>
                                            String(value)
                                                .toLowerCase()
                                                .includes(search),
                                        ),
                                    );
                                    setData(filteredData);
                                }}
                                className="pr-8"
                            />
                            <svg
                                className="absolute bottom-3 right-2 size-5 stroke-primary"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M11 6a5 5 0 0 1 5 5m.7 5.7L21 21m-2-10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
                                />
                            </svg>
                        </div>
                        <CustomForm />
                    </header>
                </>
            )}
            <div className="mt-4 flex max-h-96 min-h-24 overflow-auto">
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
                ) : data.length === 0 ? (
                    <p className="m-auto text-center">No existen registros</p>
                ) : (
                    <table className="w-full table-auto border-collapse text-sm">
                        <thead className="bg-primary text-white">
                            <tr>
                                {columns.map((column) => (
                                    <th
                                        key={column}
                                        className="text-nowrap border border-primary px-4 py-1"
                                    >
                                        {!column.includes('_')
                                            ? column.charAt(0).toUpperCase() +
                                              column.slice(1)
                                            : column
                                                  .split('_')
                                                  .map(
                                                      (word) =>
                                                          word
                                                              .charAt(0)
                                                              .toUpperCase() +
                                                          word.slice(1),
                                                  )
                                                  .join(' ')}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, index) => (
                                <tr key={index}>
                                    {columns.map((column) => {
                                        if (column === 'Acciones') {
                                            return (
                                                <td
                                                    key={column}
                                                    className="border border-primary px-4 py-1 text-center"
                                                >
                                                    <div className="flex items-center justify-center gap-x-2">
                                                        <InfoIcon
                                                            onClick={() => {
                                                                window.location.href =
                                                                    '/admin/' +
                                                                    tableOf +
                                                                    '/' +
                                                                    row['id'];
                                                            }}
                                                        />
                                                        <CustomForm
                                                            data={row}
                                                        />
                                                        <DeleteIcon
                                                            onClick={() =>
                                                                handleDelete(
                                                                    row['id'],
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </td>
                                            );
                                        }

                                        if (column === 'Más información') {
                                            return (
                                                <td
                                                    key={column}
                                                    className="border border-primary px-4 py-1 text-center"
                                                >
                                                    <div className="grid place-content-center">
                                                        <InfoIcon
                                                            onClick={() => {
                                                                window.location.href =
                                                                    '/admin/' +
                                                                    tableOf +
                                                                    '/' +
                                                                    row['id'];
                                                            }}
                                                        />
                                                    </div>
                                                </td>
                                            );
                                        }

                                        return (
                                            <td
                                                key={column}
                                                className="text-nowrap border border-primary px-4 py-1 text-center"
                                            >
                                                {!column.includes('fecha')
                                                    ? row[column]
                                                    : (
                                                          row[column] as string
                                                      ).split('T')[0]}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

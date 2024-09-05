'use client';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import CustomInput from '@/components/custoninput';
import axios from 'axios';
import CustomForm from '@/components/customform';
import { DeleteIcon, InfoIcon, LoadingIcon } from '@/components/icons';
import {
    capitalize,
    separateAndCapitalize,
    singularize,
    type Params,
} from '@/helpers/helper';

export default function CustomTable({
    initData = [],
    readOnly = false,
    table,
}: Readonly<{ initData?: any[]; readOnly?: boolean; table?: string }>) {
    const router = useRouter();

    const { ofGroup } = useParams<{ ofGroup: Params }>();
    const tableOf = table || ofGroup;

    const [data, setData] = useState([...initData]);
    const [columns, setColumns] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    const columnsWithoutIDS = (data: any[]) =>
        Object.keys(data).filter((column) => !column.includes('id'));

    const handleChangeSearch = ({
        target,
    }: React.ChangeEvent<HTMLInputElement>) => {
        const search = target.value.toLowerCase();

        if (search === '') return getData();

        const filteredData = data.filter((row) =>
            Object.values(row).some((value) =>
                String(value).toLowerCase().includes(search),
            ),
        );
        setData(filteredData);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Está seguro de eliminar este registro?')) return;

        try {
            await axios.delete(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/${singularize(tableOf)}/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                },
            );
            setData(data.filter((row) => row.id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    const getData = useCallback(async () => {
        if (initData.length > 0) {
            setColumns([...columnsWithoutIDS(initData[0]), 'Acciones']);
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
            setColumns([...columnsWithoutIDS(response.data[0]), 'Acciones']);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [initData, tableOf]);

    useEffect(() => {
        getData();
    }, []);

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
                                onChange={handleChangeSearch}
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
                        <LoadingIcon />
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
                                            ? capitalize(column)
                                            : separateAndCapitalize(column)}
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
                                                                router.push(
                                                                    `/admin/${tableOf}/${row.id}`,
                                                                );
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
                                                                router.push(
                                                                    `/admin/${tableOf}/${row.id}`,
                                                                );
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

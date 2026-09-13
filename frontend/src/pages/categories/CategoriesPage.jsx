import { useCallback, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AllCommunityModule, ModuleRegistry, themeQuartz } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useNavigate } from 'react-router-dom'
import { Buttons, Card, InputForm } from '../../components/index.js'
import {
    destroy,
    list as list,
} from '../../services/categories-service.js'

ModuleRegistry.registerModules([AllCommunityModule])

const categoriesQueryKey = ['categories', 'list']

const gridTheme = themeQuartz.withParams({
    accentColor: '#0284c7',
    borderColor: '#e2e8f0',
    headerBackgroundColor: '#f1f5f9',
    headerTextColor: '#334155',
    wrapperBorderRadius: 0,
})

const typeLabels = {
    income: 'Receita',
    expense: 'Despesa',
}

const statusLabels = {
    active: 'Ativa',
    inactive: 'Inativa',
}

function getErrorMessage(error) {
    return error?.response?.data?.message ?? error?.message
}

async function fetchCategories(signal) {
    const { data: response } = await list({ signal })
    const categories = Array.isArray(response) ? response : response?.data

    return Array.isArray(categories) ? categories : []
}

function CategoriesPage() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [search, setSearch] = useState('')

    const categoriesQuery = useQuery({
        queryKey: categoriesQueryKey,
        queryFn: ({ signal }) => fetchCategories(signal),
    })

    const deleteMutation = useMutation({
        mutationFn: destroy,
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: categoriesQueryKey }),
    })

    const handleDelete = useCallback(
        (category) => {
            if (!window.confirm(`Deseja excluir a categoria “${category.name}”?`)) {
                return
            }

            deleteMutation.reset()
            deleteMutation.mutate(category.id)
        },
        [deleteMutation],
    )

    const columnDefs = useMemo(
        () => [
            {
                field: 'name',
                headerName: 'Nome',
                flex: 1,
                minWidth: 180,
            },
            {
                field: 'type',
                headerName: 'Tipo',
                width: 130,
                valueFormatter: ({ value }) => typeLabels[value] ?? value,
            },
            {
                field: 'description',
                headerName: 'Descrição',
                flex: 1.5,
                minWidth: 240,
            },
            {
                field: 'status',
                headerName: 'Situação',
                width: 125,
                valueFormatter: ({ value }) => statusLabels[value] ?? value,
            },
            {
                headerName: 'Ações',
                width: 205,
                sortable: false,
                cellRenderer: ({ data }) => {
                    const isDeleting =
                        deleteMutation.isPending &&
                        deleteMutation.variables === data.id

                    return (
                        <div className="flex h-full items-center gap-2">
                            <Buttons
                                variant="warning"
                                className="min-h-8 px-3 py-1 text-xs"
                                onClick={() =>
                                    navigate(`/categories/${data.id}/edit`)
                                }
                            >
                                Editar
                            </Buttons>
                            <Buttons
                                variant="danger"
                                className="min-h-8 px-3 py-1 text-xs"
                                disabled={isDeleting}
                                onClick={() => handleDelete(data)}
                            >
                                {isDeleting ? 'Excluindo...' : 'Excluir'}
                            </Buttons>
                        </div>
                    )
                },
            },
        ],
        [deleteMutation.isPending, deleteMutation.variables, handleDelete, navigate],
    )

    const loadError = categoriesQuery.error? getErrorMessage(categoriesQuery.error): ''
    const operationError = deleteMutation.error? getErrorMessage(deleteMutation.error): ''

    return (
        <div className="mx-auto w-full space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Categorias
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Organize as categorias utilizadas nas suas transações.
                    </p>
                </div>

                <Buttons
                    variant="sucess"
                    onClick={() => navigate('/categories/new')}
                >
                    Nova categoria
                </Buttons>
            </div>

            <Card title="Lista de categorias" contentClassName="space-y-5 p-0">
                <div className="px-5 pt-5">
                    {(loadError || operationError) && (
                        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                            {loadError || operationError}
                        </p>
                    )}

                    <InputForm
                        label="Pesquisar categoria"
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        containerClassName="w-full"
                    />
                </div>

                <div className="w-full overflow-x-auto">
                    <div className="h-[calc(100vh-323px)] min-h-80 min-w-[760px]">
                        <AgGridReact
                            theme={gridTheme}
                            rowData={categoriesQuery.data ?? []}
                            columnDefs={columnDefs}
                            quickFilterText={search}
                            loading={categoriesQuery.isLoading}
                            domLayout="normal"
                            rowHeight={56}
                            pagination
                            paginationPageSize={10}
                            paginationPageSizeSelector={[10, 20, 50]}
                            defaultColDef={{
                                sortable: true,
                                filter: false,
                                resizable: true,
                            }}
                            getRowId={({ data }) => data.id}
                            overlayNoRowsTemplate="Nenhuma categoria encontrada"
                        />
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default CategoriesPage

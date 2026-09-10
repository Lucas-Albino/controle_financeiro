import { useMemo, useState } from 'react'
import { AllCommunityModule, ModuleRegistry, themeQuartz } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { Buttons, Card, InputForm } from '../../components/index.js'

ModuleRegistry.registerModules([AllCommunityModule])

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

function CategoriesPage() {
    const navigate = useNavigate()
    const { categories, deleteCategory } = useOutletContext()
    const [search, setSearch] = useState('')

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
                cellRenderer: ({ data }) => (
                    <div className="flex h-full items-center gap-2">
                        <Buttons
                            variant="warning"
                            className="min-h-8 px-3 py-1 text-xs"
                            onClick={() => navigate(`/categories/${data.id}/edit`)}
                        >
                            Editar
                        </Buttons>
                        <Buttons
                            variant="danger"
                            className="min-h-8 px-3 py-1 text-xs"
                            onClick={() => {
                                if (
                                    window.confirm(
                                        `Deseja excluir a categoria “${data.name}”?`,
                                    )
                                ) {
                                    deleteCategory(data.id)
                                }
                            }}
                        >
                            Excluir
                        </Buttons>
                    </div>
                ),
            },
        ],
        [deleteCategory, navigate],
    )

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
                            rowData={categories}
                            columnDefs={columnDefs}
                            quickFilterText={search}
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

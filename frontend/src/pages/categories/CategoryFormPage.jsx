import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import {
    Buttons,
    Card,
    InputForm,
    InputSelect,
    InputTextArea,
} from '../../components/index.js'
import {
    show as showCategory,
    store as storeCategory,
    update as updateCategory,
} from '../../services/categories-service.js'

const categoryListQueryKey = ['categories', 'list']

const emptyCategory = {
    name: '',
    type: 'expense',
    description: '',
    status: 'active',
}

function getErrorMessage(error) {
    return error?.response?.data?.message ?? error?.message
}

function getValidationErrors(error) {
    const validationErrors = error?.response?.data?.errors ?? {}

    return Object.fromEntries(
        Object.entries(validationErrors).map(([field, messages]) => [
            field,
            Array.isArray(messages) ? messages[0] : messages,
        ]),
    )
}

function normalizeCategory(category) {
    return {
        name: category?.name ?? emptyCategory.name,
        type: category?.type ?? emptyCategory.type,
        description: category?.description ?? emptyCategory.description,
        status: category?.status ?? emptyCategory.status,
    }
}

async function fetchCategory(categoryId, signal) {
    const { data: response } = await showCategory(categoryId, { signal })
    const category = response?.data ?? response

    if (!category || typeof category !== 'object') {
        return null
    }

    return normalizeCategory(category)
}

function CategoryForm({ category, categoryId }) {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const isEditing = Boolean(categoryId)
    const [form, setForm] = useState(() => normalizeCategory(category))
    const [errors, setErrors] = useState({})

    const saveMutation = useMutation({
        mutationFn: (categoryData) =>
            isEditing
                ? updateCategory(categoryId, categoryData)
                : storeCategory(categoryData),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: categoryListQueryKey,
            })
            navigate('/')
        },
    })

    const updateField = (field) => (event) => {
        const { value } = event.target
        setForm((currentForm) => ({ ...currentForm, [field]: value }))
        setErrors((currentErrors) => ({
            ...currentErrors,
            [field]: undefined,
            form: undefined,
        }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!form.name.trim()) {
            setErrors({ name: 'Informe o nome da categoria.' })
            return
        }

        setErrors({})

        try {
            await saveMutation.mutateAsync({
                ...form,
                name: form.name.trim(),
                description: form.description.trim(),
            })
        } catch (error) {
            const validationErrors = getValidationErrors(error)

            setErrors(
                Object.keys(validationErrors).length > 0
                    ? validationErrors
                    : { form: getErrorMessage(error) },
            )
        }
    }

    return (
        <div className="mx-auto w-full max-w-3xl">
            <Card title={isEditing ? 'Editar categoria' : 'Nova categoria'}>
                <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                    <InputForm
                        label="Nome"
                        name="name"
                        value={form.name}
                        onChange={updateField('name')}
                        error={errors.name}
                        autoFocus
                        required
                    />

                    <div className="grid gap-5 sm:grid-cols-2">
                        <InputSelect
                            label="Tipo"
                            name="type"
                            value={form.type}
                            onChange={updateField('type')}
                            error={errors.type}
                            options={[
                                { value: 'expense', label: 'Despesa' },
                                { value: 'income', label: 'Receita' },
                            ]}
                        />

                        <InputSelect
                            label="Situação"
                            name="status"
                            value={form.status}
                            onChange={updateField('status')}
                            error={errors.status}
                            options={[
                                { value: 'active', label: 'Ativa' },
                                { value: 'inactive', label: 'Inativa' },
                            ]}
                        />
                    </div>

                    <InputTextArea
                        label="Descrição"
                        name="description"
                        value={form.description}
                        onChange={updateField('description')}
                        error={errors.description}
                        rows={4}
                    />

                    {errors.form && (
                        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                            {errors.form}
                        </p>
                    )}

                    <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
                        <Buttons
                            variant="default"
                            disabled={saveMutation.isPending}
                            onClick={() => navigate('/')}
                        >
                            Cancelar
                        </Buttons>
                        <Buttons
                            variant="sucess"
                            type="submit"
                            disabled={saveMutation.isPending}
                        >
                            {saveMutation.isPending ? 'Enviando...' : 'Enviar'}
                        </Buttons>
                    </div>
                </form>
            </Card>
        </div>
    )
}

function CategoryFormPage() {
    const navigate = useNavigate()
    const { categoryId } = useParams()
    const isEditing = Boolean(categoryId)

    const categoryQuery = useQuery({
        queryKey: ['categories', 'show', categoryId],
        queryFn: ({ signal }) => fetchCategory(categoryId, signal),
        enabled: isEditing,
        retry: (failureCount, error) =>
            error?.response?.status !== 404 && failureCount < 2,
    })

    if (isEditing && categoryQuery.isLoading) {
        return (
            <Card title="Carregando categoria" className="mx-auto max-w-2xl">
                <p className="text-slate-600">
                    Aguarde enquanto os dados da categoria são carregados.
                </p>
            </Card>
        )
    }

    if (isEditing && categoryQuery.error) {
        const categoryNotFound = categoryQuery.error.response?.status === 404

        return (
            <Card
                title={
                    categoryNotFound
                        ? 'Categoria não encontrada'
                        : 'Erro ao carregar categoria'
                }
                className="mx-auto max-w-2xl"
            >
                <p className="mb-5 text-slate-600">
                    {categoryNotFound
                        ? 'A categoria informada não existe ou foi removida.'
                        : getErrorMessage(categoryQuery.error)}
                </p>
                <Buttons variant="default" onClick={() => navigate('/')}>
                    Voltar para a lista
                </Buttons>
            </Card>
        )
    }

    if (isEditing && !categoryQuery.data) {
        return (
            <Card title="Categoria não encontrada" className="mx-auto max-w-2xl">
                <p className="mb-5 text-slate-600">
                    A categoria informada não existe ou foi removida.
                </p>
                <Buttons variant="default" onClick={() => navigate('/')}>
                    Voltar para a lista
                </Buttons>
            </Card>
        )
    }

    return (
        <CategoryForm
            key={categoryId ?? 'new'}
            category={isEditing ? categoryQuery.data : emptyCategory}
            categoryId={categoryId}
        />
    )
}

export default CategoryFormPage

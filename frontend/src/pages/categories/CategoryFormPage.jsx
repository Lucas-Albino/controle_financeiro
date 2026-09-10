import { useState } from 'react'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import {
    Buttons,
    Card,
    InputForm,
    InputSelect,
    InputTextArea,
} from '../../components/index.js'

const emptyCategory = {
    name: '',
    type: 'expense',
    description: '',
    status: 'active',
}

function CategoryFormPage() {
    const navigate = useNavigate()
    const { categoryId } = useParams()
    const { categories, saveCategory } = useOutletContext()
    const category = categories.find((item) => item.id === categoryId)
    const isEditing = Boolean(categoryId)
    const [form, setForm] = useState(category ?? emptyCategory)
    const [errors, setErrors] = useState({})

    const updateField = (field) => (event) => {
        const { value } = event.target
        setForm((currentForm) => ({ ...currentForm, [field]: value }))
        setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }))
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        if (!form.name.trim()) {
            setErrors({ name: 'Informe o nome da categoria.' })
            return
        }

        saveCategory({
            ...form,
            name: form.name.trim(),
            description: form.description.trim(),
        })
        navigate('/')
    }

    if (isEditing && !category) {
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
                        rows={4}
                    />

                    <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
                        <Buttons variant="default" onClick={() => navigate('/')}>
                            Cancelar
                        </Buttons>
                        <Buttons variant="sucess" type="submit">
                            Enviar
                        </Buttons>
                    </div>
                </form>
            </Card>
        </div>
    )
}

export default CategoryFormPage

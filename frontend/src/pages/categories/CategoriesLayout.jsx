import { useCallback, useState } from 'react'
import { Outlet } from 'react-router-dom'

const initialCategories = [
    {
        id: '1',
        name: 'Salário',
        type: 'income',
        description: 'Receitas provenientes de salário',
        status: 'active',
    },
    {
        id: '2',
        name: 'Alimentação',
        type: 'expense',
        description: 'Mercado, restaurantes e delivery',
        status: 'active',
    },
    {
        id: '3',
        name: 'Transporte',
        type: 'expense',
        description: 'Combustível, transporte público e aplicativos',
        status: 'active',
    },
    {
        id: '4',
        name: 'Lazer',
        type: 'expense',
        description: 'Cinema, viagens e entretenimento',
        status: 'inactive',
    },
]

function CategoriesLayout() {
    const [categories, setCategories] = useState(initialCategories)

    const saveCategory = useCallback((category) => {
        setCategories((currentCategories) => {
            if (category.id) {
                return currentCategories.map((currentCategory) =>
                    currentCategory.id === category.id
                        ? category
                        : currentCategory,
                )
            }

            return [
                ...currentCategories,
                {
                    ...category,
                    id: crypto.randomUUID(),
                },
            ]
        })
    }, [])

    const deleteCategory = useCallback((categoryId) => {
        setCategories((currentCategories) =>
            currentCategories.filter((category) => category.id !== categoryId),
        )
    }, [])

    return (
        <Outlet context={{ categories, saveCategory, deleteCategory }} />
    )
}

export default CategoriesLayout

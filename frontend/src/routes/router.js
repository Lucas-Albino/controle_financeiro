import { createBrowserRouter } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout.jsx'
import CategoriesLayout from '../pages/categories/CategoriesLayout.jsx'
import CategoriesPage from '../pages/categories/CategoriesPage.jsx'
import CategoryFormPage from '../pages/categories/CategoryFormPage.jsx'
import NotFoundPage from '../pages/NotFoundPage.jsx'

export const router = createBrowserRouter(
    [
        {
            id: 'root',
            path: '/',
            Component: AppLayout,
            children: [
                {
                    Component: CategoriesLayout,
                    children: [
                        { id: 'categories', index: true, Component: CategoriesPage },
                        {
                            id: 'category-create',
                            path: 'categories/new',
                            Component: CategoryFormPage,
                        },
                        {
                            id: 'category-edit',
                            path: 'categories/:categoryId/edit',
                            Component: CategoryFormPage,
                        },
                        {
                            id: 'transactions',
                            path: 'transactions',
                            Component: CategoriesPage,
                        },
                        { id: 'not-found', path: '*', Component: NotFoundPage },
                    ],
                },
            ],
        },
    ],
    {
        basename: import.meta.env.BASE_URL,
    },
)

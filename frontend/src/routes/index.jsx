import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import CategoriesPage from '../pages/categories/CategoriesPage.jsx'

function NotFound() {
  return (
    <main>
      <h1>Página não encontrada</h1>
      <Link to="/">Voltar para o início</Link>
    </main>
  )
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CategoriesPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes

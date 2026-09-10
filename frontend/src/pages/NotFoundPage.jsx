import { Link } from 'react-router-dom'

function NotFoundPage() {
    return (
        <main>
            <h1>Página não encontrada</h1>
            <Link to="/">Voltar para o início</Link>
        </main>
    )
}

export default NotFoundPage

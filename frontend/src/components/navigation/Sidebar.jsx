import { NavLink } from 'react-router-dom'
import { navigationItems } from '../../config/navigation.js'

function Sidebar() {
    return (
        <aside className="min-h-screen w-60 bg-slate-900 px-4 py-6 text-slate-200 max-[720px]:min-h-auto max-[720px]:w-full">
            <div className="px-3 pb-6 text-lg font-bold text-white">
                Controle Financeiro
            </div>

            <nav aria-label="Navegação principal">
                <ul className="grid list-none gap-1.5 p-0 max-[720px]:grid-cols-[repeat(auto-fit,minmax(140px,1fr))]">
                    {navigationItems.map((item) => (
                        <li key={item.id}>
                            {item.to ? (
                                <NavLink
                                    className={({ isActive }) =>
                                        [
                                            'flex min-h-11 items-center justify-between rounded-lg px-3 py-2.5 text-slate-300 no-underline transition-colors hover:bg-slate-800 hover:text-white',
                                            isActive
                                                ? 'bg-slate-800 text-white shadow-[inset_3px_0_#38bdf8]'
                                                : '',
                                        ].join(' ')
                                    }
                                    end={item.to === '/'}
                                    to={item.to}
                                >
                                    {item.label}
                                </NavLink>
                            ) : (
                                <span
                                    aria-disabled="true"
                                    className="flex min-h-11 cursor-not-allowed items-center justify-between rounded-lg px-3 py-2.5 text-slate-500"
                                    title="Página ainda não disponível"
                                >
                                    {item.label}
                                    <small className="text-[0.7rem] uppercase">
                                        Em breve
                                    </small>
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    )
}

export default Sidebar

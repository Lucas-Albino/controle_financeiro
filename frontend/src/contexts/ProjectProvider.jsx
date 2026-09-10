import { useMemo } from 'react'
import { ProjectContext } from './ProjectContext.js'

export function ProjectProvider({ children }) {
    const project = useMemo(
        () => ({
            apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api',
        }),
        [],
    )

    return (
        <ProjectContext.Provider value={project}>
            {children}
        </ProjectContext.Provider>
    )
}

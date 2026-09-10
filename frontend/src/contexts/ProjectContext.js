import { createContext, useContext } from 'react'

export const ProjectContext = createContext(null)

export function useProject() {
    const context = useContext(ProjectContext)

    if (context === null) {
        throw new Error('useProject deve ser usado dentro de ProjectContext.Provider')
    }

    return context
}

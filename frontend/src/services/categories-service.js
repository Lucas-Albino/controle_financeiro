import { apiClient } from './api-client.js'

const resource = '/categories'

export function list(config = {}) {
    return apiClient.get(resource, config)
}

export function store(category) {
    return apiClient.post(resource, category)
}

export function show(categoryId, config = {}) {
    return apiClient.get(
        `${resource}/${encodeURIComponent(categoryId)}`,
        config,
    )
}

export function update(categoryId, category) {
    return apiClient.put(
        `${resource}/${encodeURIComponent(categoryId)}`,
        category,
    )
}

export function destroy(categoryId) {
    return apiClient.delete(`${resource}/${encodeURIComponent(categoryId)}`)
}

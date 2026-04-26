const API_HOST = import.meta.env.VITE_API_HOST || 'http://localhost:8080'

export const apiBaseURL = `${API_HOST}/api`
export const userBaseURL = `${apiBaseURL}/users`
export const loginBaseURL = `${apiBaseURL}/login`
export const settingsBaseURL = `${apiBaseURL}/settings`
export const dashboardBaseURL = `${apiBaseURL}/dashboard`

export const baseURL = userBaseURL

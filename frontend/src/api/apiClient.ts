const API_URL =
  import.meta.env.VITE_API_URL ??
  'http://localhost:3000/api'

export const apiRequest = async <T>(
  path: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(
    `${API_URL}${path}`,
    {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    }
  )

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({
        message: 'Unbekannter Fehler'
      }))

    throw new Error(
      error.message ??
      'Request fehlgeschlagen'
    )
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json()
}
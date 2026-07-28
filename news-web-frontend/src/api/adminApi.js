import apiClient from './http'

function getErrorMessage(error) {
  if (error?.response?.data) {
    if (typeof error.response.data === 'string') {
      return error.response.data
    }

    if (typeof error.response.data.message === 'string') {
      return error.response.data.message
    }
  }

  return error?.message ?? 'Request failed'
}

export async function listAllNews(authHeader) {
  try {
    const response = await apiClient.get('/admin/news', { headers: { Authorization: authHeader } })
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function createNews(authHeader, payload) {
  try {
    const response = await apiClient.post('/admin/news', payload, { headers: { Authorization: authHeader } })
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function updateNews(authHeader, id, payload) {
  try {
    const response = await apiClient.put(`/admin/news/${id}`, payload, { headers: { Authorization: authHeader } })
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function deleteNews(authHeader, id) {
  try {
    await apiClient.delete(`/admin/news/${id}`, { headers: { Authorization: authHeader } })
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function deleteComment(authHeader, id) {
  try {
    await apiClient.delete(`/admin/comments/${id}`, { headers: { Authorization: authHeader } })
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

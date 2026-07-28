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

export async function getCategories() {
  try {
    const response = await apiClient.get('/categories')
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function getNewsByCategory(categoryId) {
  try {
    const response = await apiClient.get(`/categories/${categoryId}/news`)
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function getNewsDetail(newsId) {
  try {
    const response = await apiClient.get(`/news/${newsId}`)
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function getNewsComments(newsId) {
  try {
    const response = await apiClient.get(`/news/${newsId}/comments`)
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function createNewsComment(newsId, commentPayload) {
  try {
    const response = await apiClient.post(`/news/${newsId}/comments`, commentPayload)
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}
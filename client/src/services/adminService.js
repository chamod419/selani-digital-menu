import api from './api'

// =========================
// Categories
// =========================

export const getAdminCategories = async () => {
  const response = await api.get('/categories')
  return response.data.data || []
}

export const createCategory = async (data) => {
  const response = await api.post('/categories', data)
  return response.data
}

export const updateCategory = async (id, data) => {
  const response = await api.put(
    `/categories/${id}`,
    data
  )

  return response.data
}

export const deleteCategory = async (id) => {
  const response = await api.delete(
    `/categories/${id}`
  )

  return response.data
}

// =========================
// Menu Items
// =========================

export const getAdminMenuItems = async () => {
  const response = await api.get('/menu-items')
  return response.data.data || []
}

export const createMenuItem = async (data) => {
  const response = await api.post(
    '/menu-items',
    data
  )

  return response.data
}

export const updateMenuItem = async (id, data) => {
  const response = await api.put(
    `/menu-items/${id}`,
    data
  )

  return response.data
}

export const deleteMenuItem = async (id) => {
  const response = await api.delete(
    `/menu-items/${id}`
  )

  return response.data
}

// =========================
// Image Upload - MongoDB GridFS
// =========================

export const uploadMenuImage = async (
  file,
  onUploadProgress
) => {
  const formData = new FormData()

  formData.append('image', file)

  const response = await api.post(
    '/images/upload',
    formData,
    {
      onUploadProgress,
    }
  )

  return response.data.data
}
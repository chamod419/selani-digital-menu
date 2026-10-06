export const getMenuImageUrl = (
  imageId
) => {
  if (!imageId) {
    return ''
  }

  const apiUrl = (
    import.meta.env.VITE_API_URL ||
    'http://localhost:5000/api'
  ).replace(/\/$/, '')

  return `${apiUrl}/images/${imageId}`
}
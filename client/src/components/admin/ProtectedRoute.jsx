import { Navigate } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'

function ProtectedRoute({ children }) {
  const { admin, authLoading } = useAuth()

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0b0b]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-[#d7b56d]" />
      </div>
    )
  }

  if (!admin) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    )
  }

  return children
}

export default ProtectedRoute
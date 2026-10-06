import { useState } from 'react'

import {
  Navigate,
  useNavigate,
} from 'react-router-dom'

import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from 'lucide-react'

import { motion } from 'framer-motion'

import { useAuth } from '../../context/AuthContext'

function AdminLogin() {
  const { login, admin } = useAuth()

  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (admin) {
    return <Navigate to="/admin" replace />
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setLoading(true)
      setError('')

      await login(email, password)

      navigate('/admin', {
        replace: true,
      })
    } catch (error) {
      setError(
        error.response?.data?.message ||
          'Unable to login'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#090909] px-5 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(215,181,109,0.12),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(215,181,109,0.06),transparent_30%)]" />

      <motion.div
        initial={{
          opacity: 0,
          y: 25,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <img
            src="/images/selani-logo.png"
            alt="Selani"
            className="mx-auto h-24 w-auto object-contain"
          />

          <p className="mt-5 text-[10px] uppercase tracking-[0.35em] text-[#d7b56d]">
            Menu Management
          </p>

          <h1 className="mt-3 font-serif text-4xl text-white">
            Admin Login
          </h1>

          <p className="mt-3 text-sm text-white/35">
            Manage Selani&apos;s digital menu securely.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-[30px] border border-white/[0.07] bg-white/[0.035] p-6 backdrop-blur-xl sm:p-8"
        >
          {error && (
            <div className="mb-5 rounded-2xl border border-red-500/15 bg-red-500/[0.06] px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div>
            <label className="mb-2 block text-xs text-white/45">
              Email Address
            </label>

            <div className="relative">
              <Mail
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
              />

              <input
                type="email"
                required
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="admin@selani.lk"
                className="h-14 w-full rounded-2xl border border-white/[0.08] bg-[#111] pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#d7b56d]/40"
              />
            </div>
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-xs text-white/45">
              Password
            </label>

            <div className="relative">
              <LockKeyhole
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
              />

              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter password"
                className="h-14 w-full rounded-2xl border border-white/[0.08] bg-[#111] pl-12 pr-12 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#d7b56d]/40"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-7 h-14 w-full rounded-2xl bg-[#d7b56d] text-sm font-bold text-black disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

export default AdminLogin
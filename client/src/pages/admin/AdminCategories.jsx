import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import {
  Check,
  Edit3,
  Layers3,
  Loader2,
  Plus,
  Trash2,
  X,
} from 'lucide-react'

import {
  createCategory,
  deleteCategory,
  getAdminCategories,
  updateCategory,
} from '../../services/adminService'

function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)

  const [name, setName] = useState('')
  const [displayOrder, setDisplayOrder] = useState(0)
  const [isActive, setIsActive] = useState(true)

  const [saving, setSaving] = useState(false)

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const loadCategories = async () => {
    try {
      setLoading(true)

      const data = await getAdminCategories()

      setCategories(data)
    } catch (error) {
      setError(
        error.response?.data?.message ||
          'Unable to load categories'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const openCreateModal = () => {
    setEditingCategory(null)
    setName('')
    setDisplayOrder(categories.length + 1)
    setIsActive(true)
    setError('')
    setModalOpen(true)
  }

  const openEditModal = (category) => {
    setEditingCategory(category)

    setName(category.name)
    setDisplayOrder(category.displayOrder ?? 0)
    setIsActive(category.isActive)

    setError('')
    setModalOpen(true)
  }

  const closeModal = () => {
    if (saving) return

    setModalOpen(false)
    setEditingCategory(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!name.trim()) {
      setError('Category name is required')
      return
    }

    try {
      setSaving(true)
      setError('')
      setMessage('')

      const payload = {
        name: name.trim(),
        displayOrder: Number(displayOrder),
        isActive,
      }

      if (editingCategory) {
        await updateCategory(
          editingCategory._id,
          payload
        )

        setMessage('Category updated successfully')
      } else {
        await createCategory(payload)

        setMessage('Category created successfully')
      }

      setModalOpen(false)
      setEditingCategory(null)

      await loadCategories()
    } catch (error) {
      setError(
        error.response?.data?.message ||
          'Unable to save category'
      )
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (category) => {
    const confirmed = window.confirm(
      `Delete "${category.name}" category?`
    )

    if (!confirmed) {
      return
    }

    try {
      setError('')
      setMessage('')

      await deleteCategory(category._id)

      setMessage('Category deleted successfully')

      await loadCategories()
    } catch (error) {
      setError(
        error.response?.data?.message ||
          'Unable to delete category'
      )
    }
  }

  const handleToggle = async (category) => {
    try {
      setError('')
      setMessage('')

      await updateCategory(category._id, {
        isActive: !category.isActive,
      })

      setCategories((current) =>
        current.map((item) =>
          item._id === category._id
            ? {
                ...item,
                isActive: !item.isActive,
              }
            : item
        )
      )
    } catch (error) {
      setError(
        error.response?.data?.message ||
          'Unable to update category'
      )
    }
  }

  return (
    <>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#d7b56d]">
            Menu Management
          </p>

          <h1 className="mt-2 font-serif text-4xl text-white md:text-5xl">
            Categories
          </h1>

          <p className="mt-3 text-sm text-white/35">
            Organize the Selani menu into clear food categories.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#d7b56d] px-5 text-sm font-semibold text-black transition hover:bg-[#e3c17c]"
        >
          <Plus size={17} />
          Add Category
        </button>
      </div>

      {message && (
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-green-500/10 bg-green-500/[0.05] px-4 py-3 text-sm text-green-300">
          <Check size={17} />
          {message}
        </div>
      )}

      {error && !modalOpen && (
        <div className="mt-6 rounded-2xl border border-red-500/10 bg-red-500/[0.05] px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="mt-8 overflow-hidden rounded-[28px] border border-white/[0.07] bg-[#111]">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d7b56d]/10 text-[#d7b56d]">
              <Layers3 size={18} />
            </div>

            <div>
              <p className="text-sm font-medium text-white">
                Menu Categories
              </p>

              <p className="mt-1 text-xs text-white/25">
                {categories.length} categories
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <Loader2
              size={28}
              className="animate-spin text-[#d7b56d]"
            />
          </div>
        ) : categories.length === 0 ? (
          <div className="px-6 py-20 text-center">
            <p className="font-serif text-2xl text-white">
              No categories yet
            </p>

            <p className="mt-2 text-sm text-white/30">
              Create your first menu category.
            </p>

            <button
              onClick={openCreateModal}
              className="mt-6 rounded-xl bg-[#d7b56d] px-5 py-3 text-sm font-semibold text-black"
            >
              Add Category
            </button>
          </div>
        ) : (
          <div>
            <div className="hidden grid-cols-[80px_1fr_140px_140px_120px] border-b border-white/[0.06] px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-white/20 md:grid">
              <span>Order</span>
              <span>Category</span>
              <span>Status</span>
              <span>Created</span>
              <span className="text-right">Actions</span>
            </div>

            {categories.map((category) => (
              <div
                key={category._id}
                className="grid gap-5 border-b border-white/[0.05] px-6 py-5 last:border-b-0 md:grid-cols-[80px_1fr_140px_140px_120px] md:items-center"
              >
                <div>
                  <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-xl bg-white/[0.04] px-3 text-sm text-white/50">
                    {category.displayOrder}
                  </span>
                </div>

                <div>
                  <p className="font-serif text-xl text-white">
                    {category.name}
                  </p>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => handleToggle(category)}
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs ${
                      category.isActive
                        ? 'bg-green-500/10 text-green-300'
                        : 'bg-white/[0.05] text-white/30'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        category.isActive
                          ? 'bg-green-400'
                          : 'bg-white/30'
                      }`}
                    />

                    {category.isActive
                      ? 'Active'
                      : 'Inactive'}
                  </button>
                </div>

                <p className="text-xs text-white/30">
                  {new Date(
                    category.createdAt
                  ).toLocaleDateString()}
                </p>

                <div className="flex justify-start gap-2 md:justify-end">
                  <button
                    type="button"
                    onClick={() => openEditModal(category)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] text-white/40 transition hover:border-[#d7b56d]/30 hover:text-[#d7b56d]"
                  >
                    <Edit3 size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(category)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] text-white/40 transition hover:border-red-500/20 hover:bg-red-500/[0.05] hover:text-red-300"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 z-[200] flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center sm:p-6"
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 60,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 50,
              }}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-lg rounded-t-[30px] border border-white/[0.08] bg-[#111] p-6 sm:rounded-[30px] sm:p-8"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[#d7b56d]">
                    Category
                  </p>

                  <h2 className="mt-2 font-serif text-3xl text-white">
                    {editingCategory
                      ? 'Edit Category'
                      : 'Add Category'}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] text-white/40"
                >
                  <X size={17} />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="mt-7"
              >
                {error && (
                  <div className="mb-5 rounded-2xl border border-red-500/10 bg-red-500/[0.05] px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-xs text-white/45">
                    Category Name
                    <span className="ml-1 text-red-400">*</span>
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    placeholder="Example: Rice"
                    className="h-13 w-full rounded-2xl border border-white/[0.08] bg-[#0b0b0b] px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#d7b56d]/40"
                  />
                </div>

                <div className="mt-5">
                  <label className="mb-2 block text-xs text-white/45">
                    Display Order
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={displayOrder}
                    onChange={(event) =>
                      setDisplayOrder(event.target.value)
                    }
                    className="h-13 w-full rounded-2xl border border-white/[0.08] bg-[#0b0b0b] px-4 py-3.5 text-sm text-white outline-none focus:border-[#d7b56d]/40"
                  />
                </div>

                <div className="mt-5 flex items-center justify-between rounded-2xl border border-white/[0.07] bg-[#0b0b0b] p-4">
                  <div>
                    <p className="text-sm text-white">
                      Active Category
                    </p>

                    <p className="mt-1 text-xs text-white/25">
                      Show this category on customer menu.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsActive(!isActive)}
                    className={`relative h-7 w-12 rounded-full transition ${
                      isActive
                        ? 'bg-[#d7b56d]'
                        : 'bg-white/10'
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                        isActive
                          ? 'left-6'
                          : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="mt-7 flex gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={saving}
                    className="h-13 flex-1 rounded-2xl border border-white/[0.08] px-5 py-3.5 text-sm text-white/50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="flex h-13 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#d7b56d] px-5 py-3.5 text-sm font-semibold text-black disabled:opacity-50"
                  >
                    {saving && (
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />
                    )}

                    {saving
                      ? 'Saving...'
                      : editingCategory
                        ? 'Update'
                        : 'Save Category'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default AdminCategories
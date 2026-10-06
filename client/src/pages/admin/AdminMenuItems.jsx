import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import {
  AnimatePresence,
  motion,
} from 'framer-motion'

import {
  Check,
  ChefHat,
  Edit3,
  Eye,
  EyeOff,
  Flame,
  ImagePlus,
  Loader2,
  PackageCheck,
  Plus,
  Search,
  Sparkles,
  Trash2,
  UtensilsCrossed,
  X,
} from 'lucide-react'

import {
  createMenuItem,
  deleteMenuItem,
  getAdminCategories,
  getAdminMenuItems,
  updateMenuItem,
  uploadMenuImage,
} from '../../services/adminService'

import {
  getMenuImageUrl,
} from '../../utils/imageUrl'

const initialForm = {
  name: '',
  description: '',
  price: '',
  category: '',
  displayOrder: 0,
  isAvailable: true,
  isPopular: false,
  isNew: false,
  isSpecial: false,
}

function AdminMenuItems() {
  const [
    menuItems,
    setMenuItems,
  ] = useState([])

  const [
    categories,
    setCategories,
  ] = useState([])

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    saving,
    setSaving,
  ] = useState(false)

  const [
    modalOpen,
    setModalOpen,
  ] = useState(false)

  const [
    editingItem,
    setEditingItem,
  ] = useState(null)

  const [
    form,
    setForm,
  ] = useState(initialForm)

  const [
    search,
    setSearch,
  ] = useState('')

  const [
    categoryFilter,
    setCategoryFilter,
  ] = useState('All')

  const [
    message,
    setMessage,
  ] = useState('')

  const [
    error,
    setError,
  ] = useState('')

  // =========================
  // Image states
  // =========================

  const fileInputRef =
    useRef(null)

  const [
    selectedFile,
    setSelectedFile,
  ] = useState(null)

  const [
    imagePreview,
    setImagePreview,
  ] = useState('')

  const [
    removeImage,
    setRemoveImage,
  ] = useState(false)

  const [
    uploadProgress,
    setUploadProgress,
  ] = useState(0)

  // =========================
  // Load Menu + Categories
  // =========================

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')

      const [
        itemsData,
        categoriesData,
      ] = await Promise.all([
        getAdminMenuItems(),
        getAdminCategories(),
      ])

      setMenuItems(
        itemsData
      )

      setCategories(
        categoriesData
      )
    } catch (error) {
      console.error(
        'Menu data loading error:',
        error
      )

      setError(
        error.response?.data
          ?.message ||
          'Unable to load menu data'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // =========================
  // Filter Menu Items
  // =========================

  const filteredItems =
    useMemo(() => {
      const searchText =
        search
          .trim()
          .toLowerCase()

      return menuItems.filter(
        (item) => {
          const categoryName =
            item.category?.name ||
            ''

          const description =
            item.description ||
            ''

          const matchesSearch =
            !searchText ||
            item.name
              ?.toLowerCase()
              .includes(
                searchText
              ) ||
            description
              .toLowerCase()
              .includes(
                searchText
              ) ||
            categoryName
              .toLowerCase()
              .includes(
                searchText
              )

          const matchesCategory =
            categoryFilter ===
              'All' ||
            item.category?._id ===
              categoryFilter

          return (
            matchesSearch &&
            matchesCategory
          )
        }
      )
    }, [
      menuItems,
      search,
      categoryFilter,
    ])

  // =========================
  // Open Create Modal
  // =========================

  const openCreateModal =
    () => {
      setEditingItem(null)

      setForm({
        ...initialForm,

        category:
          categories[0]?._id ||
          '',

        displayOrder:
          menuItems.length + 1,
      })

      setSelectedFile(null)
      setImagePreview('')
      setRemoveImage(false)
      setUploadProgress(0)

      if (
        fileInputRef.current
      ) {
        fileInputRef.current.value =
          ''
      }

      setError('')
      setMessage('')
      setModalOpen(true)
    }

  // =========================
  // Open Edit Modal
  // =========================

  const openEditModal = (
    item
  ) => {
    setEditingItem(item)

    setForm({
      name:
        item.name || '',

      description:
        item.description || '',

      price:
        item.price ?? '',

      category:
        item.category?._id ||
        '',

      displayOrder:
        item.displayOrder ??
        0,

      isAvailable:
        item.isAvailable ??
        true,

      isPopular:
        item.isPopular ??
        false,

      isNew:
        item.isNew ??
        false,

      isSpecial:
        item.isSpecial ??
        false,
    })

    setSelectedFile(null)

    setImagePreview(
      getMenuImageUrl(
        item.imageId
      )
    )

    setRemoveImage(false)
    setUploadProgress(0)

    if (
      fileInputRef.current
    ) {
      fileInputRef.current.value =
        ''
    }

    setError('')
    setMessage('')
    setModalOpen(true)
  }

  // =========================
  // Close Modal
  // =========================

  const closeModal = () => {
    if (saving) {
      return
    }

    setModalOpen(false)
    setEditingItem(null)

    setSelectedFile(null)
    setImagePreview('')
    setRemoveImage(false)
    setUploadProgress(0)

    if (
      fileInputRef.current
    ) {
      fileInputRef.current.value =
        ''
    }

    setError('')
  }

  // =========================
  // Handle Form Changes
  // =========================

  const handleChange = (
    field,
    value
  ) => {
    setForm(
      (current) => ({
        ...current,
        [field]: value,
      })
    )
  }

  // =========================
  // Image Select
  // =========================

  const handleImageSelect = (
    event
  ) => {
    const file =
      event.target.files?.[0]

    if (!file) {
      return
    }

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ]

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      setError(
        'Please select a JPG, PNG or WEBP image'
      )

      event.target.value =
        ''

      return
    }

    if (
      file.size >
      10 * 1024 * 1024
    ) {
      setError(
        'Food photo must be less than 10MB'
      )

      event.target.value =
        ''

      return
    }

    setSelectedFile(file)
    setRemoveImage(false)
    setUploadProgress(0)
    setError('')

    const previewUrl =
      URL.createObjectURL(
        file
      )

    setImagePreview(
      previewUrl
    )
  }

  // =========================
  // Remove Image
  // =========================

  const handleRemoveImage =
    () => {
      setSelectedFile(null)
      setImagePreview('')
      setRemoveImage(true)
      setUploadProgress(0)

      if (
        fileInputRef.current
      ) {
        fileInputRef.current.value =
          ''
      }
    }

  // =========================
  // Save Menu Item
  // =========================

  const handleSubmit =
    async (event) => {
      event.preventDefault()

      if (
        !form.name.trim()
      ) {
        setError(
          'Menu item name is required'
        )

        return
      }

      if (!form.category) {
        setError(
          'Category is required'
        )

        return
      }

      if (
        form.price === '' ||
        form.price === null ||
        Number(form.price) < 0
      ) {
        setError(
          'Valid price is required'
        )

        return
      }

      try {
        setSaving(true)
        setError('')
        setMessage('')
        setUploadProgress(0)

        // Existing image when editing
        let imageId =
          editingItem?.imageId ||
          null

        // =========================
        // Upload New Image
        // =========================

        if (selectedFile) {
          const uploadedImage =
            await uploadMenuImage(
              selectedFile,

              (
                progressEvent
              ) => {
                if (
                  progressEvent.total
                ) {
                  const percent =
                    Math.round(
                      (progressEvent.loaded *
                        100) /
                        progressEvent.total
                    )

                  setUploadProgress(
                    percent
                  )
                }
              }
            )

          imageId =
            uploadedImage.imageId
        }

        // =========================
        // Remove Existing Image
        // =========================

        if (
          removeImage &&
          !selectedFile
        ) {
          imageId = null
        }

        // =========================
        // Payload
        // =========================

        const payload = {
          name:
            form.name.trim(),

          description:
            form.description.trim(),

          price:
            Number(
              form.price
            ),

          category:
            form.category,

          imageId,

          displayOrder:
            Number(
              form.displayOrder ||
                0
            ),

          isAvailable:
            form.isAvailable,

          isPopular:
            form.isPopular,

          isNew:
            form.isNew,

          isSpecial:
            form.isSpecial,
        }

        // =========================
        // Update
        // =========================

        if (editingItem) {
          await updateMenuItem(
            editingItem._id,
            payload
          )

          setMessage(
            'Menu item updated successfully'
          )
        }

        // =========================
        // Create
        // =========================

        else {
          await createMenuItem(
            payload
          )

          setMessage(
            'Menu item created successfully'
          )
        }

        setModalOpen(false)

        setEditingItem(null)

        setSelectedFile(null)
        setImagePreview('')
        setRemoveImage(false)
        setUploadProgress(0)

        if (
          fileInputRef.current
        ) {
          fileInputRef.current.value =
            ''
        }

        await loadData()
      } catch (error) {
        console.error(
          'Menu item save error:',
          error
        )

        setError(
          error.response?.data
            ?.message ||
            'Unable to save menu item'
        )
      } finally {
        setSaving(false)
      }
    }

  // =========================
  // Delete Menu Item
  // =========================

  const handleDelete =
    async (item) => {
      const confirmed =
        window.confirm(
          `Delete "${item.name}" from the menu?`
        )

      if (!confirmed) {
        return
      }

      try {
        setError('')
        setMessage('')

        await deleteMenuItem(
          item._id
        )

        setMessage(
          'Menu item deleted successfully'
        )

        await loadData()
      } catch (error) {
        console.error(
          'Delete menu item error:',
          error
        )

        setError(
          error.response?.data
            ?.message ||
            'Unable to delete menu item'
        )
      }
    }

  // =========================
  // Quick Toggle
  // =========================

  const toggleItemStatus =
    async (
      item,
      field
    ) => {
      try {
        setError('')
        setMessage('')

        const newValue =
          !item[field]

        await updateMenuItem(
          item._id,
          {
            [field]:
              newValue,
          }
        )

        setMenuItems(
          (current) =>
            current.map(
              (menuItem) =>
                menuItem._id ===
                item._id
                  ? {
                      ...menuItem,

                      [field]:
                        newValue,
                    }
                  : menuItem
            )
        )
      } catch (error) {
        console.error(
          'Menu item status error:',
          error
        )

        setError(
          error.response?.data
            ?.message ||
            'Unable to update menu item'
        )
      }
    }

  return (
    <>
      {/* ============================= */}
      {/* PAGE HEADER */}
      {/* ============================= */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#d7b56d]">
            Menu Management
          </p>

          <h1 className="mt-2 font-serif text-4xl text-white md:text-5xl">
            Menu Items
          </h1>

          <p className="mt-3 text-sm text-white/35">
            Manage dishes,
            prices, photos,
            availability and menu
            highlights.
          </p>
        </div>

        <button
          type="button"
          onClick={
            openCreateModal
          }
          disabled={
            categories.length ===
            0
          }
          className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#d7b56d] px-5 text-sm font-semibold text-black transition hover:bg-[#e3c17c] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus size={17} />

          Add Menu Item
        </button>
      </div>

      {/* ============================= */}
      {/* SUCCESS MESSAGE */}
      {/* ============================= */}

      {message && (
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-green-500/10 bg-green-500/[0.05] px-4 py-3 text-sm text-green-300">
          <Check size={17} />

          {message}
        </div>
      )}

      {/* ============================= */}
      {/* ERROR MESSAGE */}
      {/* ============================= */}

      {error &&
        !modalOpen && (
          <div className="mt-6 rounded-2xl border border-red-500/10 bg-red-500/[0.05] px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

      {/* ============================= */}
      {/* CATEGORY WARNING */}
      {/* ============================= */}

      {categories.length ===
        0 &&
        !loading && (
          <div className="mt-6 rounded-2xl border border-yellow-500/10 bg-yellow-500/[0.05] px-4 py-3 text-sm text-yellow-200/70">
            Create at least one
            category before adding
            menu items.
          </div>
        )}

      {/* ============================= */}
      {/* SEARCH + CATEGORY FILTER */}
      {/* ============================= */}

      <div className="mt-8 grid gap-4 md:grid-cols-[1fr_220px]">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
          />

          <input
            type="text"
            value={search}
            onChange={(
              event
            ) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search menu items..."
            className="h-[52px] w-full rounded-2xl border border-white/[0.07] bg-[#111] pl-12 pr-4 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#d7b56d]/30"
          />
        </div>

        <select
          value={
            categoryFilter
          }
          onChange={(
            event
          ) =>
            setCategoryFilter(
              event.target.value
            )
          }
          className="h-[52px] rounded-2xl border border-white/[0.07] bg-[#111] px-4 text-sm text-white outline-none focus:border-[#d7b56d]/30"
        >
          <option value="All">
            All Categories
          </option>

          {categories.map(
            (category) => (
              <option
                key={
                  category._id
                }
                value={
                  category._id
                }
              >
                {category.name}
              </option>
            )
          )}
        </select>
      </div>

      {/* ============================= */}
      {/* LOADING */}
      {/* ============================= */}

      {loading ? (
        <div className="mt-8 flex min-h-[360px] items-center justify-center rounded-[28px] border border-white/[0.07] bg-[#111]">
          <Loader2
            size={30}
            className="animate-spin text-[#d7b56d]"
          />
        </div>
      ) : filteredItems.length ===
        0 ? (
        // =============================
        // EMPTY
        // =============================

        <div className="mt-8 rounded-[28px] border border-white/[0.07] bg-[#111] px-6 py-20 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#d7b56d]/10 text-[#d7b56d]">
            <UtensilsCrossed
              size={23}
            />
          </div>

          <p className="mt-5 font-serif text-2xl text-white">
            No menu items found
          </p>

          <p className="mt-2 text-sm text-white/30">
            Add your first
            Selani dish to the
            menu.
          </p>
        </div>
      ) : (
        // =============================
        // MENU ITEM CARDS
        // =============================

        <div className="mt-8 grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
          {filteredItems.map(
            (item) => (
              <div
                key={
                  item._id
                }
                className="overflow-hidden rounded-[28px] border border-white/[0.07] bg-[#111]"
              >
                {/* IMAGE */}

                <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-[#211c14] via-[#151515] to-[#090909]">
                  {item.imageId ? (
                    <img
                      src={getMenuImageUrl(
                        item.imageId
                      )}
                      alt={
                        item.name
                      }
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <div className="text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#d7b56d]/10 text-[#d7b56d]/60">
                          <ImagePlus
                            size={
                              21
                            }
                          />
                        </div>

                        <p className="mt-3 text-xs text-white/25">
                          No food
                          photo
                        </p>
                      </div>
                    </div>
                  )}

                  {/* UNAVAILABLE OVERLAY */}

                  {!item.isAvailable && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/65 backdrop-blur-[2px]">
                      <span className="rounded-full border border-white/10 bg-black/50 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/60">
                        Unavailable
                      </span>
                    </div>
                  )}

                  {/* BADGES */}

                  <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                    {item.isPopular && (
                      <span className="rounded-full bg-[#d7b56d] px-3 py-1 text-[9px] font-bold uppercase text-black">
                        Popular
                      </span>
                    )}

                    {item.isNew && (
                      <span className="rounded-full bg-white px-3 py-1 text-[9px] font-bold uppercase text-black">
                        New
                      </span>
                    )}

                    {item.isSpecial && (
                      <span className="rounded-full bg-black/60 px-3 py-1 text-[9px] uppercase text-white backdrop-blur-md">
                        Special
                      </span>
                    )}
                  </div>
                </div>

                {/* ITEM DETAILS */}

                <div className="p-5">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#d7b56d]/70">
                    {item.category
                      ?.name ||
                      'No Category'}
                  </p>

                  <h2 className="mt-2 font-serif text-2xl text-white">
                    {item.name}
                  </h2>

                  <p className="mt-2 line-clamp-2 min-h-[40px] text-sm leading-5 text-white/30">
                    {item.description ||
                      'No description added.'}
                  </p>

                  <p className="mt-4 text-xl font-semibold text-[#d7b56d]">
                    Rs.{' '}
                    {Number(
                      item.price ||
                        0
                    ).toLocaleString()}
                  </p>

                  {/* QUICK STATUS */}

                  <div className="mt-5 grid grid-cols-4 gap-2 border-t border-white/[0.06] pt-5">
                    <button
                      type="button"
                      title="Available"
                      onClick={() =>
                        toggleItemStatus(
                          item,
                          'isAvailable'
                        )
                      }
                      className={`flex h-10 items-center justify-center rounded-xl border transition ${
                        item.isAvailable
                          ? 'border-green-500/20 bg-green-500/[0.08] text-green-300'
                          : 'border-white/[0.06] text-white/25'
                      }`}
                    >
                      {item.isAvailable ? (
                        <Eye
                          size={
                            16
                          }
                        />
                      ) : (
                        <EyeOff
                          size={
                            16
                          }
                        />
                      )}
                    </button>

                    <button
                      type="button"
                      title="Popular"
                      onClick={() =>
                        toggleItemStatus(
                          item,
                          'isPopular'
                        )
                      }
                      className={`flex h-10 items-center justify-center rounded-xl border transition ${
                        item.isPopular
                          ? 'border-orange-500/20 bg-orange-500/[0.08] text-orange-300'
                          : 'border-white/[0.06] text-white/25'
                      }`}
                    >
                      <Flame
                        size={16}
                      />
                    </button>

                    <button
                      type="button"
                      title="New"
                      onClick={() =>
                        toggleItemStatus(
                          item,
                          'isNew'
                        )
                      }
                      className={`flex h-10 items-center justify-center rounded-xl border transition ${
                        item.isNew
                          ? 'border-blue-500/20 bg-blue-500/[0.08] text-blue-300'
                          : 'border-white/[0.06] text-white/25'
                      }`}
                    >
                      <Sparkles
                        size={16}
                      />
                    </button>

                    <button
                      type="button"
                      title="Chef's Special"
                      onClick={() =>
                        toggleItemStatus(
                          item,
                          'isSpecial'
                        )
                      }
                      className={`flex h-10 items-center justify-center rounded-xl border transition ${
                        item.isSpecial
                          ? 'border-[#d7b56d]/20 bg-[#d7b56d]/[0.08] text-[#d7b56d]'
                          : 'border-white/[0.06] text-white/25'
                      }`}
                    >
                      <ChefHat
                        size={16}
                      />
                    </button>
                  </div>

                  {/* ACTION BUTTONS */}

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        openEditModal(
                          item
                        )
                      }
                      className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/[0.07] text-sm text-white/50 transition hover:border-[#d7b56d]/30 hover:text-[#d7b56d]"
                    >
                      <Edit3
                        size={
                          15
                        }
                      />

                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          item
                        )
                      }
                      className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/[0.07] text-sm text-white/40 transition hover:border-red-500/20 hover:bg-red-500/[0.05] hover:text-red-300"
                    >
                      <Trash2
                        size={
                          15
                        }
                      />

                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* ============================= */}
      {/* ADD / EDIT MODAL */}
      {/* ============================= */}

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onClick={
              closeModal
            }
            className="fixed inset-0 z-[200] flex items-end justify-center bg-black/80 backdrop-blur-sm md:items-center md:p-6"
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 70,
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
              onClick={(
                event
              ) =>
                event.stopPropagation()
              }
              className="max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-t-[30px] border border-white/[0.08] bg-[#111] p-6 md:rounded-[30px] md:p-8"
            >
              {/* MODAL HEADER */}

              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[#d7b56d]">
                    Menu Item
                  </p>

                  <h2 className="mt-2 font-serif text-3xl text-white">
                    {editingItem
                      ? 'Edit Menu Item'
                      : 'Add Menu Item'}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={
                    closeModal
                  }
                  disabled={saving}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] text-white/40 disabled:opacity-30"
                >
                  <X
                    size={17}
                  />
                </button>
              </div>

              {/* FORM */}

              <form
                onSubmit={
                  handleSubmit
                }
                className="mt-7"
              >
                {error && (
                  <div className="mb-5 rounded-2xl border border-red-500/10 bg-red-500/[0.05] px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                <div className="grid gap-5 md:grid-cols-2">
                  {/* NAME */}

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-xs text-white/45">
                      Item Name

                      <span className="ml-1 text-red-400">
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      value={
                        form.name
                      }
                      onChange={(
                        event
                      ) =>
                        handleChange(
                          'name',
                          event
                            .target
                            .value
                        )
                      }
                      placeholder="Example: Grill Prawns Pasta"
                      className="w-full rounded-2xl border border-white/[0.08] bg-[#0b0b0b] px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#d7b56d]/40"
                    />
                  </div>

                  {/* DESCRIPTION */}

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-xs text-white/45">
                      Description
                    </label>

                    <textarea
                      rows="4"
                      value={
                        form.description
                      }
                      onChange={(
                        event
                      ) =>
                        handleChange(
                          'description',
                          event
                            .target
                            .value
                        )
                      }
                      placeholder="Short description about the dish..."
                      className="w-full resize-none rounded-2xl border border-white/[0.08] bg-[#0b0b0b] px-4 py-3.5 text-sm leading-6 text-white outline-none placeholder:text-white/20 focus:border-[#d7b56d]/40"
                    />
                  </div>

                  {/* PRICE */}

                  <div>
                    <label className="mb-2 block text-xs text-white/45">
                      Price (Rs.)

                      <span className="ml-1 text-red-400">
                        *
                      </span>
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={
                        form.price
                      }
                      onChange={(
                        event
                      ) =>
                        handleChange(
                          'price',
                          event
                            .target
                            .value
                        )
                      }
                      placeholder="1950"
                      className="w-full rounded-2xl border border-white/[0.08] bg-[#0b0b0b] px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#d7b56d]/40"
                    />
                  </div>

                  {/* CATEGORY */}

                  <div>
                    <label className="mb-2 block text-xs text-white/45">
                      Category

                      <span className="ml-1 text-red-400">
                        *
                      </span>
                    </label>

                    <select
                      value={
                        form.category
                      }
                      onChange={(
                        event
                      ) =>
                        handleChange(
                          'category',
                          event
                            .target
                            .value
                        )
                      }
                      className="w-full rounded-2xl border border-white/[0.08] bg-[#0b0b0b] px-4 py-3.5 text-sm text-white outline-none focus:border-[#d7b56d]/40"
                    >
                      <option value="">
                        Select
                        Category
                      </option>

                      {categories.map(
                        (
                          category
                        ) => (
                          <option
                            key={
                              category._id
                            }
                            value={
                              category._id
                            }
                          >
                            {
                              category.name
                            }
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  {/* DISPLAY ORDER */}

                  <div>
                    <label className="mb-2 block text-xs text-white/45">
                      Display Order
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={
                        form.displayOrder
                      }
                      onChange={(
                        event
                      ) =>
                        handleChange(
                          'displayOrder',
                          event
                            .target
                            .value
                        )
                      }
                      className="w-full rounded-2xl border border-white/[0.08] bg-[#0b0b0b] px-4 py-3.5 text-sm text-white outline-none focus:border-[#d7b56d]/40"
                    />
                  </div>

                  {/* ============================= */}
                  {/* FOOD PHOTO */}
                  {/* ============================= */}

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-xs text-white/45">
                      Food Photo
                    </label>

                    <input
                      ref={
                        fileInputRef
                      }
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={
                        handleImageSelect
                      }
                      className="hidden"
                    />

                    {imagePreview ? (
                      <div className="overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#0b0b0b]">
                        <div className="relative aspect-[16/8] overflow-hidden">
                          <img
                            src={
                              imagePreview
                            }
                            alt="Food preview"
                            className="h-full w-full object-cover"
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                            <button
                              type="button"
                              disabled={
                                saving
                              }
                              onClick={() =>
                                fileInputRef.current?.click()
                              }
                              className="rounded-full border border-white/15 bg-black/60 px-4 py-2 text-xs text-white backdrop-blur-md disabled:opacity-40"
                            >
                              Change
                              Photo
                            </button>

                            <button
                              type="button"
                              disabled={
                                saving
                              }
                              onClick={
                                handleRemoveImage
                              }
                              className="rounded-full border border-red-400/20 bg-red-500/20 px-4 py-2 text-xs text-red-100 backdrop-blur-md disabled:opacity-40"
                            >
                              Remove
                              Photo
                            </button>
                          </div>
                        </div>

                        {selectedFile && (
                          <div className="flex items-center justify-between px-4 py-3">
                            <div className="min-w-0">
                              <p className="max-w-[300px] truncate text-xs text-white/50">
                                {
                                  selectedFile.name
                                }
                              </p>

                              <p className="mt-1 text-[10px] text-white/20">
                                {(
                                  selectedFile.size /
                                  1024 /
                                  1024
                                ).toFixed(
                                  2
                                )}{' '}
                                MB
                              </p>
                            </div>

                            <Check
                              size={
                                17
                              }
                              className="shrink-0 text-green-300"
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        type="button"
                        disabled={
                          saving
                        }
                        onClick={() =>
                          fileInputRef.current?.click()
                        }
                        className="flex min-h-[170px] w-full flex-col items-center justify-center rounded-[24px] border border-dashed border-[#d7b56d]/25 bg-[#d7b56d]/[0.025] p-6 text-center transition hover:border-[#d7b56d]/50 hover:bg-[#d7b56d]/[0.04] disabled:opacity-40"
                      >
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#d7b56d]/10 text-[#d7b56d]">
                          <ImagePlus
                            size={
                              23
                            }
                          />
                        </div>

                        <p className="mt-4 text-sm font-medium text-white">
                          Upload Food
                          Photo
                        </p>

                        <p className="mt-2 text-xs text-white/25">
                          JPG, PNG or
                          WEBP • Maximum
                          10MB
                        </p>
                      </button>
                    )}

                    {/* UPLOAD PROGRESS */}

                    {saving &&
                      selectedFile &&
                      uploadProgress >
                        0 && (
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-white/30">
                              Saving photo
                              to
                              MongoDB...
                            </span>

                            <span className="text-[#d7b56d]">
                              {
                                uploadProgress
                              }
                              %
                            </span>
                          </div>

                          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                            <div
                              className="h-full rounded-full bg-[#d7b56d] transition-all duration-300"
                              style={{
                                width: `${uploadProgress}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                  </div>
                </div>

                {/* ============================= */}
                {/* STATUS TOGGLES */}
                {/* ============================= */}

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <StatusToggle
                    label="Available"
                    description="Show this dish to customers."
                    icon={
                      PackageCheck
                    }
                    active={
                      form.isAvailable
                    }
                    onClick={() =>
                      handleChange(
                        'isAvailable',
                        !form.isAvailable
                      )
                    }
                  />

                  <StatusToggle
                    label="Popular"
                    description="Mark as a popular dish."
                    icon={Flame}
                    active={
                      form.isPopular
                    }
                    onClick={() =>
                      handleChange(
                        'isPopular',
                        !form.isPopular
                      )
                    }
                  />

                  <StatusToggle
                    label="New Item"
                    description="Show the New badge."
                    icon={
                      Sparkles
                    }
                    active={
                      form.isNew
                    }
                    onClick={() =>
                      handleChange(
                        'isNew',
                        !form.isNew
                      )
                    }
                  />

                  <StatusToggle
                    label="Chef's Special"
                    description="Feature as a special dish."
                    icon={
                      ChefHat
                    }
                    active={
                      form.isSpecial
                    }
                    onClick={() =>
                      handleChange(
                        'isSpecial',
                        !form.isSpecial
                      )
                    }
                  />
                </div>

                {/* ============================= */}
                {/* FORM BUTTONS */}
                {/* ============================= */}

                <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={
                      closeModal
                    }
                    disabled={
                      saving
                    }
                    className="rounded-2xl border border-white/[0.08] px-6 py-3.5 text-sm text-white/45 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      saving
                    }
                    className="flex min-w-[160px] items-center justify-center gap-2 rounded-2xl bg-[#d7b56d] px-7 py-3.5 text-sm font-semibold text-black transition hover:bg-[#e3c17c] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving && (
                      <Loader2
                        size={
                          16
                        }
                        className="animate-spin"
                      />
                    )}

                    {saving
                      ? selectedFile
                        ? 'Uploading & Saving...'
                        : 'Saving...'
                      : editingItem
                        ? 'Update Item'
                        : 'Save Menu Item'}
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

// ========================================
// REUSABLE STATUS TOGGLE
// ========================================

function StatusToggle({
  label,
  description,
  icon: Icon,
  active,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-between rounded-2xl border p-4 text-left transition ${
        active
          ? 'border-[#d7b56d]/20 bg-[#d7b56d]/[0.05]'
          : 'border-white/[0.07] bg-[#0b0b0b]'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            active
              ? 'bg-[#d7b56d]/10 text-[#d7b56d]'
              : 'bg-white/[0.04] text-white/25'
          }`}
        >
          <Icon size={17} />
        </div>

        <div>
          <p
            className={`text-sm ${
              active
                ? 'text-white'
                : 'text-white/45'
            }`}
          >
            {label}
          </p>

          <p className="mt-1 text-[10px] text-white/20">
            {description}
          </p>
        </div>
      </div>

      <div
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
          active
            ? 'bg-[#d7b56d]'
            : 'bg-white/10'
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${
            active
              ? 'left-6'
              : 'left-1'
          }`}
        />
      </div>
    </button>
  )
}

export default AdminMenuItems
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { AnimatePresence } from 'framer-motion'

import {
  AlertCircle,
  RefreshCcw,
  Search,
  X,
} from 'lucide-react'

import MenuHeader from '../components/MenuHeader'
import HeroSection from '../components/HeroSection'
import CategoryBar from '../components/CategoryBar'
import MenuCard from '../components/MenuCard'
import DishModal from '../components/DishModal'
import SpecialsSection from '../components/SpecialsSection'
import MenuSkeleton from '../components/MenuSkeleton'

import {
  getPublicCategories,
  getPublicMenuItems,
} from '../services/menuService'

function MenuPage() {
  const [menuItems, setMenuItems] = useState([])
  const [categories, setCategories] = useState([])

  const [activeCategory, setActiveCategory] =
    useState('All')

  const [search, setSearch] = useState('')

  const [selectedItem, setSelectedItem] =
    useState(null)

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState('')

  const searchRef = useRef(null)

  const loadMenuData = async () => {
    try {
      setLoading(true)
      setError('')

      const [
        categoryData,
        menuItemData,
      ] = await Promise.all([
        getPublicCategories(),
        getPublicMenuItems(),
      ])

      setCategories(categoryData)
      setMenuItems(menuItemData)
    } catch (error) {
      console.error(
        'Menu loading error:',
        error
      )

      setError(
        'We could not load the menu right now.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMenuData()
  }, [])

  const categoryNames = useMemo(() => {
    return [
      'All',
      ...categories.map(
        (category) => category.name
      ),
    ]
  }, [categories])

  const filteredItems = useMemo(() => {
    const searchText =
      search.toLowerCase().trim()

    return menuItems.filter((item) => {
      const matchesCategory =
        activeCategory === 'All' ||
        item.category === activeCategory

      const matchesSearch =
        !searchText ||
        item.name
          .toLowerCase()
          .includes(searchText) ||
        item.description
          .toLowerCase()
          .includes(searchText) ||
        item.category
          .toLowerCase()
          .includes(searchText)

      return (
        matchesCategory &&
        matchesSearch
      )
    })
  }, [
    menuItems,
    activeCategory,
    search,
  ])

  const handleSearchClick = () => {
    searchRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })

    setTimeout(() => {
      searchRef.current
        ?.querySelector('input')
        ?.focus()
    }, 500)
  }

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">
      <MenuHeader
        onSearchClick={handleSearchClick}
      />

      <HeroSection />

      {!loading &&
        !error &&
        menuItems.length > 0 && (
          <SpecialsSection
            items={menuItems}
            onItemClick={setSelectedItem}
          />
        )}

      <section
        ref={searchRef}
        className="mx-auto max-w-7xl px-5 pb-8 md:px-8"
      >
        <div className="rounded-[28px] border border-white/[0.07] bg-white/[0.025] p-5 md:p-7">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#d7b56d]">
            Find your favourite
          </p>

          <h2 className="mt-2 font-serif text-3xl text-white">
            What are you craving?
          </h2>

          <div className="relative mt-6">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search rice, kottu, pasta..."
              disabled={loading}
              className="h-14 w-full rounded-2xl border border-white/[0.08] bg-[#111] pl-12 pr-12 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#d7b56d]/40 disabled:cursor-not-allowed disabled:opacity-50"
            />

            {search && (
              <button
                onClick={() =>
                  setSearch('')
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 transition hover:text-white"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </section>

      {!loading &&
        !error &&
        categoryNames.length > 1 && (
          <CategoryBar
            categories={categoryNames}
            activeCategory={
              activeCategory
            }
            setActiveCategory={
              setActiveCategory
            }
          />
        )}

      <section
        id="menu"
        className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20"
      >
        <div className="mb-9 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#d7b56d]">
              Selani Menu
            </p>

            <h2 className="mt-2 font-serif text-4xl text-white md:text-5xl">
              {activeCategory === 'All'
                ? 'Explore our menu'
                : activeCategory}
            </h2>
          </div>

          {!loading &&
            !error && (
              <p className="hidden text-sm text-white/30 sm:block">
                {
                  filteredItems.length
                }{' '}
                {filteredItems.length ===
                1
                  ? 'item'
                  : 'items'}
              </p>
            )}
        </div>

        {loading && <MenuSkeleton />}

        {!loading && error && (
          <div className="rounded-[28px] border border-red-500/10 bg-red-500/[0.03] px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
              <AlertCircle
                size={24}
                className="text-red-400"
              />
            </div>

            <h3 className="mt-5 font-serif text-2xl text-white">
              Menu unavailable
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/40">
              {error}
            </p>

            <button
              onClick={loadMenuData}
              className="mx-auto mt-7 flex items-center gap-2 rounded-full bg-[#d7b56d] px-6 py-3 text-sm font-semibold text-black"
            >
              <RefreshCcw size={16} />

              Try Again
            </button>
          </div>
        )}

        {!loading &&
          !error &&
          filteredItems.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filteredItems.map(
                  (item) => (
                    <MenuCard
                      key={item.id}
                      item={item}
                      onClick={
                        setSelectedItem
                      }
                    />
                  )
                )}
              </AnimatePresence>
            </div>
          )}

        {!loading &&
          !error &&
          menuItems.length > 0 &&
          filteredItems.length === 0 && (
            <div className="rounded-[28px] border border-white/[0.07] bg-white/[0.025] px-5 py-20 text-center">
              <p className="font-serif text-2xl text-white">
                No dishes found
              </p>

              <p className="mt-2 text-sm text-white/35">
                Try another search or
                category.
              </p>

              <button
                onClick={() => {
                  setSearch('')
                  setActiveCategory(
                    'All'
                  )
                }}
                className="mt-6 rounded-full bg-[#d7b56d] px-6 py-3 text-sm font-semibold text-black"
              >
                View Full Menu
              </button>
            </div>
          )}

        {!loading &&
          !error &&
          menuItems.length === 0 && (
            <div className="rounded-[28px] border border-white/[0.07] bg-white/[0.025] px-6 py-20 text-center">
              <p className="font-serif text-3xl text-white">
                Our menu is being prepared
              </p>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/35">
                Delicious dishes will be
                available here soon.
              </p>
            </div>
          )}
      </section>

      <footer className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-5 py-12 text-center md:px-8">
          <img
            src="/images/selani-logo.png"
            alt="Selani Hotels & Restaurants"
            className="mx-auto h-20 w-auto object-contain"
          />

          <p className="mx-auto mt-6 max-w-sm text-xs leading-6 text-white/25">
            Great food, memorable moments
            and flavours made to be
            enjoyed.
          </p>

          <p className="mt-8 text-[10px] text-white/15">
            ©{' '}
            {new Date().getFullYear()}{' '}
            Selani Hotels & Restaurants
          </p>
        </div>
      </footer>

      <AnimatePresence>
        {selectedItem && (
          <DishModal
            item={selectedItem}
            onClose={() =>
              setSelectedItem(null)
            }
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default MenuPage
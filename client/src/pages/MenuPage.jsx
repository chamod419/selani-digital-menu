import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { AlertCircle, RefreshCcw } from 'lucide-react'

import MenuHeader from '../components/MenuHeader'
import CategoryBar from '../components/CategoryBar'
import MenuCard from '../components/MenuCard'
import DishModal from '../components/DishModal'
import SpecialsSection from '../components/SpecialsSection'
import MenuSkeleton from '../components/MenuSkeleton'

import { getPublicCategories, getPublicMenuItems } from '../services/menuService'

const TAGS = [
  { key: 'all', label: 'All dishes' },
  { key: 'isPopular', label: 'Popular' },
  { key: 'isNew', label: 'New' },
]

function MenuPage() {
  const [menuItems, setMenuItems] = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState('')
  const [tag, setTag] = useState('all')
  const [search, setSearch] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const scrollLock = useRef(0)

  const loadMenuData = async () => {
    try {
      setLoading(true)
      setError('')
      const [cats, items] = await Promise.all([getPublicCategories(), getPublicMenuItems()])
      setCategories(cats)
      setMenuItems(items)
    } catch (err) {
      console.error('Menu loading error:', err)
      setError('We could not load the menu. Check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMenuData()
  }, [])

  // Menu grouped by category, like a printed menu
  const sections = useMemo(() => {
    const names = categories.map((c) => c.name)
    menuItems.forEach((i) => !names.includes(i.category) && names.push(i.category))
    return names
      .map((name) => ({ name, items: menuItems.filter((i) => i.category === name) }))
      .filter((s) => s.items.length > 0)
  }, [categories, menuItems])

  const isFiltering = search.trim() !== '' || tag !== 'all'

  const results = useMemo(() => {
    const text = search.toLowerCase().trim()
    return menuItems.filter(
      (i) =>
        (tag === 'all' || i[tag]) &&
        (!text ||
          i.name.toLowerCase().includes(text) ||
          (i.description || '').toLowerCase().includes(text) ||
          i.category.toLowerCase().includes(text))
    )
  }, [menuItems, search, tag])

  const current = activeCategory || sections[0]?.name

  // Scroll-spy: highlight the category tab for the section on screen
  useEffect(() => {
    if (isFiltering || sections.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (Date.now() < scrollLock.current) return
        const top = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (top) setActiveCategory(top.target.dataset.cat)
      },
      { rootMargin: '-80px 0px -70% 0px' }
    )
    sections.forEach((_, i) => {
      const el = document.getElementById(`cat-${i}`)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [sections, isFiltering])

  const selectCategory = (name) => {
    setSearch('')
    setTag('all')
    setActiveCategory(name)
    scrollLock.current = Date.now() + 800
    // wait a frame in case filters were just cleared
    requestAnimationFrame(() => {
      const i = sections.findIndex((s) => s.name === name)
      document.getElementById(`cat-${i}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const ready = !loading && !error

  return (
    <div className="min-h-screen bg-[#f5f1e6] text-[#0c2418]">
      <MenuHeader />

      {ready && !isFiltering && <SpecialsSection items={menuItems} onItemClick={setSelectedItem} />}

      {ready && sections.length > 0 && (
        <CategoryBar
          categories={sections.map((s) => s.name)}
          activeCategory={current}
          onSelect={selectCategory}
          search={search}
          setSearch={setSearch}
        />
      )}

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-4 md:px-8">
        {ready && menuItems.length > 0 && (
          <div className="no-scrollbar mb-2 flex gap-2 overflow-x-auto py-2">
            {TAGS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTag(t.key)}
                aria-pressed={tag === t.key}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm transition ${
                  tag === t.key
                    ? 'border-[#14432b] bg-[#14432b] text-white'
                    : 'border-[#0c2418]/15 bg-white text-[#0c2418]/70'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        {loading && <MenuSkeleton />}

        {!loading && error && (
          <div className="rounded-3xl bg-white px-6 py-14 text-center">
            <AlertCircle size={30} className="mx-auto text-red-500" />
            <h3 className="mt-4 font-serif text-2xl">Menu unavailable</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#0c2418]/55">{error}</p>
            <button
              onClick={loadMenuData}
              className="mx-auto mt-6 flex items-center gap-2 rounded-full bg-[#14432b] px-6 py-3 text-sm font-semibold text-white"
            >
              <RefreshCcw size={16} /> Try again
            </button>
          </div>
        )}

        {ready && menuItems.length === 0 && (
          <div className="rounded-3xl bg-white px-6 py-14 text-center">
            <p className="font-serif text-2xl">The menu is being updated</p>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#0c2418]/55">
              Please ask our staff for today&apos;s dishes.
            </p>
          </div>
        )}

        {/* Normal view: one section per category */}
        {ready && !isFiltering &&
          sections.map((section, i) => (
            <section key={section.name} id={`cat-${i}`} data-cat={section.name} className="scroll-mt-[72px] pt-6">
              <div className="mb-3 flex items-baseline justify-between px-1">
                <h2 className="font-serif text-3xl md:text-4xl">{section.name}</h2>
                <span className="text-xs text-[#0c2418]/45">{section.items.length} dishes</span>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {section.items.map((item) => (
                  <MenuCard key={item.id} item={item} onClick={setSelectedItem} />
                ))}
              </div>
            </section>
          ))}

        {/* Search / filter view: one flat list */}
        {ready && isFiltering && (
          <div className="pt-4">
            <p className="mb-3 px-1 text-sm text-[#0c2418]/55">
              {results.length} {results.length === 1 ? 'dish' : 'dishes'} found
            </p>
            {results.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2">
                <AnimatePresence mode="popLayout">
                  {results.map((item) => (
                    <MenuCard key={item.id} item={item} onClick={setSelectedItem} />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="rounded-3xl bg-white px-5 py-14 text-center">
                <p className="font-serif text-2xl">No dishes match</p>
                <p className="mt-2 text-sm text-[#0c2418]/55">Try a different word or clear the filters.</p>
                <button
                  onClick={() => {
                    setSearch('')
                    setTag('all')
                  }}
                  className="mt-5 rounded-full bg-[#14432b] px-6 py-3 text-sm font-semibold text-white"
                >
                  Show full menu
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="bg-[#0c2418] pb-[max(2rem,env(safe-area-inset-bottom))] pt-10 text-center">
        <img src="/images/selani-logo.png" alt="Selani since 1998" className="mx-auto h-20 w-20 rounded-full object-contain" />
        <p className="mt-4 text-sm text-white/50">Great food, memorable moments.</p>
        <p className="mt-4 text-xs text-white/30">© {new Date().getFullYear()} Selani Hotels &amp; Restaurants</p>
      </footer>

      <AnimatePresence>
        {selectedItem && <DishModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
      </AnimatePresence>
    </div>
  )
}

export default MenuPage

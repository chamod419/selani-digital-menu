import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, X } from 'lucide-react'

function CategoryBar({ categories, activeCategory, onSelect, search, setSearch }) {
  const [open, setOpen] = useState(false)
  const scroller = useRef(null)
  const inputRef = useRef(null)
  const tabRefs = useRef({})

  // Keep the active tab centred inside the bar (without scrolling the page)
  useEffect(() => {
    const el = tabRefs.current[activeCategory]
    const box = scroller.current
    if (el && box) {
      box.scrollTo({
        left: el.offsetLeft - box.clientWidth / 2 + el.clientWidth / 2,
        behavior: 'smooth',
      })
    }
  }, [activeCategory])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const closeSearch = () => {
    setSearch('')
    setOpen(false)
  }

  return (
    <div className="sticky top-0 z-40 border-b border-[#0c2418]/10 bg-[#f5f1e6]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-3 md:px-8">
        {open ? (
          <>
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0c2418]/40" />
              <input
                ref={inputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search dishes, e.g. rice, kottu"
                className="h-11 w-full rounded-full border border-[#0c2418]/10 bg-white pl-11 pr-4 text-[15px] outline-none focus:border-[#2f8f55] focus:ring-2 focus:ring-[#2f8f55]/20"
              />
            </div>
            <button
              onClick={closeSearch}
              aria-label="Close search"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#14432b] text-white"
            >
              <X size={18} />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setOpen(true)}
              aria-label="Search the menu"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#14432b] shadow-sm"
            >
              <Search size={18} />
            </button>

            <div ref={scroller} className="no-scrollbar flex flex-1 gap-1.5 overflow-x-auto">
              {categories.map((name) => {
                const isActive = activeCategory === name
                return (
                  <button
                    key={name}
                    ref={(el) => (tabRefs.current[name] = el)}
                    onClick={() => onSelect(name)}
                    className={`relative shrink-0 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
                      isActive ? 'text-white' : 'text-[#0c2418]/60'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-full bg-[#14432b]"
                        transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                      />
                    )}
                    <span className="relative z-10">{name}</span>
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CategoryBar

import { motion } from 'framer-motion'

function CategoryBar({
  categories,
  activeCategory,
  setActiveCategory,
}) {
  return (
    <div className="sticky top-[72px] z-40 border-y border-white/5 bg-[#0b0b0b]/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl overflow-x-auto px-5 md:px-8 no-scrollbar">
        <div className="flex min-w-max gap-2 py-4">
          {categories.map((category) => {
            const isActive = activeCategory === category

            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`relative rounded-full px-5 py-2.5 text-sm transition ${
                  isActive
                    ? 'text-[#101010]'
                    : 'text-white/55 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute inset-0 rounded-full bg-[#d7b56d]"
                    transition={{
                      type: 'spring',
                      stiffness: 380,
                      damping: 32,
                    }}
                  />
                )}

                <span className="relative z-10">{category}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default CategoryBar
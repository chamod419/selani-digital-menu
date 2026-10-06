import { motion } from 'framer-motion'

function SpecialsSection({ items, onItemClick }) {
  const specials = items.filter((i) => i.isSpecial).slice(0, 6)
  if (specials.length === 0) return null

  return (
    <section className="pb-6">
      <h2 className="px-5 font-serif text-2xl text-[#0c2418] md:px-8 md:text-4xl mx-auto max-w-7xl">
        Today&apos;s specials
      </h2>

      <div className="no-scrollbar mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 md:px-[max(2rem,calc((100vw-80rem)/2+2rem))]">
        {specials.map((item) => (
          <motion.button
            key={item.id}
            type="button"
            onClick={() => onItemClick(item)}
            whileTap={{ scale: 0.97 }}
            className="relative h-[250px] w-[72vw] max-w-[280px] shrink-0 snap-start overflow-hidden rounded-3xl bg-gradient-to-br from-[#14432b] to-[#0c2418] text-left"
          >
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#06150d] via-[#06150d]/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <h3 className="font-serif text-[22px] leading-tight text-white">{item.name}</h3>
              <p className="mt-1 text-[15px] font-semibold text-[#9be3b6]">
                Rs. {item.price.toLocaleString()}
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  )
}

export default SpecialsSection

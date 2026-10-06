import { motion } from 'framer-motion'
import { ArrowUpRight, Sparkles } from 'lucide-react'

function SpecialsSection({ items, onItemClick }) {
  const specials = items.filter((item) => item.isSpecial).slice(0, 3)

  if (specials.length === 0) {
    return null
  }

  return (
    <section className="mx-auto max-w-7xl px-5 pb-16 md:px-8 md:pb-24">
      <div className="mb-7 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 text-[#d7b56d]">
            <Sparkles size={14} />

            <p className="text-[10px] uppercase tracking-[0.3em]">
              Handpicked for you
            </p>
          </div>

          <h2 className="mt-3 font-serif text-3xl text-white md:text-5xl">
            Today&apos;s Specials
          </h2>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {specials.map((item, index) => (
          <motion.button
            key={item.id}
            type="button"
            onClick={() => onItemClick(item)}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.5,
              delay: index * 0.08,
            }}
            className={`group relative min-h-[330px] overflow-hidden rounded-[30px] border border-white/[0.07] text-left ${
              index === 0 && specials.length >= 3
                ? 'md:row-span-2 md:min-h-[680px]'
                : ''
            }`}
          >
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                onError={(event) => {
                  event.currentTarget.style.display =
                    'none'
                }}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#2a2216] via-[#171717] to-[#090909]" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/5" />

            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#d7b56d]">
                {item.category}
              </p>

              <div className="mt-2 flex items-end justify-between gap-4">
                <div>
                  <h3 className="font-serif text-3xl leading-tight text-white">
                    {item.name}
                  </h3>

                  <p className="mt-3 text-lg font-semibold text-[#d7b56d]">
                    Rs. {item.price.toLocaleString()}
                  </p>
                </div>

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/20 text-white backdrop-blur-md transition group-hover:bg-[#d7b56d] group-hover:text-black">
                  <ArrowUpRight size={19} />
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  )
}

export default SpecialsSection
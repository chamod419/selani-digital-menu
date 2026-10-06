import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Utensils } from 'lucide-react'

function MenuCard({ item, onClick }) {
  const [imageError, setImageError] = useState(false)

  const hasImage = item.image && !imageError

  return (
    <motion.button
      type="button"
      layout
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.35 }}
      onClick={() => onClick(item)}
      className="group w-full overflow-hidden rounded-[26px] border border-white/[0.07] bg-[#111111] text-left"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#221d14] via-[#151515] to-[#090909]">
        {hasImage ? (
          <img
            src={item.image}
            alt={item.name}
            onError={() => setImageError(true)}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#d7b56d]/15 bg-[#d7b56d]/5">
                <Utensils
                  size={22}
                  className="text-[#d7b56d]/60"
                />
              </div>

              <p className="mt-4 font-serif text-xl text-[#d7b56d]/65">
                Selani
              </p>

              <p className="mt-1 text-[9px] uppercase tracking-[0.3em] text-white/20">
                Deliciously Prepared
              </p>
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {item.isPopular && (
            <span className="rounded-full bg-[#d7b56d] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-black">
              Popular
            </span>
          )}

          {item.isNew && (
            <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-black">
              New
            </span>
          )}

          {item.isSpecial && (
            <span className="rounded-full border border-white/15 bg-black/50 px-3 py-1 text-[10px] uppercase tracking-wider text-white backdrop-blur-md">
              Special
            </span>
          )}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-[#d7b56d]/75">
              {item.category}
            </p>

            <h3 className="font-serif text-2xl text-white">
              {item.name}
            </h3>
          </div>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/45 transition group-hover:border-[#d7b56d]/30 group-hover:bg-[#d7b56d] group-hover:text-black">
            <ArrowUpRight size={17} />
          </div>
        </div>

        <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/40">
          {item.description || 'Freshly prepared at Selani.'}
        </p>

        <div className="mt-5 flex items-end justify-between border-t border-white/[0.06] pt-4">
          <span className="text-xs text-white/30">
            Price
          </span>

          <p className="text-xl font-semibold text-[#d7b56d]">
            Rs. {item.price.toLocaleString()}
          </p>
        </div>
      </div>
    </motion.button>
  )
}

export default MenuCard
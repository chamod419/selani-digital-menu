import { useState } from 'react'
import { motion } from 'framer-motion'

// Compact row: text on the left, thumbnail on the right. Scannable on a phone.
function MenuCard({ item, onClick }) {
  const [imageError, setImageError] = useState(false)
  const hasImage = item.image && !imageError

  return (
    <motion.button
      type="button"
      layout="position"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -40px 0px' }}
      exit={{ opacity: 0 }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.3 }}
      onClick={() => onClick(item)}
      className="flex w-full items-stretch gap-4 rounded-2xl bg-white p-3.5 text-left shadow-[0_1px_2px_rgba(12,36,24,0.06),0_10px_24px_-16px_rgba(12,36,24,0.3)]"
    >
      <div className="flex min-w-0 flex-1 flex-col py-0.5">
        {(item.isPopular || item.isNew || item.isSpecial) && (
          <div className="mb-1.5 flex flex-wrap gap-1.5">
            {item.isPopular && <span className="rounded-md bg-[#14432b] px-2 py-0.5 text-[11px] font-semibold text-white">Popular</span>}
            {item.isNew && <span className="rounded-md bg-[#6fcf97] px-2 py-0.5 text-[11px] font-semibold text-[#0c2418]">New</span>}
            {item.isSpecial && <span className="rounded-md bg-[#e6efe4] px-2 py-0.5 text-[11px] font-semibold text-[#14432b]">Special</span>}
          </div>
        )}

        <h3 className="font-serif text-[19px] leading-snug text-[#0c2418]">{item.name}</h3>

        {item.description && (
          <p className="mt-1 line-clamp-2 text-[13px] leading-5 text-[#0c2418]/55">{item.description}</p>
        )}

        <p className="mt-auto pt-2.5 text-[17px] font-semibold text-[#14432b]">
          Rs. {item.price.toLocaleString()}
        </p>
      </div>

      <div className="relative h-[108px] w-[108px] shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[#e6efe4] to-[#cfe3d3] sm:h-[120px] sm:w-[120px]">
        {hasImage ? (
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            onError={() => setImageError(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1.5">
            <img
              src="/images/selani-logo.png"
              alt=""
              className="h-12 w-12 rounded-full object-contain opacity-60"
            />
            <span className="text-[10px] font-medium text-[#14432b]/50">Photo soon</span>
          </div>
        )}
      </div>
    </motion.button>
  )
}

export default MenuCard
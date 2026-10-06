import { useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  X,
  Flame,
  Sparkles,
  Star,
  UtensilsCrossed,
} from 'lucide-react'

function DishModal({ item, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 backdrop-blur-md md:items-center md:p-6"
    >
      <motion.div
        initial={{
          opacity: 0,
          y: 100,
          scale: 0.98,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        exit={{
          opacity: 0,
          y: 80,
          scale: 0.98,
        }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 28,
        }}
        onClick={(event) => event.stopPropagation()}
        className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-[32px] border border-white/[0.08] bg-[#101010] shadow-2xl md:max-w-4xl md:rounded-[32px]"
      >
        <div className="absolute right-4 top-4 z-20">
          <button
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white backdrop-blur-xl transition hover:bg-white hover:text-black"
            aria-label="Close"
          >
            <X size={19} />
          </button>
        </div>

        <div className="grid md:grid-cols-[1.05fr_0.95fr]">
          <div className="relative min-h-[320px] overflow-hidden bg-gradient-to-br from-[#201b13] via-[#151515] to-[#090909] md:min-h-[620px]">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="absolute inset-0 h-full w-full object-cover"
                onError={(event) => {
                  event.currentTarget.style.display =
                    'none'
                }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="font-serif text-4xl text-[#d7b56d]/60">
                    Selani
                  </p>
            
                  <p className="mt-3 text-[10px] uppercase tracking-[0.3em] text-white/20">
                    Freshly Prepared
                  </p>
                </div>
              </div>
            )}
          
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/10 md:bg-gradient-to-r md:from-transparent md:to-black/15" />
          
            <div className="absolute bottom-5 left-5 flex flex-wrap gap-2">
              {/* existing badges here */}
            </div>
          </div>

          <div className="flex flex-col justify-between p-6 sm:p-8 md:p-10">
            <div>
              <div className="flex items-center gap-2 text-[#d7b56d]">
                <UtensilsCrossed size={15} />

                <p className="text-[10px] uppercase tracking-[0.28em]">
                  {item.category}
                </p>
              </div>

              <h2 className="mt-4 font-serif text-4xl leading-tight text-white md:text-5xl">
                {item.name}
              </h2>

              <p className="mt-6 text-sm leading-7 text-white/50 md:text-[15px]">
                {item.description}
              </p>

              <div className="my-8 h-px bg-white/[0.07]" />

              <p className="text-[10px] uppercase tracking-[0.25em] text-white/25">
                Price
              </p>

              <p className="mt-2 text-3xl font-semibold text-[#d7b56d]">
                Rs. {item.price.toLocaleString()}
              </p>
            </div>

            <div className="mt-10 rounded-[22px] border border-[#d7b56d]/10 bg-[#d7b56d]/[0.04] p-5">
              <p className="font-serif text-lg text-white">
                Made fresh at Selani
              </p>

              <p className="mt-2 text-xs leading-5 text-white/35">
                Freshly prepared with carefully selected ingredients for a
                memorable dining experience.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default DishModal
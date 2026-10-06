import { useEffect } from 'react'
import { motion, useDragControls } from 'framer-motion'
import { X, Share2 } from 'lucide-react'

function DishModal({ item, onClose }) {
  const controls = useDragControls()

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const share = async () => {
    const data = { title: item.name, text: `${item.name} at Selani`, url: window.location.href }
    try {
      if (navigator.share) await navigator.share(data)
      else await navigator.clipboard.writeText(data.url)
    } catch {
      /* user cancelled */
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-end justify-center bg-[#06150d]/80 backdrop-blur-md md:items-center md:p-6"
    >
      <motion.div
        initial={{ y: 120, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        drag="y"
        dragControls={controls}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.6 }}
        onDragEnd={(_, info) => info.offset.y > 120 && onClose()}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-[32px] bg-[#f5f1e6] shadow-2xl md:max-w-4xl md:rounded-[32px]"
      >
        <div
          onPointerDown={(e) => controls.start(e)}
          className="absolute inset-x-0 top-0 z-20 flex h-8 cursor-grab touch-none justify-center pt-3 md:hidden"
        >
          <span className="h-1.5 w-12 rounded-full bg-white/70" />
        </div>

        <div className="absolute right-4 top-4 z-20 flex gap-2">
          <button
            onClick={share}
            aria-label="Share this dish"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[#0c2418] transition hover:bg-[#14432b] hover:text-white"
          >
            <Share2 size={18} />
          </button>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[#0c2418] transition hover:bg-[#14432b] hover:text-white"
          >
            <X size={19} />
          </button>
        </div>

        <div className="grid md:grid-cols-[1.05fr_0.95fr]">
          <div className="relative min-h-[320px] overflow-hidden bg-[#14432b] md:min-h-[600px]">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="absolute inset-0 h-full w-full object-cover"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            ) : (
              <img
                src="/images/selani-logo.png"
                alt="Selani"
                className="absolute left-1/2 top-1/2 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-90"
              />
            )}

            <div className="absolute bottom-5 left-5 flex flex-wrap gap-2">
              {item.isPopular && (
                <span className="rounded-full bg-[#14432b] px-3 py-1 text-xs font-semibold text-white">Popular</span>
              )}
              {item.isNew && (
                <span className="rounded-full bg-[#6fcf97] px-3 py-1 text-xs font-semibold text-[#0c2418]">New</span>
              )}
              {item.isSpecial && (
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#0c2418]">Special</span>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-between p-6 sm:p-8 md:p-10">
            <div>
              <p className="text-sm font-medium text-[#2f8f55]">{item.category}</p>
              <h2 className="mt-3 font-serif text-4xl leading-tight text-[#0c2418] md:text-5xl">
                {item.name}
              </h2>
              <p className="mt-5 text-[15px] leading-7 text-[#0c2418]/65">
                {item.description || 'Freshly prepared at Selani.'}
              </p>
            </div>

            <div className="mt-10 flex items-center justify-between rounded-2xl bg-[#14432b] p-5 text-white">
              <span className="text-sm text-white/65">Price</span>
              <span className="font-serif text-3xl">Rs. {item.price.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default DishModal

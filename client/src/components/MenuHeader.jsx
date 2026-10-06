import { motion } from 'framer-motion'

// Compact brand band: the menu starts within the first screen on a phone.
function MenuHeader() {
  return (
    <header className="relative overflow-hidden bg-[#0c2418] text-[#f5f1e6]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,rgba(47,143,85,0.4),transparent_55%)]" />
      <div className="relative mx-auto flex max-w-7xl items-center gap-4 px-5 pb-8 pt-6 md:px-8 md:pb-12 md:pt-10">
        <motion.img
          initial={{ opacity: 0, scale: 0.7, rotate: -20 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 160, damping: 16 }}
          src="/images/selani-logo.png"
          alt="Selani since 1998"
          className="h-[68px] w-[68px] rounded-full object-contain shadow-[0_10px_30px_rgba(0,0,0,0.45)] md:h-24 md:w-24"
        />
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          <h1 className="font-serif text-4xl leading-none md:text-6xl">Selani menu</h1>
          <p className="mt-2 text-sm text-white/60">Tap any dish to see it in full.</p>
        </motion.div>
      </div>
      <div className="relative h-5 rounded-t-[26px] bg-[#f5f1e6]" />
    </header>
  )
}

export default MenuHeader

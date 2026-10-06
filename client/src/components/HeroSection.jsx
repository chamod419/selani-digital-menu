import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'

function HeroSection() {
  const scrollToMenu = () =>
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })

  const words = ['Good', 'food,', 'made', 'for', 'sharing.']

  return (
    <section className="relative overflow-hidden bg-[#0c2418] text-[#f5f1e6]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,rgba(47,143,85,0.35),transparent_45%)]" />

      <div className="relative mx-auto grid min-h-[600px] max-w-7xl items-center gap-10 px-5 py-14 md:grid-cols-[1.1fr_0.9fr] md:px-8">
        <div className="max-w-xl">
          <h1 className="font-serif text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
            {words.map((word, i) => (
              <motion.span
                key={word + i}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.09 }}
                className="mr-3 inline-block"
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 max-w-md text-base leading-7 text-white/65"
          >
            Serving Sri Lanka since 1998. Browse our dishes, check prices and
            tap any item to see it up close.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            onClick={scrollToMenu}
            className="group mt-9 flex items-center gap-3 rounded-full bg-[#f5f1e6] px-7 py-4 text-sm font-semibold text-[#0c2418] transition hover:bg-white"
          >
            View the menu
            <ArrowDown
              size={16}
              className="transition-transform duration-300 group-hover:translate-y-1"
            />
          </motion.button>
        </div>

        {/* The one memorable moment: the Selani medallion with a slow rotating ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="relative mx-auto flex h-[260px] w-[260px] items-center justify-center sm:h-[340px] sm:w-[340px] md:h-[400px] md:w-[400px]"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border border-dashed border-[#6fcf97]/40"
          />
          <div className="absolute inset-5 rounded-full border border-white/10" />
          <motion.img
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            src="/images/selani-logo.png"
            alt="Selani since 1998"
            className="relative z-10 w-[68%] rounded-full object-contain shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
          />
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection

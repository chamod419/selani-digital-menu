import { motion } from 'framer-motion'
import { ArrowDown, Sparkles } from 'lucide-react'

function HeroSection() {
  const scrollToMenu = () => {
    document.getElementById('menu')?.scrollIntoView({
      behavior: 'smooth',
    })
  }

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(203,163,83,0.14),transparent_32%),radial-gradient(circle_at_20%_70%,rgba(255,255,255,0.05),transparent_25%)]" />

      <div className="absolute -right-28 top-12 h-80 w-80 rounded-full border border-[#d7b56d]/10" />
      <div className="absolute -right-16 top-24 h-56 w-56 rounded-full border border-[#d7b56d]/10" />

      <div className="relative mx-auto grid min-h-[640px] max-w-7xl items-center px-5 py-16 md:grid-cols-2 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl"
        >
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            src="/images/selani-logo.png"
            alt="Selani"
            className="mb-8 h-20 w-auto object-contain md:h-24"
          />

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d7b56d]/20 bg-[#d7b56d]/5 px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#d7b56d]">
            <Sparkles size={14} />
            Crafted for every craving
          </div>

          <h1 className="font-serif text-5xl leading-[1.05] text-white sm:text-6xl lg:text-7xl">
            Taste something
            <span className="block italic text-[#d7b56d]">
              extraordinary.
            </span>
          </h1>

          <p className="mt-7 max-w-md text-sm leading-7 text-white/55 sm:text-base">
            Explore Selani&apos;s signature dishes, guest favourites and
            freshly prepared specials — all in one place.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <button
              onClick={scrollToMenu}
              className="group flex items-center gap-3 rounded-full bg-[#d7b56d] px-6 py-3.5 text-sm font-semibold text-[#111] transition duration-300 hover:bg-[#e3c17c]"
            >
              Explore Our Menu

              <ArrowDown
                size={16}
                className="transition-transform duration-300 group-hover:translate-y-1"
              />
            </button>

            <p className="text-xs uppercase tracking-[0.18em] text-white/30">
              Fresh • Delicious • Selani
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.9,
            rotate: 3,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            rotate: 0,
          }}
          transition={{
            duration: 1,
            delay: 0.15,
          }}
          className="relative mt-14 hidden md:flex md:justify-end"
        >
          <div className="relative flex h-[390px] w-[390px] items-center justify-center rounded-full border border-[#d7b56d]/15 bg-gradient-to-br from-[#181510] via-[#111] to-[#090909] shadow-[0_30px_100px_rgba(0,0,0,0.6)]">
            <div className="absolute inset-5 rounded-full border border-white/5" />
            <div className="absolute inset-12 rounded-full border border-[#d7b56d]/10" />

            <img
              src="/images/selani-logo.png"
              alt="Selani"
              className="relative z-10 w-[190px] object-contain"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection
import { Search } from 'lucide-react'

function MenuHeader({ onSearchClick }) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#090909]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between px-5 md:px-8">
        <div className="flex items-center gap-3">
          <img
            src="/images/selani-logo.png"
            alt="Selani Hotels & Restaurants"
            className="h-11 w-auto object-contain"
          />

          <div className="hidden sm:block">
            <p className="text-[9px] uppercase tracking-[0.3em] text-white/40">
              Digital Menu
            </p>
          </div>
        </div>

        <button
          onClick={onSearchClick}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition hover:border-[#d7b56d]/40 hover:bg-[#d7b56d] hover:text-black"
          aria-label="Search menu"
        >
          <Search size={18} />
        </button>
      </div>
    </header>
  )
}

export default MenuHeader
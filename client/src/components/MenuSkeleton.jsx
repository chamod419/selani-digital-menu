function MenuSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-[26px] border border-white/[0.06] bg-[#111]"
        >
          <div className="aspect-[4/3] animate-pulse bg-white/[0.05]" />

          <div className="p-5">
            <div className="h-3 w-20 animate-pulse rounded-full bg-white/[0.06]" />

            <div className="mt-4 h-7 w-3/4 animate-pulse rounded-lg bg-white/[0.07]" />

            <div className="mt-4 h-3 w-full animate-pulse rounded-full bg-white/[0.05]" />

            <div className="mt-2 h-3 w-2/3 animate-pulse rounded-full bg-white/[0.05]" />

            <div className="mt-6 flex justify-between border-t border-white/[0.06] pt-4">
              <div className="h-3 w-12 animate-pulse rounded-full bg-white/[0.05]" />

              <div className="h-6 w-24 animate-pulse rounded-full bg-white/[0.07]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default MenuSkeleton
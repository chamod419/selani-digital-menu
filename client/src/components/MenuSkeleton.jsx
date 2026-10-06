function MenuSkeleton() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex gap-4 rounded-2xl bg-white p-3.5">
          <div className="flex-1 space-y-3 py-1">
            <div className="h-5 w-3/4 animate-pulse rounded-md bg-[#e6efe4]" />
            <div className="h-3 w-full animate-pulse rounded-full bg-[#eef3ec]" />
            <div className="h-3 w-2/3 animate-pulse rounded-full bg-[#eef3ec]" />
            <div className="h-5 w-24 animate-pulse rounded-md bg-[#e6efe4]" />
          </div>
          <div className="h-[108px] w-[108px] animate-pulse rounded-xl bg-[#e6efe4]" />
        </div>
      ))}
    </div>
  )
}

export default MenuSkeleton

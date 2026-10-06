import { useEffect, useState } from 'react'

import {
  Layers3,
  PackageCheck,
  Sparkles,
  UtensilsCrossed,
} from 'lucide-react'

import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'

function AdminDashboard() {
  const { admin } = useAuth()

  const [menuItems, setMenuItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [
          itemResponse,
          categoryResponse,
        ] = await Promise.all([
          api.get('/menu-items'),
          api.get('/categories'),
        ])

        setMenuItems(itemResponse.data.data || [])
        setCategories(categoryResponse.data.data || [])
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  const availableItems = menuItems.filter(
    (item) => item.isAvailable
  ).length

  const specialItems = menuItems.filter(
    (item) => item.isSpecial
  ).length

  const stats = [
    {
      label: 'Menu Items',
      value: menuItems.length,
      icon: UtensilsCrossed,
    },
    {
      label: 'Categories',
      value: categories.length,
      icon: Layers3,
    },
    {
      label: 'Available',
      value: availableItems,
      icon: PackageCheck,
    },
    {
      label: 'Specials',
      value: specialItems,
      icon: Sparkles,
    },
  ]

  return (
    <>
      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#d7b56d]">
          Selani Menu Management
        </p>

        <h1 className="mt-2 font-serif text-4xl text-white md:text-5xl">
          Dashboard
        </h1>

        <p className="mt-3 text-sm text-white/35">
          Welcome back, {admin?.name}.
        </p>
      </div>

      <div className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <div
              key={stat.label}
              className="rounded-[26px] border border-white/[0.07] bg-[#111] p-6"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#d7b56d]/10 text-[#d7b56d]">
                <Icon size={20} />
              </div>

              <p className="mt-6 text-sm text-white/30">
                {stat.label}
              </p>

              <p className="mt-1 text-4xl font-semibold text-white">
                {loading ? '—' : stat.value}
              </p>
            </div>
          )
        })}
      </div>

      <div className="mt-8 rounded-[28px] border border-white/[0.07] bg-[#111] p-7">
        <p className="text-[10px] uppercase tracking-[0.28em] text-[#d7b56d]">
          System Status
        </p>

        <h2 className="mt-3 font-serif text-3xl text-white">
          Digital menu is connected
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/35">
          Menu categories and food items are connected to the live
          MongoDB database. Changes made from this admin portal will
          appear on the customer menu.
        </p>
      </div>
    </>
  )
}

export default AdminDashboard
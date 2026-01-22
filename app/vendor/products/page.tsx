'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  Plus,
  Search,
  Filter,
  Loader2,
  ChevronLeft,
  ChevronRight,
  RefreshCcw,
  Dumbbell,
  Trash2,
} from 'lucide-react'
import { cn } from '@/app/lib/utils'
import Link from 'next/link'
import { useDebounce } from '@/app/vendor/hooks/useDebounce'
import { deleteProduct } from './add/actions'

export default function MyGymInventory() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  const debouncedSearch = useDebounce(searchQuery, 500)
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || 'https://api.easygear.ng/api/v1'

  // 1. FETCH CATEGORIES (Dynamic for filtering)
  useEffect(() => {
    async function getCats() {
      try {
        const res = await fetch(`${baseUrl}/categories`)
        const json = await res.json()
        if (json.success) {
          const catData = json.data?.data || json.data || []
          setCategories(catData)
        }
      } catch (e) {
        console.error('Category Sync Error', e)
      }
    }
    getCats()
  }, [baseUrl])

  // 2. FETCH INVENTORY (Live data from API)
  const fetchInventory = useCallback(
    async (page: number = 1) => {
      setLoading(true)
      try {
        const token =
          localStorage.getItem('auth_token') ||
          localStorage.getItem('easygear_token')
        const userString = localStorage.getItem('user')
        const user = userString ? JSON.parse(userString) : null

        // Dynamic ID selection based on session
        const myId = user?.vendor_id || user?.id

        if (!myId || !token) {
          setProducts([])
          setLoading(false)
          return
        }

        const params = new URLSearchParams({
          page: page.toString(),
          search: debouncedSearch,
          category_id: selectedCategory,
          vendor_id: String(myId),
          _t: Date.now().toString(), // Prevents browser caching
        })

        const res = await fetch(`${baseUrl}/products?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        })
        const json = await res.json()

        if (json.success) {
          const items = json.data?.data || json.data || []
          setProducts(items)
          setLastPage(json.data?.last_page || 1)
          setCurrentPage(json.data?.current_page || page)
        }
      } catch (err) {
        console.error('Inventory Sync Error:', err)
        setProducts([])
      } finally {
        setLoading(false)
      }
    },
    [debouncedSearch, selectedCategory, baseUrl],
  )

  /**
   * 3. HANDLE DELETE
   * Uses numeric ID to match standard Laravel 'destroy' routes.
   */
  const handleDelete = async (id: number) => {
    if (!id) return
    if (
      !confirm(
        'Are you sure you want to remove this asset from your inventory?',
      )
    )
      return

    setLoading(true)
    const res = await deleteProduct(id)

    if (res.success) {
      // Increments refreshKey to trigger the useEffect re-fetch
      setRefreshKey((prev) => prev + 1)
    } else {
      alert(res.error || 'Failed to delete asset')
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInventory(currentPage)
  }, [
    currentPage,
    debouncedSearch,
    selectedCategory,
    refreshKey,
    fetchInventory,
  ])

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, selectedCategory])

  return (
    <div className='p-6 md:p-10 max-w-7xl mx-auto relative min-h-screen'>
      {/* HEADER */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12'>
        <div>
          <h1 className='text-5xl font-black text-slate-900 italic uppercase tracking-tighter'>
            My<span className='text-orange-500'>.</span>Products
          </h1>
          <div className='flex items-center gap-4 mt-2'>
            <button
              onClick={() => setRefreshKey((k) => k + 1)}
              className='text-[9px] font-black uppercase text-slate-400 flex items-center gap-2 hover:text-orange-500 transition-colors'
            >
              <RefreshCcw size={12} className={cn(loading && 'animate-spin')} />
              Force System Sync
            </button>
          </div>
        </div>

        <Link
          href='/vendor/products/add'
          className='bg-orange-500 text-white px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-slate-900 transition-all flex items-center gap-3'
        >
          <Plus size={20} strokeWidth={3} /> Register New Product
        </Link>
      </div>

      {/* SEARCH & FILTERS */}
      <div className='bg-white p-5 rounded-4xl border-4 border-slate-100 mb-10 flex flex-col md:flex-row gap-5 shadow-sm'>
        <div className='relative flex-1 group'>
          <Search
            className='absolute left-6 top-1/2 -translate-y-1/2 text-slate-300'
            size={20}
          />
          <input
            type='text'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search live inventory...'
            className='w-full pl-16 pr-12 py-5 bg-slate-50 border-3 border-transparent rounded-2xl focus:bg-white focus:border-orange-500 outline-none font-bold text-sm transition-all'
          />
        </div>

        <div className='relative min-w-50'>
          <Filter
            className='absolute left-6 top-1/2 -translate-y-1/2 text-slate-400'
            size={16}
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className='w-full pl-14 pr-10 py-5 bg-slate-100 text-slate-600 rounded-2xl font-black text-[10px] uppercase appearance-none cursor-pointer'
          >
            <option value=''>All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className='bg-white rounded-[40px] border-4 border-slate-100 shadow-2xl overflow-hidden relative min-h-100'>
        {loading && (
          <div className='absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm'>
            <Loader2 className='animate-spin text-orange-500' size={40} />
            <p className='text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-4'>
              Syncing Vault...
            </p>
          </div>
        )}

        <div className='overflow-x-auto'>
          {products.length > 0 ? (
            <table className='w-full text-left border-collapse'>
              <thead className='bg-slate-50 border-b-2 border-slate-100'>
                <tr>
                  <th className='p-6 text-[10px] font-black uppercase text-slate-400'>
                    Asset
                  </th>
                  <th className='p-6 text-[10px] font-black uppercase text-slate-400'>
                    Category
                  </th>
                  <th className='p-6 text-[10px] font-black uppercase text-slate-400'>
                    Stock
                  </th>
                  <th className='p-6 text-[10px] font-black uppercase text-slate-400'>
                    Price
                  </th>
                  <th className='p-6 text-[10px] font-black uppercase text-slate-400 text-right'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((item) => (
                  <tr
                    key={item.id}
                    className='group hover:bg-slate-50/50 transition-all border-b border-slate-50'
                  >
                    <td className='p-6 flex items-center gap-4'>
                      <div className='w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200'>
                        <img
                          src={
                            item.image_url ||
                            item.images?.[0]?.url ||
                            '/placeholder-gym.png'
                          }
                          alt=''
                          className='w-full h-full object-cover'
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src =
                              '/placeholder-gym.png'
                          }}
                        />
                      </div>
                      <div className='flex flex-col'>
                        <span className='font-black text-slate-900 uppercase text-xs italic'>
                          {item.name}
                        </span>
                        <span className='text-[8px] text-slate-400 font-mono'>
                          {item.sku || `ID: ${item.id}`}
                        </span>
                      </div>
                    </td>
                    <td className='p-6'>
                      <span className='px-3 py-1 bg-slate-100 rounded-full text-[9px] font-black text-slate-500 uppercase'>
                        {item.category?.name || 'General'}
                      </span>
                    </td>
                    <td className='p-6 font-bold text-sm text-slate-600'>
                      {item.quantity} units
                    </td>
                    <td className='p-6 font-black text-orange-600 text-sm'>
                      ₦{Number(item.price).toLocaleString()}
                    </td>
                    <td className='p-6 text-right'>
                      <button
                        onClick={() => handleDelete(item.id)} // Using Numeric ID
                        className='p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all'
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            !loading && (
              <div className='flex flex-col items-center justify-center p-20 text-center'>
                <Dumbbell className='text-slate-100 mb-6' size={60} />
                <h3 className='text-slate-900 font-black uppercase italic text-lg'>
                  Vault Empty
                </h3>
                <p className='text-[10px] font-black uppercase text-slate-400 mt-2'>
                  Your registered products will appear here.
                </p>
                <Link
                  href='/vendor/products/add'
                  className='mt-8 text-orange-500 font-black uppercase text-[10px] tracking-widest border-b-2 border-orange-500 pb-1'
                >
                  + Add Your First Product
                </Link>
              </div>
            )
          )}
        </div>

        {/* PAGINATION */}
        {products.length > 0 && lastPage > 1 && (
          <div className='p-6 bg-slate-50 border-t-4 border-slate-100 flex items-center justify-between'>
            <button
              disabled={currentPage === 1 || loading}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className='px-6 py-3 rounded-xl bg-white border-2 border-slate-200 disabled:opacity-30'
            >
              <ChevronLeft size={16} />
            </button>
            <span className='text-[10px] font-black uppercase text-slate-400'>
              Page {currentPage} of {lastPage}
            </span>
            <button
              disabled={currentPage === lastPage || loading}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className='px-6 py-3 rounded-xl bg-white border-2 border-slate-200 disabled:opacity-30'
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

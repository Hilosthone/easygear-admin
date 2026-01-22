'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  Plus,
  Search,
  Loader2,
  RefreshCcw,
  Dumbbell,
  Trash2,
  ChevronLeft,
  ChevronRight,
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

  // 1. FETCH CATEGORIES (Based on your Category JSON)
  useEffect(() => {
    async function getCats() {
      try {
        const res = await fetch(`${baseUrl}/categories`)
        const json = await res.json()
        if (json.success) {
          // Extracts from data.data or data based on your specific JSON response
          const catData = json.data?.data || json.data || []
          setCategories(catData)
        }
      } catch (e) {
        console.error('Category Sync Error', e)
      }
    }
    getCats()
  }, [baseUrl])

  // 2. FETCH INVENTORY (Based on your Product List JSON)
  const fetchInventory = useCallback(
    async (page: number = 1) => {
      setLoading(true)
      try {
        const token =
          localStorage.getItem('auth_token') ||
          localStorage.getItem('easygear_token')
        const userString = localStorage.getItem('user')
        const user = userString ? JSON.parse(userString) : null
        const myId = user?.vendor_id || user?.id || user?.user_id

        if (!myId || !token) {
          setLoading(false)
          return
        }

        const params = new URLSearchParams({
          page: page.toString(),
          vendor: String(myId), // API expects vendor filter
          sort_by: 'created_at',
          sort_order: 'desc',
        })

        if (debouncedSearch) params.append('search', debouncedSearch)
        if (selectedCategory) params.append('category', selectedCategory)

        const res = await fetch(`${baseUrl}/products?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        })

        const json = await res.json()

        if (json.success) {
          // Map to data.data per your JSON structure
          const items = json.data?.data || []
          setProducts(items)
          setLastPage(json.data?.last_page || 1)
          setCurrentPage(json.data?.current_page || page)
        }
      } catch (err) {
        console.error('Inventory Sync Error:', err)
      } finally {
        setLoading(false)
      }
    },
    [debouncedSearch, selectedCategory, baseUrl],
  )

  useEffect(() => {
    fetchInventory(currentPage)
  }, [
    currentPage,
    debouncedSearch,
    selectedCategory,
    refreshKey,
    fetchInventory,
  ])

  const handleDelete = async (id: number) => {
    if (!confirm('Permanently remove this asset from the vault?')) return

    setLoading(true)
    const res = await deleteProduct(id)
    if (res.success) {
      setRefreshKey((prev) => prev + 1)
    } else {
      alert(res.error || 'Delete failed')
      setLoading(false)
    }
  }

  return (
    <div className='p-6 md:p-10 max-w-7xl mx-auto relative min-h-screen bg-slate-50/30'>
      {/* HEADER */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12'>
        <div>
          <h1 className='text-5xl font-black text-slate-900 italic uppercase tracking-tighter'>
            My<span className='text-orange-500'>.</span>Products
          </h1>
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className='text-[9px] font-black uppercase text-slate-400 flex items-center gap-2 hover:text-orange-500 mt-2 transition-colors'
          >
            <RefreshCcw size={12} className={cn(loading && 'animate-spin')} />
            Synchronize Local Records
          </button>
        </div>

        <Link
          href='/vendor/products/add'
          className='bg-orange-500 text-white px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-slate-900 transition-all flex items-center gap-3'
        >
          <Plus size={20} strokeWidth={3} /> Register New Asset
        </Link>
      </div>

      {/* SEARCH & FILTERS */}
      <div className='bg-white p-4 rounded-3xl border-2 border-slate-100 mb-8 flex flex-col md:flex-row gap-4 shadow-sm'>
        <div className='relative flex-1'>
          <Search
            className='absolute left-5 top-1/2 -translate-y-1/2 text-slate-300'
            size={18}
          />
          <input
            type='text'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search products by name ...'
            className='w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-orange-500 outline-none font-bold text-sm transition-all'
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value)
            setCurrentPage(1)
          }}
          className='px-6 py-4 bg-slate-50 border-2 border-transparent rounded-xl font-black text-[10px] uppercase outline-none focus:border-orange-500 cursor-pointer'
        >
          <option value=''>All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* TABLE */}
      <div className='bg-white rounded-[40px] border-4 border-slate-100 shadow-2xl overflow-hidden relative'>
        {loading && (
          <div className='absolute inset-0 z-20 flex items-center justify-center bg-white/60 backdrop-blur-[2px]'>
            <Loader2 className='animate-spin text-orange-500' size={40} />
          </div>
        )}

        <div className='overflow-x-auto'>
          <table className='w-full text-left border-collapse'>
            <thead className='bg-slate-50/50 border-b-2 border-slate-100'>
              <tr>
                <th className='p-6 text-[10px] font-black uppercase text-slate-400'>
                  Asset Details
                </th>
                <th className='p-6 text-[10px] font-black uppercase text-slate-400'>
                  Availability
                </th>
                <th className='p-6 text-[10px] font-black uppercase text-slate-400'>
                  Valuation
                </th>
                <th className='p-6 text-[10px] font-black uppercase text-slate-400 text-right'>
                  Command
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-50'>
              {products.length > 0
                ? products.map((item) => (
                    <tr
                      key={item.id}
                      className='group hover:bg-orange-50/30 transition-all'
                    >
                      <td className='p-6'>
                        <div className='flex items-center gap-4'>
                          <div className='w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden border-2 border-slate-200 shrink-0'>
                            <img
                              src={
                                item.primary_image ||
                                item.image_url ||
                                'https://api.easygear.ng/images/placeholder-product.png'
                              }
                              alt=''
                              className='w-full h-full object-cover'
                            />
                          </div>
                          <div>
                            <p className='font-black text-slate-900 uppercase text-xs italic leading-tight'>
                              {item.name}
                            </p>
                            <p className='text-[9px] text-slate-400 font-mono mt-1'>
                              {item.sku}
                            </p>
                            <div className='mt-1 px-2 py-0.5 bg-slate-100 rounded text-[8px] font-black uppercase inline-block text-slate-500'>
                              {item.category?.name || 'Uncategorized'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className='p-6'>
                        <span
                          className={cn(
                            'text-xs font-bold px-3 py-1 rounded-full uppercase tracking-tighter',
                            item.quantity > 0
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700',
                          )}
                        >
                          {item.quantity} in Stock
                        </span>
                      </td>
                      <td className='p-6'>
                        <p className='font-black text-slate-900 text-sm'>
                          {item.formatted_price ||
                            `₦${Number(item.price).toLocaleString()}`}
                        </p>
                      </td>
                      <td className='p-6 text-right'>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className='p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all'
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                : !loading && (
                    <tr>
                      <td colSpan={4} className='p-20 text-center'>
                        <Dumbbell
                          className='mx-auto text-slate-100 mb-4'
                          size={64}
                        />
                        <p className='text-slate-900 font-black uppercase italic'>
                          No Assets Found
                        </p>
                        <p className='text-[10px] text-slate-400 uppercase mt-2'>
                          Your vault is currently empty.
                        </p>
                      </td>
                    </tr>
                  )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {lastPage > 1 && (
          <div className='p-6 bg-slate-50 border-t-2 border-slate-100 flex items-center justify-between'>
            <span className='text-[10px] font-black uppercase text-slate-400'>
              Page {currentPage} of {lastPage}
            </span>
            <div className='flex gap-2'>
              <button
                disabled={currentPage === 1 || loading}
                onClick={() => setCurrentPage((p) => p - 1)}
                className='p-2 bg-white border-2 border-slate-200 rounded-xl disabled:opacity-30 hover:border-orange-500 transition-colors'
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={currentPage === lastPage || loading}
                onClick={() => setCurrentPage((p) => p + 1)}
                className='p-2 bg-white border-2 border-slate-200 rounded-xl disabled:opacity-30 hover:border-orange-500 transition-colors'
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

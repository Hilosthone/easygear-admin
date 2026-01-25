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
import Cookies from 'js-cookie'

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
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.easygear.ng/api/v1'

  // Load categories
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
        console.error('Failed to load categories:', e)
      }
    }
    getCats()
  }, [baseUrl])

  // Fetch vendor products
  const fetchInventory = useCallback(
    async (page: number = 1) => {
      setLoading(true)

      try {
        const token = Cookies.get('auth_token')

        const userString = localStorage.getItem('user')
        const user = userString ? JSON.parse(userString) : null
        const vendorId = user?.vendor_id || user?.id || user?.user_id

        if (!vendorId || !token) {
          console.warn('Missing vendor ID or auth token')
          setLoading(false)
          return
        }

        const params = new URLSearchParams({
          page: page.toString(),
          vendor: vendorId.toString(),
          sort_by: 'created_at',
          sort_order: 'desc',
        })

        if (debouncedSearch) params.append('search', debouncedSearch)
        if (selectedCategory) params.append('category_id', selectedCategory)

        const url = `${baseUrl}/vendor/products?${params.toString()}`

        const res = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        })

        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`)
        }

        const json = await res.json()

        if (json.success && json.data) {
          setProducts(json.data.data || [])
          setLastPage(json.data.last_page || 1)
          setCurrentPage(json.data.current_page || page)
        } else {
          console.warn('API response was not successful', json)
        }
      } catch (err) {
        console.error('Failed to fetch products:', err)
      } finally {
        setLoading(false)
      }
    },
    [debouncedSearch, selectedCategory, baseUrl],
  )

  useEffect(() => {
    fetchInventory(currentPage)
  }, [currentPage, debouncedSearch, selectedCategory, refreshKey, fetchInventory])

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to permanently delete this product?')) return

    // Placeholder - implement actual delete when ready
    alert('Delete functionality not yet implemented in this version.')
    // After real delete → setRefreshKey(prev => prev + 1)
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
            Refresh Products
          </button>
        </div>

        <Link
          href='/vendor/products/add'
          className='bg-orange-500 text-white px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-slate-900 transition-all flex items-center gap-3'
        >
          <Plus size={20} strokeWidth={3} /> Add New Product
        </Link>
      </div>

      {/* FILTERS */}
      <div className='bg-white p-4 rounded-3xl border-2 border-slate-100 mb-8 flex flex-col md:flex-row gap-4 shadow-sm'>
        <div className='relative flex-1'>
          <Search className='absolute left-5 top-1/2 -translate-y-1/2 text-slate-300' size={18} />
          <input
            type='text'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search by name, SKU...'
            className='w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-orange-500 outline-none font-bold text-sm transition-all'
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value)
            setCurrentPage(1)
          }}
          className='px-6 py-4 bg-slate-50 border-2 border-transparent rounded-xl font-black text-[10px] uppercase outline-none focus:border-orange-500 cursor-pointer min-w-45'
        >
          <option value=''>All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* PRODUCTS TABLE */}
      <div className='bg-white rounded-[40px] border-4 border-slate-100 shadow-2xl overflow-hidden relative'>
        {loading && (
          <div className='absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-sm'>
            <Loader2 className='animate-spin text-orange-500' size={48} />
          </div>
        )}

        <div className='overflow-x-auto'>
          <table className='w-full text-left border-collapse'>
            <thead className='bg-slate-50/70 border-b-2 border-slate-100'>
              <tr>
                <th className='p-6 text-[10px] font-black uppercase text-slate-500'>Product</th>
                <th className='p-6 text-[10px] font-black uppercase text-slate-500'>Stock</th>
                <th className='p-6 text-[10px] font-black uppercase text-slate-500'>Price</th>
                <th className='p-6 text-[10px] font-black uppercase text-slate-500 text-right'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100'>
              {products.length > 0 ? (
                products.map((item) => (
                  <tr key={item.id} className='group hover:bg-orange-50/30 transition-colors'>
                    <td className='p-6'>
                      <div className='flex items-center gap-4'>
                        <div className='w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0'>
                          <img
                            src={item.primary_image || 'https://api.easygear.ng/images/placeholder-product.png'}
                            alt={item.name}
                            className='w-full h-full object-cover'
                          />
                        </div>
                        <div>
                          <p className='font-black text-slate-900 text-sm leading-tight'>
                            {item.name}
                          </p>
                          <p className='text-[10px] text-slate-500 font-mono mt-0.5'>
                            {item.sku || '—'}
                          </p>
                          <span className='mt-1.5 inline-block px-2.5 py-0.5 bg-slate-100 rounded-full text-[9px] font-bold uppercase text-slate-600'>
                            {item.category?.name || 'No category'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className='p-6'>
                      <span
                        className={cn(
                          'inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tight',
                          item.quantity > 10
                            ? 'bg-green-100 text-green-800'
                            : item.quantity > 0
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        )}
                      >
                        {item.quantity} {item.quantity === 1 ? 'item' : 'items'}
                      </span>
                    </td>

                    <td className='p-6'>
                      <p className='font-black text-slate-900 text-base'>
                        {item.formatted_price || `₦${Number(item.price || 0).toLocaleString()}`}
                      </p>
                    </td>

                    <td className='p-6 text-right'>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className='p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors'
                        title="Delete product"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                !loading && (
                  <tr>
                    <td colSpan={4} className='p-20 text-center'>
                      <Dumbbell className='mx-auto text-slate-200 mb-6' size={72} />
                      <p className='text-slate-700 font-black uppercase text-xl tracking-wide'>
                        No Products Yet
                      </p>
                      <p className='text-slate-500 text-sm mt-2'>
                        Start by adding your first product.
                      </p>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {lastPage > 1 && (
          <div className='p-6 bg-slate-50 border-t-2 border-slate-100 flex items-center justify-between text-sm'>
            <span className='text-slate-500 font-medium'>
              Page {currentPage} of {lastPage}
            </span>
            <div className='flex gap-3'>
              <button
                disabled={currentPage === 1 || loading}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className='p-3 bg-white border border-slate-300 rounded-xl disabled:opacity-40 hover:border-orange-500 transition-colors'
              >
                <ChevronLeft size={18} />
              </button>
              <button
                disabled={currentPage === lastPage || loading}
                onClick={() => setCurrentPage((p) => p + 1)}
                className='p-3 bg-white border border-slate-300 rounded-xl disabled:opacity-40 hover:border-orange-500 transition-colors'
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
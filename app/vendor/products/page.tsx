'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Plus,
  Search,
  Loader2,
  RefreshCcw,
  Dumbbell,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Package,
  AlertCircle,
  CheckCircle2,
  Archive,
} from 'lucide-react'
import { cn } from '@/app/lib/utils'
import Link from 'next/link'
import { useDebounce } from '@/app/vendor/hooks/useDebounce'
import Cookies from 'js-cookie'
import { deleteProduct } from '../products/add/actions'

export default function MyGymInventory() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  const debouncedSearch = useDebounce(searchQuery, 500)

  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || 'https://api.easygear.ng/api/v1'
  const assetBaseUrl = 'https://api.easygear.ng'

  // Summary Logic
  const inventoryStats = useMemo(() => {
    return {
      available: products.filter((p) => p.quantity > 5).length,
      lowStock: products.filter((p) => p.quantity > 0 && p.quantity <= 5)
        .length,
      outOfStock: products.filter((p) => p.quantity === 0).length,
    }
  }, [products])

  useEffect(() => {
    async function getCats() {
      try {
        const res = await fetch(`${baseUrl}/categories`)
        const json = await res.json()
        if (json.success) setCategories(json.data?.data || json.data || [])
      } catch (e) {
        console.error('Failed to load categories:', e)
      }
    }
    getCats()
  }, [baseUrl])

  const fetchInventory = useCallback(
    async (page: number = 1) => {
      setLoading(true)
      try {
        const token = Cookies.get('auth_token')
        const userString = localStorage.getItem('user')
        const user = userString ? JSON.parse(userString) : null

        if (!token) return setLoading(false)

        const params = new URLSearchParams({
          page: page.toString(),
          sort_by: 'created_at',
          sort_order: 'desc',
          _cache: Date.now().toString(),
        })

        if (debouncedSearch) params.append('search', debouncedSearch)
        if (selectedCategory) params.append('category_id', selectedCategory)

        const res = await fetch(
          `${baseUrl}/vendor/products?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          },
        )

        const json = await res.json()
        if (json.success && json.data) {
          const fetchedProducts = Array.isArray(json.data)
            ? json.data
            : json.data.data || []
          setProducts(fetchedProducts)
          setLastPage(json.data.last_page || 1)
          setCurrentPage(json.data.current_page || page)
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
  }, [
    currentPage,
    debouncedSearch,
    selectedCategory,
    refreshKey,
    fetchInventory,
  ])

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to permanently delete this product?'))
      return
    setDeleteLoading(id)
    try {
      const result = await deleteProduct(id)
      if (result.success) setRefreshKey((prev) => prev + 1)
      else alert(result.error || 'Failed to delete product')
    } catch (err) {
      alert('A network error occurred.')
    } finally {
      setDeleteLoading(null)
    }
  }

  const getImageUrl = (path: string) => {
    if (!path) return 'https://api.easygear.ng/images/placeholder-product.png'
    if (path.startsWith('http')) return path
    return `${assetBaseUrl}/storage/${path.replace('storage/', '')}`
  }

  return (
    <div className='p-4 md:p-8 max-w-6xl mx-auto relative min-h-screen bg-white'>
      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8'>
        <div>
          <div className='flex items-center gap-2 mb-1'>
            <Package size={12} className='text-orange-500' />
            <p className='text-[8px] font-black uppercase tracking-[0.3em] text-slate-400'>
              Live Stock Status
            </p>
          </div>
          <h1 className='text-3xl font-black text-slate-900 uppercase tracking-tighter'>
            Gear<span className='text-orange-500'>.</span>Vault
          </h1>
        </div>

        <div className='flex items-center gap-3'>
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className='p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-orange-500 transition-colors'
          >
            <RefreshCcw size={16} className={cn(loading && 'animate-spin')} />
          </button>
          <Link
            href='/vendor/products/add'
            className='bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-500 transition-all flex items-center gap-2'
          >
            <Plus size={16} strokeWidth={3} /> Add Gear
          </Link>
        </div>
      </div>

      {/* Summary Sections */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8'>
        <div className='bg-emerald-50/50 border border-emerald-100 p-4 rounded-2xl'>
          <div className='flex items-center gap-2 mb-1 text-emerald-600'>
            <CheckCircle2 size={12} />
            <span className='text-[8px] font-black uppercase tracking-widest'>
              Available
            </span>
          </div>
          <p className='text-2xl font-black text-emerald-700'>
            {inventoryStats.available.toString().padStart(2, '0')}
          </p>
        </div>
        <div className='bg-amber-50/50 border border-amber-100 p-4 rounded-2xl'>
          <div className='flex items-center gap-2 mb-1 text-amber-600'>
            <AlertCircle size={12} />
            <span className='text-[8px] font-black uppercase tracking-widest'>
              Few Remaining
            </span>
          </div>
          <p className='text-2xl font-black text-amber-700'>
            {inventoryStats.lowStock.toString().padStart(2, '0')}
          </p>
        </div>
        <div className='bg-slate-50 border border-slate-100 p-4 rounded-2xl opacity-60'>
          <div className='flex items-center gap-2 mb-1 text-slate-500'>
            <Archive size={12} />
            <span className='text-[8px] font-black uppercase tracking-widest'>
              Out of Stock
            </span>
          </div>
          <p className='text-2xl font-black text-slate-700'>
            {inventoryStats.outOfStock.toString().padStart(2, '0')}
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-3 mb-6'>
        <div className='md:col-span-3 relative'>
          <Search
            className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-300'
            size={16}
          />
          <input
            type='text'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search assets...'
            className='w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/10 outline-none font-bold text-xs transition-all'
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value)
            setCurrentPage(1)
          }}
          className='px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-black text-[9px] uppercase outline-none cursor-pointer'
        >
          <option value=''>All Gear</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Inventory Table */}
      <div className='bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden relative'>
        {loading && (
          <div className='absolute inset-0 z-20 flex items-center justify-center bg-white/60 backdrop-blur-[2px]'>
            <Loader2 className='animate-spin text-orange-500' size={32} />
          </div>
        )}

        <div className='overflow-x-auto'>
          <table className='w-full text-left'>
            <thead className='bg-slate-50/50 border-b border-slate-100'>
              <tr>
                <th className='p-4 text-[9px] font-black uppercase text-slate-400 tracking-widest'>
                  Asset Detail
                </th>
                <th className='p-4 text-[9px] font-black uppercase text-slate-400 tracking-widest'>
                  Status
                </th>
                <th className='p-4 text-[9px] font-black uppercase text-slate-400 tracking-widest'>
                  Rate
                </th>
                <th className='p-4 text-[9px] font-black uppercase text-slate-400 tracking-widest text-right'>
                  Op
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-50'>
              {products.length > 0
                ? products.map((item) => (
                    <tr
                      key={item.id}
                      className='group hover:bg-slate-50/50 transition-colors'
                    >
                      <td className='p-4'>
                        <div className='flex items-center gap-3'>
                          <div className='w-10 h-10 rounded-lg bg-slate-100 overflow-hidden border border-slate-100 shrink-0'>
                            <img
                              src={getImageUrl(
                                item.primary_image || item.image_url,
                              )}
                              alt={item.name}
                              className='w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all'
                            />
                          </div>
                          <div>
                            <p className='font-black text-slate-900 text-[11px] uppercase tracking-tighter leading-none'>
                              {item.name}
                            </p>
                            <p className='text-[8px] text-slate-400 font-mono mt-1'>
                              {item.sku || 'NO-SKU'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className='p-4'>
                        {item.quantity === 0 ? (
                          <span className='px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter bg-red-50 text-red-600'>
                            Out of Stock
                          </span>
                        ) : item.quantity <= 5 ? (
                          <div className='flex flex-col'>
                            <span className='px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter bg-amber-50 text-amber-600 w-fit'>
                              Few Remaining
                            </span>
                            <span className='text-[7px] font-bold text-amber-400 uppercase mt-1 px-2'>
                              {item.quantity} Units Left
                            </span>
                          </div>
                        ) : (
                          <div className='flex flex-col'>
                            <span className='px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter bg-emerald-50 text-emerald-600 w-fit'>
                              Available
                            </span>
                            <span className='text-[7px] font-bold text-emerald-400 uppercase mt-1 px-2'>
                              {item.quantity} In Stock
                            </span>
                          </div>
                        )}
                      </td>
                      <td className='p-4'>
                        <p className='font-black text-slate-900 text-xs'>
                          {item.formatted_price ||
                            `₦${Number(item.price).toLocaleString()}`}
                        </p>
                      </td>
                      <td className='p-4 text-right'>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deleteLoading === item.id}
                          className='text-slate-300 hover:text-red-500 p-2 transition-colors'
                        >
                          {deleteLoading === item.id ? (
                            <Loader2 size={14} className='animate-spin' />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                : !loading && (
                    <tr>
                      <td colSpan={4} className='py-20 text-center'>
                        <div className='flex flex-col items-center opacity-40'>
                          <Dumbbell
                            className='mb-4 text-slate-300'
                            size={40}
                            strokeWidth={1}
                          />
                          <p className='text-[10px] font-black uppercase tracking-[0.2em]'>
                            Warehouse Empty
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {lastPage > 1 && (
          <div className='p-4 border-t border-slate-50 flex items-center justify-between bg-white'>
            <span className='text-[8px] font-black text-slate-400 uppercase'>
              Page {currentPage}/{lastPage}
            </span>
            <div className='flex gap-1'>
              <button
                disabled={currentPage === 1 || loading}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className='p-2 bg-slate-50 rounded-lg hover:bg-orange-500 hover:text-white disabled:opacity-20 transition-all'
              >
                <ChevronLeft size={14} />
              </button>
              <button
                disabled={currentPage === lastPage || loading}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className='p-2 bg-slate-50 rounded-lg hover:bg-orange-500 hover:text-white disabled:opacity-20 transition-all'
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
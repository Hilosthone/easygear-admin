'use client'

import React, { useState, useEffect, useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { createProduct } from './actions'
import {
  Upload,
  Dumbbell,
  Layers,
  DollarSign,
  Loader2,
  ArrowLeft,
  Hash,
  CheckCircle2,
  Package,
  Type,
} from 'lucide-react'
import Link from 'next/link'

interface Category {
  id: number
  name: string
}

export default function AddProductPage() {
  const router = useRouter()
  // 1. Hook into the Server Action state
  const [state, formAction, isPending] = useActionState(createProduct, null)

  const [categories, setCategories] = useState<Category[]>([])
  const [catLoading, setCatLoading] = useState(true)
  const [preview, setPreview] = useState<string | null>(null)
  const [vendorId, setVendorId] = useState<string>('')

  useEffect(() => {
    const userString = localStorage.getItem('user')
    if (userString) {
      try {
        const user = JSON.parse(userString)
        const id = user.vendor_id || user.id || user.user_id
        if (id) setVendorId(id.toString())
      } catch (err) {
        console.error('❌ Session Parse Error', err)
      }
    }

    async function fetchCats() {
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || 'https://api.easygear.ng/api/v1'
        const res = await fetch(`${baseUrl}/categories`)
        const json = await res.json()
        if (json.success) {
          // Normalize the data based on your specific JSON structure
          const data = json.data?.data || json.data || []
          setCategories(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        console.error('Failed to load categories', err)
      } finally {
        setCatLoading(false)
      }
    }
    fetchCats()
  }, [])

  // 2. REDIRECT LOGIC
  useEffect(() => {
    if (state?.success) {
      const timer = setTimeout(() => {
        router.push('/vendor/products')
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [state, router])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setPreview(URL.createObjectURL(file))
  }

  return (
    <div className='p-6 md:p-10 max-w-4xl mx-auto relative min-h-screen bg-slate-50/50'>
      {/* 3. DYNAMIC NOTIFICATIONS */}
      {state?.error && (
        <div className='mb-6 p-4 bg-white border-l-8 border-red-500 text-red-600 rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center gap-4 shadow-xl shadow-red-500/10 animate-in slide-in-from-top-4'>
          <div className='bg-red-500 text-white rounded-full p-1.5 shrink-0'>
            <Hash size={12} strokeWidth={4} />
          </div>
          <span className='flex-1'>{state.error}</span>
        </div>
      )}

      {state?.success && (
        <div className='mb-6 p-5 bg-green-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-between shadow-2xl shadow-green-500/20 animate-in zoom-in-95 duration-300'>
          <div className='flex items-center gap-3'>
            <CheckCircle2 size={24} />
            <span>Product Vaulted Successfully! Redirecting...</span>
          </div>
          <Loader2 className='animate-spin' size={20} />
        </div>
      )}

      <Link
        href='/vendor/products'
        className='flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-orange-500 mb-8 transition-all'
      >
        <ArrowLeft size={14} strokeWidth={3} /> Back to My Vault
      </Link>

      <div className='mb-10'>
        <h1 className='text-5xl font-black text-slate-900 italic uppercase tracking-tighter'>
          Register<span className='text-orange-500'>.</span>Asset
        </h1>
        <p className='text-slate-400 font-bold uppercase tracking-[0.3em] text-[9px] mt-2'>
          Authorized Vendor ID:{' '}
          <span className='text-orange-600'>
            {vendorId || 'AUTHENTICATING...'}
          </span>
        </p>
      </div>

      <form
        action={formAction}
        className='bg-white rounded-[40px] border-4 border-slate-100 shadow-2xl p-8 md:p-12 space-y-8'
      >
        <input type='hidden' name='vendor_id' value={vendorId} />

        <div className='grid grid-cols-1 lg:grid-cols-12 gap-10'>
          {/* LEFT COLUMN: IMAGE */}
          <div className='lg:col-span-5'>
            <div className='relative group aspect-square bg-slate-50 rounded-4xl border-4 border-dashed border-slate-100 flex items-center justify-center overflow-hidden transition-all hover:border-orange-500/30 cursor-pointer shadow-inner'>
              <input
                type='file'
                name='images[]'
                onChange={handleImageChange}
                className='absolute inset-0 opacity-0 cursor-pointer z-10'
                accept='image/*'
                required
              />
              {preview ? (
                <img
                  src={preview}
                  className='w-full h-full object-cover'
                  alt='Preview'
                />
              ) : (
                <div className='flex flex-col items-center text-slate-300 group-hover:text-orange-500 transition-colors'>
                  <Upload size={48} strokeWidth={3} />
                  <span className='text-[9px] font-black uppercase mt-4 tracking-[0.2em]'>
                    Add Master Visual
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: CORE DETAILS */}
          <div className='lg:col-span-7 space-y-6'>
            <div className='space-y-2'>
              <label className='text-[10px] font-black uppercase text-slate-400 ml-2'>
                Equipment Name
              </label>
              <div className='relative'>
                <Dumbbell
                  className='absolute left-5 top-1/2 -translate-y-1/2 text-slate-300'
                  size={18}
                />
                <input
                  name='name'
                  required
                  placeholder='e.g., Pro-Grip Dumbbell'
                  className='w-full pl-14 pr-6 py-5 bg-slate-50 rounded-2xl border-3 border-transparent focus:border-orange-500 focus:bg-white outline-none font-bold text-sm transition-all'
                />
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <label className='text-[10px] font-black uppercase text-slate-400 ml-2'>
                  Product SKU
                </label>
                <div className='relative'>
                  <Hash
                    className='absolute left-5 top-1/2 -translate-y-1/2 text-slate-300'
                    size={18}
                  />
                  <input
                    name='sku'
                    required
                    placeholder='EG-100'
                    className='w-full pl-14 pr-6 py-5 bg-slate-50 rounded-2xl border-3 border-transparent focus:border-orange-500 focus:bg-white outline-none font-bold text-sm'
                  />
                </div>
              </div>
              <div className='space-y-2'>
                <label className='text-[10px] font-black uppercase text-slate-400 ml-2'>
                  Category
                </label>
                <div className='relative'>
                  <Layers
                    className='absolute left-5 top-1/2 -translate-y-1/2 text-slate-300'
                    size={18}
                  />
                  <select
                    name='category_id'
                    required
                    disabled={catLoading}
                    className='w-full pl-14 pr-10 py-5 bg-slate-50 rounded-2xl border-3 border-transparent focus:border-orange-500 focus:bg-white outline-none font-bold text-sm appearance-none cursor-pointer'
                  >
                    <option value=''>Select...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: PRICING & STOCK */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='space-y-2'>
            <label className='text-[10px] font-black uppercase text-slate-400 ml-2'>
              Price (₦)
            </label>
            <div className='relative'>
              <DollarSign
                className='absolute left-5 top-1/2 -translate-y-1/2 text-slate-300'
                size={18}
              />
              <input
                name='price'
                type='number'
                required
                className='w-full pl-14 pr-6 py-5 bg-slate-50 rounded-2xl border-3 border-transparent focus:border-orange-500 focus:bg-white outline-none font-bold text-sm'
              />
            </div>
          </div>

          <div className='space-y-2'>
            <label className='text-[10px] font-black uppercase text-slate-400 ml-2'>
              In-Stock Quantity
            </label>
            <div className='relative'>
              <Package
                className='absolute left-5 top-1/2 -translate-y-1/2 text-slate-300'
                size={18}
              />
              <input
                name='quantity'
                type='number'
                defaultValue='1'
                required
                className='w-full pl-14 pr-6 py-5 bg-slate-50 rounded-2xl border-3 border-transparent focus:border-orange-500 focus:bg-white outline-none font-bold text-sm'
              />
            </div>
          </div>

          <div className='space-y-2'>
            <label className='text-[10px] font-black uppercase text-slate-400 ml-2'>
              Summary
            </label>
            <div className='relative'>
              <Type
                className='absolute left-5 top-1/2 -translate-y-1/2 text-slate-300'
                size={18}
              />
              <input
                name='short_description'
                placeholder='Brief tagline'
                className='w-full pl-14 pr-6 py-5 bg-slate-50 rounded-2xl border-3 border-transparent focus:border-orange-500 focus:bg-white outline-none font-bold text-sm'
              />
            </div>
          </div>
        </div>

        <div className='space-y-2'>
          <label className='text-[10px] font-black uppercase text-slate-400 ml-2'>
            Full Product Intelligence (Description)
          </label>
          <textarea
            name='description'
            rows={4}
            required
            className='w-full p-8 bg-slate-50 rounded-4xl border-3 border-transparent focus:border-orange-500 focus:bg-white outline-none font-bold text-sm resize-none transition-all'
            placeholder='Detail technical specs, material, and usage instructions...'
          />
        </div>

        <button
          disabled={isPending || !vendorId}
          type='submit'
          className='bg-orange-500 text-white w-full py-7 rounded-4xl font-black uppercase tracking-[0.3em] text-xs shadow-2xl shadow-orange-500/40 hover:bg-slate-900 hover:shadow-none transition-all flex items-center justify-center gap-4 disabled:opacity-50 group'
        >
          {isPending ? (
            <Loader2 className='animate-spin' size={24} />
          ) : (
            <>
              Add Product
              <CheckCircle2
                size={18}
                className='group-hover:scale-125 transition-transform'
              />
            </>
          )}
        </button>
      </form>
    </div>
  )
}

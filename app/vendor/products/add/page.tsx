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
  AlignLeft,
} from 'lucide-react'
import Link from 'next/link'

interface Category {
  id: number
  name: string
}

export default function AddProductPage() {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(createProduct, null)

  const [categories, setCategories] = useState<Category[]>([])
  const [catLoading, setCatLoading] = useState(true)
  const [preview, setPreview] = useState<string | null>(null)
  const [vendorId, setVendorId] = useState<string>('')

  // 1. ROBUST VENDOR ID RETRIEVAL
  useEffect(() => {
    const userString = localStorage.getItem('user')
    if (userString) {
      try {
        const user = JSON.parse(userString)
        // Check all common ID variants to ensure we don't get an empty string
        const id = user.vendor_id || user.id || user.user_id
        if (id) {
          setVendorId(id.toString())
          console.log('✅ Vendor ID locked:', id)
        } else {
          console.warn(
            '⚠️ User found but no ID field (id, vendor_id, or user_id) exists.',
          )
        }
      } catch (err) {
        console.error('❌ Failed to parse user data from localStorage', err)
      }
    }

    async function fetchCats() {
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || 'https://api.easygear.ng/api/v1'
        const res = await fetch(`${baseUrl}/categories`)
        const json = await res.json()
        if (json.success) {
          // Handles both direct arrays and nested data objects
          setCategories(json.data?.data || json.data || [])
        }
      } catch (err) {
        console.error('Failed to load categories', err)
      } finally {
        setCatLoading(false)
      }
    }
    fetchCats()
  }, [])

  // 2. SUCCESS REDIRECTION logic
  useEffect(() => {
    if (state?.success) {
      const timer = setTimeout(() => router.push('/vendor/products'), 2000)
      return () => clearTimeout(timer)
    }
  }, [state, router])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setPreview(URL.createObjectURL(file))
  }

  return (
    <div className='p-6 md:p-10 max-w-3xl mx-auto relative min-h-screen'>
      {/* ERROR MESSAGE DISPLAY */}
      {state?.error && (
        <div className='mb-6 p-4 bg-red-50 border-2 border-red-200 text-red-600 rounded-2xl font-bold text-xs uppercase tracking-widest'>
          ⚠️ {state.error}
        </div>
      )}

      {/* SUCCESS MESSAGE DISPLAY */}
      {state?.success && (
        <div className='mb-6 p-4 bg-green-50 border-2 border-green-200 text-green-600 rounded-2xl font-bold text-xs uppercase tracking-widest'>
          ✅ Product Registered Successfully! Redirecting...
        </div>
      )}

      <Link
        href='/vendor/products'
        className='flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-orange-500 mb-8 transition-all'
      >
        <ArrowLeft size={14} /> Back to My Products
      </Link>

      <div className='mb-10'>
        <h1 className='text-4xl font-black text-slate-900 italic uppercase tracking-tighter'>
          Register<span className='text-orange-500'>.</span>Product
        </h1>
        <p className='text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2'>
          Vaulting New Equipment for Sale
        </p>
      </div>

      <form
        action={formAction}
        className='bg-white rounded-[40px] border-4 border-slate-100 shadow-2xl p-8 space-y-6'
      >
        {/* CRITICAL: HIDDEN ID FIELD */}
        <input type='hidden' name='vendor_id' value={vendorId} />
        <input type='hidden' name='status' value='active' />
        <input type='hidden' name='is_featured' value='0' />

        {/* Image Upload */}
        <div className='relative group h-44 bg-slate-50 rounded-4xl border-4 border-dashed border-slate-100 flex items-center justify-center overflow-hidden transition-all hover:border-orange-500/30 cursor-pointer'>
          <input
            type='file'
            name='images[]'
            onChange={handleImageChange}
            className='absolute inset-0 opacity-0 cursor-pointer z-10'
            accept='image/*'
          />
          {preview ? (
            <img
              src={preview}
              className='w-full h-full object-cover'
              alt='Preview'
            />
          ) : (
            <div className='flex flex-col items-center text-slate-400 group-hover:text-orange-500 transition-colors'>
              <Upload size={32} />
              <span className='text-[10px] font-black uppercase mt-2 tracking-widest'>
                Upload product image
              </span>
            </div>
          )}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Name */}
          <div className='space-y-2'>
            <label className='text-[10px] font-black uppercase text-slate-400 ml-2'>
              Equipment Name
            </label>
            <div className='relative'>
              <Dumbbell
                className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-300'
                size={18}
              />
              <input
                name='name'
                placeholder='e.g. Scuba Regulator'
                required
                className='w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-3 border-transparent focus:border-orange-500 focus:bg-white outline-none font-bold text-sm transition-all'
              />
            </div>
          </div>

          {/* SKU */}
          <div className='space-y-2'>
            <label className='text-[10px] font-black uppercase text-slate-400 ml-2'>
              Product SKU
            </label>
            <div className='relative'>
              <Hash
                className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-300'
                size={18}
              />
              <input
                name='sku'
                placeholder='EG-100-PRO'
                required
                className='w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-3 border-transparent focus:border-orange-500 focus:bg-white outline-none font-bold text-sm transition-all'
              />
            </div>
          </div>

          {/* Category */}
          <div className='space-y-2'>
            <label className='text-[10px] font-black uppercase text-slate-400 ml-2'>
              Category
            </label>
            <div className='relative'>
              <Layers
                className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-300'
                size={18}
              />
              <select
                name='category_id'
                required
                disabled={catLoading}
                className='w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-3 border-transparent focus:border-orange-500 focus:bg-white outline-none font-bold text-sm transition-all appearance-none cursor-pointer'
              >
                <option value=''>Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price */}
          <div className='space-y-2'>
            <label className='text-[10px] font-black uppercase text-slate-400 ml-2'>
              Price (₦)
            </label>
            <div className='relative'>
              <DollarSign
                className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-300'
                size={18}
              />
              <input
                name='price'
                type='number'
                placeholder='0.00'
                required
                className='w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-3 border-transparent focus:border-orange-500 focus:bg-white outline-none font-bold text-sm transition-all'
              />
            </div>
          </div>
        </div>

        {/* Short Description */}
        <div className='space-y-2'>
          <label className='text-[10px] font-black uppercase text-slate-400 ml-2'>
            Short Summary
          </label>
          <div className='relative'>
            <AlignLeft
              className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-300'
              size={18}
            />
            <input
              name='short_description'
              placeholder='Brief one-liner description'
              required
              className='w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-3 border-transparent focus:border-orange-500 focus:bg-white outline-none font-bold text-sm transition-all'
            />
          </div>
        </div>

        {/* Full Description */}
        <div className='space-y-2'>
          <label className='text-[10px] font-black uppercase text-slate-400 ml-2'>
            Full Description
          </label>
          <textarea
            name='description'
            rows={3}
            required
            className='w-full p-6 bg-slate-50 rounded-3xl border-3 border-transparent focus:border-orange-500 focus:bg-white outline-none font-bold text-sm transition-all resize-none'
            placeholder='Provide all technical specifications...'
          ></textarea>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
          <div className='space-y-1'>
            <label className='text-[9px] font-black text-slate-400 uppercase'>
              Stock Qty
            </label>
            <input
              name='quantity'
              type='number'
              placeholder='0'
              className='w-full p-3 bg-slate-50 rounded-xl border-2 border-transparent focus:border-orange-500 outline-none text-xs font-bold'
            />
          </div>
          <div className='space-y-1'>
            <label className='text-[9px] font-black text-slate-400 uppercase'>
              Weight (kg)
            </label>
            <input
              name='weight'
              placeholder='0.0'
              className='w-full p-3 bg-slate-50 rounded-xl border-2 border-transparent focus:border-orange-500 outline-none text-xs font-bold'
            />
          </div>
          <div className='space-y-1'>
            <label className='text-[9px] font-black text-slate-400 uppercase'>
              Dimensions
            </label>
            <input
              name='dimensions'
              placeholder='LxWxH'
              className='w-full p-3 bg-slate-50 rounded-xl border-2 border-transparent focus:border-orange-500 outline-none text-xs font-bold'
            />
          </div>
        </div>

        <button
          disabled={isPending || !vendorId}
          type='submit'
          className='bg-orange-500 text-white w-full py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
        >
          {isPending ? (
            <Loader2 className='animate-spin' />
          ) : (
            'Register Product'
          )}
        </button>

        {!vendorId && (
          <p className='text-center text-red-500 text-[9px] font-black uppercase'>
            Error: Session Missing. Please Login Again.
          </p>
        )}
      </form>
    </div>
  )
}
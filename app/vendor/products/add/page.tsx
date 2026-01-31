'use client'

import React, { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
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
  Weight,
  Ruler,
  X,
} from 'lucide-react'
import Link from 'next/link'

interface Category {
  id: number
  name: string
}

export default function AddProductPage() {
  const router = useRouter()

  const [categories, setCategories] = useState<Category[]>([])
  const [catLoading, setCatLoading] = useState(true)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [vendorId, setVendorId] = useState<string>('')

  const [isPending, setIsPending] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  useEffect(() => {
    // Get vendor ID from localStorage
    const userString = localStorage.getItem('user')
    if (userString) {
      try {
        const user = JSON.parse(userString)
        const id = user.vendor_id || user.id || user.user_id
        if (id) setVendorId(id.toString())
      } catch (err) {
        console.error('Session Parse Error:', err)
      }
    }

    // Load categories
    async function fetchCats() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.easygear.ng/api/v1'
        const res = await fetch(`${baseUrl}/categories`)
        const json = await res.json()
        if (json.success) {
          const data = json.data?.data || json.data || []
          setCategories(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        console.error('Failed to load categories:', err)
      } finally {
        setCatLoading(false)
      }
    }
    fetchCats()
  }, [])

  // Auto-redirect after success
  useEffect(() => {
    if (submitSuccess) {
      const timer = setTimeout(() => {
        router.push('/vendor/products')
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [submitSuccess, router])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return

    const newFiles = Array.from(e.target.files)
    const totalAfterAdd = imageFiles.length + newFiles.length

    if (totalAfterAdd > 5) {
      alert(`You can upload maximum 5 images. Currently selected: ${imageFiles.length}`)
      return
    }

    const newPreviews = newFiles.map(file => URL.createObjectURL(file))

    setImageFiles(prev => [...prev, ...newFiles])
    setPreviews(prev => [...prev, ...newPreviews])
  }

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index))
    setPreviews(prev => {
      URL.revokeObjectURL(prev[index])
      return prev.filter((_, i) => i !== index)
    })
  }

  // Cleanup object URLs when component unmounts or previews change
  useEffect(() => {
    return () => {
      previews.forEach(url => URL.revokeObjectURL(url))
    }
  }, [previews])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (imageFiles.length === 0) {
      setSubmitError('Please upload at least one product image')
      return
    }

    setIsPending(true)
    setSubmitError(null)
    setSubmitSuccess(false)

    try {
      const formData = new FormData()

      // Collect all non-file fields
      const formElements = e.currentTarget.elements
      for (const el of formElements) {
        const input = el as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        if (input.name && input.type !== 'file') {
          if (input.type === 'checkbox') {
            if ((input as HTMLInputElement).checked) {
              formData.append(input.name, '1')
            }
          } else if (input.value) {
            formData.append(input.name, input.value)
          }
        }
      }

      // Append images as array
      imageFiles.forEach(file => {
        formData.append('images[]', file)
        // If your backend expects just "images" without [], try:
        // formData.append('images', file)
      })

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.easygear.ng/api/v1'
      const endpoint = `${baseUrl}/vendor/products`

      const token = Cookies.get('auth_token')

      const headers: Record<string, string> = {}
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: formData,
      })

      if (!response.ok) {
        let errorMessage = `Server error (${response.status})`
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorData.error || errorMessage
          console.log('Backend error response:', errorData)
        } catch {}
        throw new Error(errorMessage)
      }

      const result = await response.json()

      if (result.success || result.data || result.message?.toLowerCase().includes('success')) {
        setSubmitSuccess(true)
      } else {
        throw new Error(result.message || 'Failed to create product')
      }
    } catch (err: any) {
      console.error('Product creation failed:', err)
      setSubmitError(err.message || 'Failed to add product. Please try again.')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto relative min-h-screen bg-slate-50/50">
      {submitError && (
        <div className="mb-6 p-4 bg-white border-l-8 border-red-500 text-red-600 rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center gap-4 shadow-xl shadow-red-500/10 animate-in slide-in-from-top-4">
          <div className="bg-red-500 text-white rounded-full p-1.5 shrink-0">
            <Hash size={12} strokeWidth={4} />
          </div>
          <span className="flex-1">{submitError}</span>
        </div>
      )}

      {submitSuccess && (
        <div className="mb-6 p-5 bg-green-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-between shadow-2xl shadow-green-500/20 animate-in zoom-in-95 duration-300">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={24} />
            <span>Product saved Successfully! Redirecting...</span>
          </div>
          <Loader2 className="animate-spin" size={20} />
        </div>
      )}

      <Link
        href="/vendor/products"
        className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-orange-500 mb-8 transition-all"
      >
        <ArrowLeft size={14} strokeWidth={3} /> Back to My Products
      </Link>

      <div className="mb-10">
        <h1 className="text-5xl font-black text-slate-900 italic uppercase tracking-tighter">
          Register<span className="text-orange-500">.</span>Products
        </h1>
        <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[9px] mt-2">
          Authorized Vendor ID:{' '}
          <span className="text-orange-600">{vendorId || 'AUTHENTICATING...'}</span>
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-[40px] border-4 border-slate-100 shadow-2xl p-8 md:p-12 space-y-8"
      >
        <input type="hidden" name="vendor_id" value={vendorId} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Images Section */}
          <div className="lg:col-span-5">
            <div className="space-y-4">
              {/* Previews */}
              {previews.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {previews.map((src, idx) => (
                    <div
                      key={idx}
                      className="relative group rounded-2xl overflow-hidden shadow-md border border-slate-200"
                    >
                      <img
                        src={src}
                        alt={`Product preview ${idx + 1}`}
                        className="w-full aspect-square object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1.5 right-1.5 bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload area - only show if under limit */}
              {previews.length < 5 && (
                <label className="relative group aspect-square bg-slate-50 rounded-4xl border-4 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-orange-400 transition-colors shadow-inner">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    disabled={isPending}
                  />
                  <Upload size={48} strokeWidth={2.5} className="text-slate-400 group-hover:text-orange-500 transition-colors" />
                  <span className="mt-4 text-[11px] font-bold uppercase tracking-wide text-slate-500 group-hover:text-orange-600">
                    {previews.length === 0 ? 'Upload Product Images' : 'Add More Images'}
                  </span>
                  <span className="mt-1.5 text-xs text-slate-400">
                    {previews.length} / 5
                  </span>
                </label>
              )}
            </div>
          </div>

          {/* Main Fields */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                Equipment Name
              </label>
              <div className="relative">
                <Dumbbell className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  name="name"
                  required
                  placeholder="e.g., Pro-Grip Dumbbell Set"
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 rounded-2xl border-3 border-transparent focus:border-orange-500 focus:bg-white outline-none font-bold text-sm transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">SKU</label>
                <div className="relative">
                  <Hash className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input
                    name="sku"
                    required
                    placeholder="EG-100"
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 rounded-2xl border-3 border-transparent focus:border-orange-500 focus:bg-white outline-none font-bold text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Category</label>
                <div className="relative">
                  <Layers className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <select
                    name="category_id"
                    required
                    disabled={catLoading}
                    className="w-full pl-14 pr-10 py-5 bg-slate-50 rounded-2xl border-3 border-transparent focus:border-orange-500 focus:bg-white outline-none font-bold text-sm appearance-none cursor-pointer"
                  >
                    <option value="">Select category...</option>
                    {categories.map(cat => (
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Price (₦)</label>
            <div className="relative">
              <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input
                name="price"
                type="number"
                step="0.01"
                required
                placeholder="5000"
                className="w-full pl-14 pr-6 py-5 bg-slate-50 rounded-2xl border-3 border-transparent focus:border-orange-500 focus:bg-white outline-none font-bold text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Stock Quantity</label>
            <div className="relative">
              <Package className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input
                name="quantity"
                type="number"
                min="0"
                defaultValue="1"
                required
                className="w-full pl-14 pr-6 py-5 bg-slate-50 rounded-2xl border-3 border-transparent focus:border-orange-500 focus:bg-white outline-none font-bold text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Weight (kg)</label>
            <div className="relative">
              <Weight className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input
                name="weight"
                type="number"
                step="0.01"
                placeholder="0.5"
                className="w-full pl-14 pr-6 py-5 bg-slate-50 rounded-2xl border-3 border-transparent focus:border-orange-500 focus:bg-white outline-none font-bold text-sm"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Dimensions</label>
            <div className="relative">
              <Ruler className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input
                name="dimensions"
                placeholder="10×5×3 cm"
                className="w-full pl-14 pr-6 py-5 bg-slate-50 rounded-2xl border-3 border-transparent focus:border-orange-500 focus:bg-white outline-none font-bold text-sm"
              />
            </div>
          </div>

          <div className="space-y-2 flex flex-col justify-end">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Status</label>
            <select
              name="status"
              defaultValue="active"
              className="w-full pl-14 pr-10 py-5 bg-slate-50 rounded-2xl border-3 border-transparent focus:border-orange-500 focus:bg-white outline-none font-bold text-sm appearance-none cursor-pointer"
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-[10px] font-black uppercase text-slate-400">Featured Product?</label>
          <input type="checkbox" name="is_featured" value="1" className="w-5 h-5 accent-orange-500" />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Short Summary</label>
          <div className="relative">
            <Type className="absolute left-5 top-5 text-slate-300" size={18} />
            <input
              name="short_description"
              placeholder="Brief tagline or marketing summary"
              className="w-full pl-14 pr-6 py-5 bg-slate-50 rounded-2xl border-3 border-transparent focus:border-orange-500 focus:bg-white outline-none font-bold text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
            Full Product Description
          </label>
          <textarea
            name="description"
            rows={6}
            required
            className="w-full p-8 bg-slate-50 rounded-4xl border-3 border-transparent focus:border-orange-500 focus:bg-white outline-none font-bold text-sm resize-none transition-all"
            placeholder="Technical specifications, materials, dimensions, usage instructions, warranty info..."
          />
        </div>

        <button
          disabled={isPending || !vendorId || imageFiles.length === 0}
          type="submit"
          className="bg-orange-500 text-white w-full py-7 rounded-4xl font-black uppercase tracking-[0.3em] text-xs shadow-2xl shadow-orange-500/40 hover:bg-slate-900 hover:shadow-none transition-all flex items-center justify-center gap-4 disabled:opacity-50 group mt-8"
        >
          {isPending ? (
            <Loader2 className="animate-spin" size={24} />
          ) : (
            <>
              Add Product
              <CheckCircle2 size={18} className="group-hover:scale-125 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  )
}
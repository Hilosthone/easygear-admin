'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Boxes,
  ChevronRight,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  RefreshCcw,
  UserCircle,
  Phone,
  MapPin,
  AtSign,
  Tag,
  Terminal,
  Search,
} from 'lucide-react'

export default function VendorManagementPage() {
  const [vendors, setVendors] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVendor, setSelectedVendor] = useState<any | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [rawLog, setRawLog] = useState<string>('System initialized...')

  const API_URL = 'https://api.easygear.ng/api/v1'

  const logger = (msg: string, data?: any) => {
    console.log(`[DEBUG] ${msg}`, data || '')
    setRawLog((prev) => `> ${msg}\n${prev}`.slice(0, 500))
  }

  const fetchData = useCallback(async () => {
    setLoading(true)
    logger('Syncing Registry Database...')
    try {
      const pRes = await fetch(`${API_URL}/products`)
      const pJson = await pRes.json()
      const allProducts = pJson.data?.data || pJson.data || []
      setProducts(allProducts)

      const vendorMap = new Map()
      allProducts.forEach((p: any) => {
        if (!vendorMap.has(p.vendor_id)) {
          vendorMap.set(p.vendor_id, {
            id: p.vendor_id,
            name: p.vendor_name || `Merchant #${p.vendor_id}`,
            email: p.vendor_email || 'contact@easygear.ng',
            store_name: p.vendor_name || 'EasyGear Store',
          })
        }
      })
      setVendors(Array.from(vendorMap.values()))
      logger(`Live: ${allProducts.length} items / ${vendorMap.size} vendors.`)
    } catch (err) {
      logger('CRITICAL SYNC ERROR', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const viewMerchantDetail = async (vendor: any) => {
    setLoading(true)
    logger(`Opening Dossier: ${vendor.id}...`)
    try {
      const res = await fetch(`${API_URL}/vendor/profile/${vendor.id}`)
      const json = await res.json()
      const profile = json.data || json.vendor || json || {}

      setSelectedVendor({
        ...vendor,
        fullname:
          profile.name ||
          profile.fullname ||
          profile.business_name ||
          vendor.name,
        username:
          profile.username ||
          profile.user_name ||
          vendor.name?.toLowerCase().replace(/\s/g, '_'),
        email: profile.email || profile.contact_email || vendor.email,
        phone: profile.phone_number || profile.phone || 'Not Set',
        address: profile.business_address || profile.address || 'Not Set',
        store_name: profile.business_name || vendor.store_name,
        password_raw:
          profile.password_plain || profile.temp_password || '••••••••',
        products: products.filter((p) => p.vendor_id === vendor.id),
      })
    } catch (err) {
      logger('API Offline - Using Fallback', err)
      setSelectedVendor({
        ...vendor,
        products: products.filter((p) => p.vendor_id === vendor.id),
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredVendors = useMemo(() => {
    return vendors.filter(
      (v) =>
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.id.toString().includes(searchTerm),
    )
  }, [vendors, searchTerm])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <div className='max-w-6xl mx-auto py-4 md:py-8 px-4 md:px-6 font-sans text-slate-900'>
      {/* COMPACT DEBUGGER - Hidden on Mobile */}
      <div className='fixed bottom-4 right-4 z-50 w-64 bg-slate-900/95 backdrop-blur rounded-xl border border-slate-700 shadow-xl hidden lg:block'>
        <div className='bg-slate-800/50 px-3 py-1.5 flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest'>
          <div className='flex items-center gap-1.5'>
            <Terminal size={10} /> Registry Logs
          </div>
          <div
            className={`w-2 h-2 rounded-full ${loading ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`}
          ></div>
        </div>
        <pre className='p-3 text-[9px] text-green-400 font-mono h-32 overflow-y-auto leading-tight'>
          {rawLog}
        </pre>
      </div>

      {!selectedVendor ? (
        <div className='animate-in fade-in duration-500'>
          <div className='flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6 md:mb-10'>
            <div>
              <h1 className='text-3xl md:text-4xl font-black tracking-tight uppercase italic leading-none'>
                Registry<span className='text-blue-500'>.</span>
              </h1>
              <p className='text-slate-500 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] mt-1'>
                Merchant Access Control
              </p>
            </div>

            <div className='flex items-center gap-2 w-full md:w-auto'>
              <div className='relative flex-1 md:w-56'>
                <Search
                  className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400'
                  size={12}
                />
                <input
                  type='text'
                  placeholder='SEARCH...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='w-full bg-slate-100 border-none rounded-full py-2 pl-9 pr-4 text-[10px] font-bold uppercase focus:ring-2 focus:ring-blue-500 outline-none'
                />
              </div>
              <button
                onClick={fetchData}
                className='p-2 bg-black text-white rounded-full hover:bg-blue-500 transition-all'
              >
                <RefreshCcw
                  className={loading ? 'animate-spin' : ''}
                  size={14}
                />
              </button>
            </div>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5'>
            {filteredVendors.map((v) => (
              <div
                key={v.id}
                onClick={() => viewMerchantDetail(v)}
                className='group bg-white border border-slate-200 p-4 md:p-6 rounded-xl md:rounded-2xl hover:border-black transition-all cursor-pointer'
              >
                <div className='flex items-center justify-between mb-3'>
                  <div className='p-1.5 bg-slate-50 rounded-lg group-hover:bg-blue-500 group-hover:text-white transition-colors'>
                    <UserCircle size={20} />
                  </div>
                  <span className='text-[8px] font-black px-1.5 py-0.5 bg-black text-white rounded uppercase'>
                    ID: {v.id}
                  </span>
                </div>
                <h3 className='text-lg font-bold uppercase truncate'>
                  {v.name}
                </h3>
                <div className='mt-4 pt-3 border-t border-slate-50 flex justify-between items-center'>
                  <div className='flex items-center gap-1.5 text-slate-400 font-bold text-[9px] uppercase'>
                    <Boxes size={12} className='text-blue-500' />
                    {products.filter((p) => p.vendor_id === v.id).length} Units
                  </div>
                  <ChevronRight
                    size={12}
                    className='group-hover:translate-x-1 transition-transform text-slate-300'
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className='animate-in slide-in-from-right-2 duration-500'>
          <button
            onClick={() => setSelectedVendor(null)}
            className='flex items-center gap-2 text-slate-400 hover:text-black font-bold text-[9px] uppercase mb-4 transition-colors'
          >
            <ArrowLeft size={10} strokeWidth={3} /> Return to list
          </button>

          <div className='bg-white border border-slate-200 rounded-2xl md:rounded-3xl overflow-hidden shadow-sm mb-6'>
            <div className='bg-slate-900 p-6 md:p-10 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
              <div>
                <p className='text-blue-500 font-black text-[8px] uppercase tracking-[0.3em] mb-1'>
                  Authorized Profile
                </p>
                <h1 className='text-3xl md:text-5xl font-black italic uppercase tracking-tighter leading-none'>
                  {selectedVendor.fullname}
                </h1>
              </div>
              <div className='bg-white/10 backdrop-blur px-4 py-2 md:px-6 md:py-4 rounded-xl border border-white/10 w-full md:w-auto text-center md:text-left'>
                <p className='text-[8px] font-black text-slate-400 uppercase mb-0.5'>
                  Stock Volume
                </p>
                <div className='text-xl md:text-2xl font-black text-blue-500'>
                  {selectedVendor.products.length}{' '}
                  <span className='text-[10px] text-white font-bold opacity-50'>
                    SKUs
                  </span>
                </div>
              </div>
            </div>

            <div className='p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8'>
              <div className='space-y-4'>
                <DetailItem
                  label='Username'
                  value={`@${selectedVendor.username}`}
                  icon={AtSign}
                />
                <DetailItem
                  label='Email'
                  value={selectedVendor.email}
                  icon={Mail}
                />
              </div>
              <div className='space-y-4'>
                <DetailItem
                  label='Phone'
                  value={selectedVendor.phone}
                  icon={Phone}
                />
                <DetailItem
                  label='Location'
                  value={selectedVendor.address}
                  icon={MapPin}
                />
              </div>
              <div className='space-y-4'>
                <DetailItem
                  label='Store'
                  value={selectedVendor.store_name}
                  icon={Tag}
                />
                <div className='bg-slate-50 p-3 rounded-lg border border-slate-100'>
                  <div className='flex items-center justify-between mb-0.5'>
                    <p className='text-[8px] font-black text-slate-400 uppercase'>
                      Master Key
                    </p>
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className='text-slate-400'
                    >
                      <Eye size={10} />
                    </button>
                  </div>
                  <span className='font-mono text-xs font-bold'>
                    {showPassword
                      ? selectedVendor.password_raw
                      : '••••••••••••'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4'>
            {selectedVendor.products.map((p: any) => (
              <div
                key={p.id}
                className='group bg-white border border-slate-100 p-2 md:p-3 rounded-xl hover:border-blue-500 transition-all'
              >
                <div className='aspect-square rounded-lg bg-slate-50 mb-2 overflow-hidden relative'>
                  <img
                    src={p.primary_image}
                    className='w-full h-full object-cover group-hover:scale-105 transition-transform'
                  />
                  <div className='absolute bottom-1 right-1 bg-black/80 text-white text-[7px] font-black px-1.5 py-0.5 rounded'>
                    QTY: {p.quantity || 0}
                  </div>
                </div>
                <p className='font-black text-[9px] uppercase truncate tracking-tight mb-1'>
                  {p.name}
                </p>
                <div className='flex justify-between items-center'>
                  <p className='text-blue-600 font-black text-[10px]'>
                    {p.formatted_price || `₦${p.price}`}
                  </p>
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${p.quantity > 0 ? 'bg-green-500' : 'bg-red-500'}`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function DetailItem({ label, value, icon: Icon }: any) {
  return (
    <div className='flex gap-2.5 items-center'>
      <div className='p-1.5 bg-slate-50 text-slate-400 rounded-md'>
        <Icon size={12} />
      </div>
      <div className='min-w-0'>
        <p className='text-[8px] font-black text-slate-400 uppercase tracking-widest'>
          {label}
        </p>
        <p className='text-xs font-bold text-slate-800 truncate'>
          {value || '---'}
        </p>
      </div>
    </div>
  )
}
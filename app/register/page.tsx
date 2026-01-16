'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Lock,
  Mail,
  ChevronRight,
  User,
  Eye,
  EyeOff,
  ArrowLeft,
  Phone,
  Tag,
  ShieldCheck,
  MapPin,
  AtSign,
  CheckCircle2,
  Info,
  AlertCircle,
  Loader2,
  X,
} from 'lucide-react'
import Link from 'next/link'

// --- Input Component ---
const ValidatedInput = ({
  name,
  type,
  placeholder,
  label,
  icon: Icon,
  isValid,
  value,
  onChange,
  onFocus,
  onBlur,
  disabled,
  errorMsg,
  children,
}: any) => {
  const [touched, setTouched] = useState(false)
  const showError = touched && value !== '' && !isValid

  return (
    <div
      className={`group relative transition-opacity duration-300 ${
        disabled ? 'opacity-40 select-none' : 'opacity-100'
      }`}
    >
      <label className='text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-4'>
        {label}
      </label>
      <div className='relative'>
        <Icon
          className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
            value === ''
              ? 'text-slate-300'
              : isValid
              ? 'text-green-500'
              : 'text-orange-500'
          }`}
          size={18}
        />
        <input
          name={name}
          type={type}
          required={!disabled}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={(e) => {
            setTouched(true)
            if (onBlur) onBlur(e)
          }}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full pl-12 pr-12 py-4 bg-slate-50 border-2 rounded-2xl outline-none font-bold text-sm transition-all
            ${
              showError
                ? 'border-red-500 bg-red-50/30'
                : 'border-slate-50 focus:border-orange-500/20 focus:bg-white'
            }
            ${disabled ? 'cursor-not-allowed' : 'cursor-text'}`}
        />
        {children}
      </div>
      {showError && (
        <p className='text-[9px] text-red-500 font-bold uppercase tracking-tighter mt-1.5 ml-4 flex items-center gap-1'>
          <AlertCircle size={10} /> {errorMsg}
        </p>
      )}
    </div>
  )
}

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isPassFocused, setIsPassFocused] = useState(false)
  const [serverEmailError, setServerEmailError] = useState<string | null>(null)
  const [toast, setToast] = useState<{
    message: string
    type: 'error' | 'success'
  } | null>(null)
  const router = useRouter()

  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    store_name: '',
    business_address: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
  })

  // Auto-hide toast after 5 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const validate = useMemo(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRegex = /^\+?[0-9]{10,15}$/
    const pass = formData.password
    const passRequirements = {
      length: pass.length >= 8,
      number: /[0-9]/.test(pass),
      symbol: /[^A-Za-z0-9]/.test(pass),
      upper: /[A-Z]/.test(pass),
    }

    return {
      email:
        emailRegex.test(formData.email) && formData.email !== serverEmailError,
      phone: phoneRegex.test(formData.phone),
      username: formData.username.length >= 3,
      passReqs: passRequirements,
      passwordValid: Object.values(passRequirements).every(Boolean),
      match:
        formData.password === formData.password_confirmation &&
        formData.password !== '',
      fullname: formData.fullname.trim().split(' ').length >= 2,
    }
  }, [formData, serverEmailError])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'email') setServerEmailError(null)
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate.passwordValid || !validate.match || !agreeToTerms) return

    setLoading(true)
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || 'https://api.easygear.ng/api/v1'
      const response = await fetch(`${baseUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: formData.fullname,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.password_confirmation,
          phone_number: formData.phone,
          role: 'vendor',
          business_name: formData.store_name,
          business_address: formData.business_address,
          business_phone: formData.phone,
        }),
      })

      const res = await response.json()

      if (response.ok) {
        setToast({
          message: 'Account created! Redirecting...',
          type: 'success',
        })
        setTimeout(() => router.push('/login'), 2000)
      } else {
        if (res.errors) {
          const details = Object.values(res.errors).flat().join(', ')
          setToast({ message: details, type: 'error' })
          if (res.errors.email) setServerEmailError(formData.email)
        } else {
          setToast({
            message: res.message || 'Registration failed',
            type: 'error',
          })
        }
      }
    } catch (error) {
      setToast({
        message: 'Network Interruption: Check your connection.',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans py-16 relative overflow-x-hidden'>
      {/* --- TOAST NOTIFICATION --- */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-100 flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl border-2 transition-all duration-500 animate-in slide-in-from-right-full
          ${
            toast.type === 'success'
              ? 'bg-green-600 border-green-400 text-white'
              : 'bg-slate-900 border-red-500 text-white'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 size={20} />
          ) : (
            <AlertCircle size={20} className='text-red-500' />
          )}
          <p className='text-xs font-black uppercase tracking-widest max-w-xs'>
            {toast.message}
          </p>
          <button
            onClick={() => setToast(null)}
            className='ml-2 hover:opacity-50 transition-opacity'
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className='w-full max-w-2xl'>
        <div className='text-center mb-12'>
          <h1 className='text-6xl font-black italic tracking-tighter text-slate-900 uppercase'>
            easyGear<span className='text-orange-500'>.</span>
          </h1>
          <p className='text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-2'>
            Vendor Network Protocol
          </p>
        </div>

        <div className='bg-white rounded-5xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] overflow-hidden border-8 border-white'>
          <div className='p-10 space-y-8'>
            <form onSubmit={handleRegister} className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <ValidatedInput
                  name='fullname'
                  label='Merchant Full Name'
                  placeholder='John Doe'
                  icon={User}
                  isValid={validate.fullname}
                  value={formData.fullname}
                  onChange={handleChange}
                  errorMsg='Full name required'
                />
                <ValidatedInput
                  name='username'
                  label='Unique Username'
                  placeholder='johndoe'
                  icon={AtSign}
                  isValid={validate.username}
                  value={formData.username}
                  onChange={handleChange}
                  errorMsg='Min. 3 characters'
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <ValidatedInput
                  name='store_name'
                  label='Store Name'
                  placeholder='Gear World'
                  icon={Tag}
                  isValid={formData.store_name.length > 2}
                  value={formData.store_name}
                  onChange={handleChange}
                  errorMsg='Too short'
                />
                <ValidatedInput
                  name='business_address'
                  label='Operating Address'
                  placeholder='Lagos'
                  icon={MapPin}
                  isValid={formData.business_address.length > 5}
                  value={formData.business_address}
                  onChange={handleChange}
                  errorMsg='Full address required'
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <ValidatedInput
                  name='email'
                  label='Secure Email'
                  placeholder='merchant@easygear.ng'
                  icon={Mail}
                  isValid={validate.email}
                  value={formData.email}
                  onChange={handleChange}
                  errorMsg={
                    formData.email === serverEmailError
                      ? 'This email is already in use'
                      : 'Enter a valid email'
                  }
                />
                <ValidatedInput
                  name='phone'
                  label='Direct Line'
                  placeholder='+234...'
                  icon={Phone}
                  isValid={validate.phone}
                  value={formData.phone}
                  onChange={handleChange}
                  errorMsg='Valid phone required'
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 relative'>
                <div className='relative'>
                  <ValidatedInput
                    name='password'
                    type={showPassword ? 'text' : 'password'}
                    label='Secure Password'
                    placeholder='••••••••'
                    icon={Lock}
                    isValid={validate.passwordValid}
                    value={formData.password}
                    onChange={handleChange}
                    errorMsg='Weak password'
                    onFocus={() => setIsPassFocused(true)}
                    onBlur={() => setIsPassFocused(false)}
                  >
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500'
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </ValidatedInput>
                  {isPassFocused && (
                    <div className='absolute z-50 top-full left-0 right-0 mt-2 p-4 bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl'>
                      <div className='grid grid-cols-2 gap-2'>
                        {[
                          { label: '8+ Chars', met: validate.passReqs.length },
                          { label: '1+ Num', met: validate.passReqs.number },
                          { label: '1+ Upper', met: validate.passReqs.upper },
                          { label: '1+ Sym', met: validate.passReqs.symbol },
                        ].map((req, i) => (
                          <div
                            key={i}
                            className={`flex items-center gap-2 text-[10px] font-bold ${
                              req.met ? 'text-green-400' : 'text-slate-400'
                            }`}
                          >
                            <div
                              className={`w-1 h-1 rounded-full ${
                                req.met ? 'bg-green-400' : 'bg-slate-700'
                              }`}
                            />{' '}
                            {req.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <ValidatedInput
                  name='password_confirmation'
                  type={showPassword ? 'text' : 'password'}
                  label='Confirm Password'
                  placeholder={
                    validate.passwordValid ? '••••••••' : 'Locking...'
                  }
                  icon={ShieldCheck}
                  isValid={validate.match}
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  errorMsg='No match'
                  disabled={!validate.passwordValid}
                />
              </div>

              <div className='flex items-center gap-3 px-4 pt-2'>
                <button
                  type='button'
                  onClick={() => setAgreeToTerms(!agreeToTerms)}
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center ${
                    agreeToTerms
                      ? 'bg-orange-500 border-orange-500'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  {agreeToTerms && (
                    <CheckCircle2 size={14} className='text-white' />
                  )}
                </button>
                <p className='text-[10px] font-bold text-slate-400 uppercase tracking-tight'>
                  I accept the{' '}
                  <span className='text-orange-500 underline'>
                    Vendor Service Agreement
                  </span>
                </p>
              </div>

              <button
                disabled={loading || !validate.match || !agreeToTerms}
                className='w-full py-6 rounded-3xl bg-slate-900 font-black text-[12px] uppercase tracking-[0.3em] text-white shadow-2xl flex items-center justify-center gap-3 hover:bg-orange-600 transition-all active:scale-[0.98] disabled:opacity-30 group'
              >
                {loading ? (
                  <Loader2 className='animate-spin' size={18} />
                ) : (
                  <span>Finalize Registration</span>
                )}
                {!loading && <ChevronRight size={18} strokeWidth={4} />}
              </button>
            </form>
          </div>
          <div className='p-6 bg-orange-500 text-center border-t border-orange-500'>
            <Link
              href='/login'
              className='text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors flex items-center justify-center gap-2'
            >
              <ArrowLeft size={14} strokeWidth={3} /> Return to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

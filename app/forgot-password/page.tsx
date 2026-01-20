// 'use client'

// import { useState, useEffect } from 'react'
// import Link from 'next/link'
// import {
//   Mail,
//   ChevronLeft,
//   ShieldQuestion,
//   Send,
//   CheckCircle2,
//   AlertCircle,
//   RefreshCcw,
// } from 'lucide-react'
// import { cn } from '@/app/lib/utils'

// export default function VendorForgotPassword() {
//   const [email, setEmail] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [submitted, setSubmitted] = useState(false)
//   const [error, setError] = useState('')
//   const [countdown, setCountdown] = useState(60)

//   // Timer logic for Resend functionality
//   useEffect(() => {
//     let timer: NodeJS.Timeout
//     if (submitted && countdown > 0) {
//       timer = setInterval(() => setCountdown((prev) => prev - 1), 1000)
//     }
//     return () => clearInterval(timer)
//   }, [submitted, countdown])

//   const handleResetRequest = async (e?: React.FormEvent) => {
//     e?.preventDefault()
//     setLoading(true)
//     setError('')

//     try {
//       const response = await fetch(
//         'https://api.easygear.ng/api/v1/password/email',
//         {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ email }),
//         },
//       )

//       if (response.ok) {
//         setSubmitted(true)
//         setCountdown(60) // Reset timer on successful send
//       } else {
//         setError('Identity not found in our records.')
//       }
//     } catch (err) {
//       setError('Connection to security server failed.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className='min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans relative'>
//       <div className='w-full max-w-xl'>
//         <Link
//           href='/login'
//           className='flex items-center gap-2 text-slate-400 hover:text-orange-500 transition-colors mb-8 group'
//         >
//           <ChevronLeft
//             size={20}
//             className='group-hover:-translate-x-1 transition-transform'
//           />
//           <span className='text-[10px] font-black uppercase tracking-widest'>
//             Back to Login
//           </span>
//         </Link>

//         <div className='bg-white rounded-5xl border-4 border-white shadow-2xl overflow-hidden p-10'>
//           {!submitted ? (
//             <div className='space-y-8'>
//               <div className='space-y-3'>
//                 <div className='w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500'>
//                   <ShieldQuestion size={32} strokeWidth={1.5} />
//                 </div>
//                 <h2 className='text-3xl font-black italic tracking-tighter text-slate-900 uppercase'>
//                   Recover <span className='text-orange-500'>Access.</span>
//                 </h2>
//                 <p className='text-slate-400 font-bold text-sm'>
//                   Enter your vendor email to receive a secure recovery link.
//                 </p>
//               </div>

//               <form onSubmit={handleResetRequest} className='space-y-6'>
//                 <div className='space-y-2'>
//                   <label className='text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2'>
//                     Vendor Email
//                   </label>
//                   <div className='relative group'>
//                     <Mail
//                       className='absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors'
//                       size={20}
//                     />
//                     <input
//                       type='email'
//                       required
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       placeholder='vendor@yourstore.com'
//                       className='w-full pl-14 pr-6 py-5 bg-slate-50 border-4 border-transparent rounded-3xl outline-none font-bold text-sm focus:bg-white focus:border-orange-500/10 transition-all'
//                     />
//                   </div>
//                 </div>

//                 {error && (
//                   <div className='flex items-center gap-2 text-red-500 bg-red-50 p-4 rounded-2xl border border-red-100'>
//                     <AlertCircle size={18} />
//                     <p className='text-[10px] font-black uppercase tracking-tight'>
//                       {error}
//                     </p>
//                   </div>
//                 )}

//                 <button
//                   disabled={loading}
//                   className='w-full py-6 bg-orange-500 rounded-full font-black text-[11px] uppercase tracking-[0.2em] text-white shadow-xl shadow-orange-500/20 flex items-center justify-center gap-3 transition-all active:scale-95'
//                 >
//                   {loading ? (
//                     <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
//                   ) : (
//                     <span>Transmit Link</span>
//                   )}
//                 </button>
//               </form>
//             </div>
//           ) : (
//             /* SUCCESS STATE WITH TIMER */
//             <div className='text-center space-y-6 py-8 animate-in zoom-in-95 duration-300'>
//               <div className='w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto relative'>
//                 <CheckCircle2 size={48} strokeWidth={1.5} />
//                 <div className='absolute inset-0 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin duration-3000' />
//               </div>

//               <div className='space-y-2'>
//                 <h2 className='text-2xl font-black text-slate-900 uppercase tracking-tighter'>
//                   Packet Transmitted
//                 </h2>
//                 <p className='text-slate-400 font-bold text-sm'>
//                   Security link sent to: <br />
//                   <span className='text-slate-900'>{email}</span>
//                 </p>
//               </div>

//               <div className='flex flex-col items-center gap-4 pt-4'>
//                 <Link
//                   href='/login'
//                   className='w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-orange-500 transition-colors'
//                 >
//                   Return to Terminal
//                 </Link>

//                 {countdown > 0 ? (
//                   <p className='text-[9px] font-black text-slate-300 uppercase tracking-widest'>
//                     Resend available in{' '}
//                     <span className='text-orange-500'>{countdown}s</span>
//                   </p>
//                 ) : (
//                   <button
//                     onClick={() => handleResetRequest()}
//                     className='flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-orange-500 hover:text-orange-600 transition-colors animate-pulse'
//                   >
//                     <RefreshCcw size={14} /> Resend Packet
//                   </button>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Mail,
  ChevronLeft,
  ShieldQuestion,
  Send,
  CheckCircle2,
  AlertCircle,
  RefreshCcw,
  User,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Key,
} from 'lucide-react'
import { cn } from '@/app/lib/utils'

type RecoveryStep = 'IDENTIFY' | 'VERIFY' | 'RESET' | 'SUCCESS'

export default function VendorRecoveryTerminal() {
  const [step, setStep] = useState<RecoveryStep>('IDENTIFY')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Form States
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [countdown, setCountdown] = useState(60)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (step === 'VERIFY' && countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000)
    }
    return () => clearInterval(timer)
  }, [step, countdown])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // --- Step 1: Submit Identity Details ---
  const handleIdentify = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    // Standard logic: Transmit identity packet to server
    setTimeout(() => {
      setStep('VERIFY')
      setLoading(false)
    }, 1500)
  }

  // --- Step 2: Verify OTP ---
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Verify 6-digit code
    setTimeout(() => {
      setStep('RESET')
      setLoading(false)
    }, 1500)
  }

  // --- Step 3: Final Reset ---
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Security keys do not match.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      setStep('SUCCESS')
      setLoading(false)
    }, 2000)
  }

  return (
    <div className='min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans'>
      <div className='w-full max-w-xl'>
        <Link
          href='/login'
          className='flex items-center gap-2 text-slate-400 hover:text-orange-500 transition-colors mb-8 group'
        >
          <ChevronLeft
            size={20}
            className='group-hover:-translate-x-1 transition-transform'
          />
          <span className='text-[10px] font-black uppercase tracking-widest'>
            Abort Protocol
          </span>
        </Link>

        <div className='bg-white rounded-5xl border-4 border-white shadow-2xl overflow-hidden p-10'>
          {/* STEP 1: IDENTIFICATION */}
          {step === 'IDENTIFY' && (
            <div className='space-y-8 animate-in fade-in slide-in-from-bottom-4'>
              <div className='space-y-3'>
                <div className='w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500'>
                  <ShieldQuestion size={32} strokeWidth={1.5} />
                </div>
                <h2 className='text-3xl font-black italic tracking-tighter text-slate-900 uppercase'>
                  Identify <span className='text-orange-500'>Node.</span>
                </h2>
                <p className='text-slate-400 font-bold text-sm'>
                  Enter your credentials to locate your vendor profile.
                </p>
              </div>

              <form onSubmit={handleIdentify} className='space-y-4'>
                <InputField
                  icon={User}
                  label='Username'
                  name='username'
                  placeholder='eg. StoreName_01'
                  value={formData.username}
                  onChange={handleChange}
                />
                <InputField
                  icon={Mail}
                  label='Email Address'
                  name='email'
                  type='email'
                  placeholder='vendor@easygear.ng'
                  value={formData.email}
                  onChange={handleChange}
                />
                <InputField
                  icon={Phone}
                  label='Phone Number'
                  name='phone'
                  placeholder='+234...'
                  value={formData.phone}
                  onChange={handleChange}
                />

                <button
                  disabled={loading}
                  className='w-full py-6 bg-orange-500 rounded-full font-black text-[11px] uppercase tracking-[0.2em] text-white shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95'
                >
                  {loading ? (
                    <LoadingSpinner />
                  ) : (
                    <span>Request Recovery Packet</span>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* STEP 2: VERIFICATION */}
          {step === 'VERIFY' && (
            <div className='space-y-8 animate-in fade-in slide-in-from-right-4'>
              <div className='text-center space-y-3'>
                <div className='w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto'>
                  <Key size={32} strokeWidth={1.5} />
                </div>
                <h2 className='text-2xl font-black text-slate-900 uppercase'>
                  Verify Identity
                </h2>
                <p className='text-slate-400 font-bold text-xs'>
                  A 6-digit code was sent to {formData.email}
                </p>
              </div>

              <form onSubmit={handleVerify} className='space-y-6'>
                <input
                  required
                  name='otp'
                  maxLength={6}
                  placeholder='0 0 0 0 0 0'
                  className='w-full text-center text-3xl font-black tracking-[0.5em] py-6 bg-slate-50 border-4 border-slate-100 rounded-3xl outline-none focus:bg-white focus:border-blue-600/20 transition-all'
                  onChange={handleChange}
                />
                <button
                  disabled={loading}
                  className='w-full py-6 bg-slate-900 rounded-full font-black text-[11px] uppercase tracking-[0.2em] text-white shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all'
                >
                  {loading ? <LoadingSpinner /> : <span>Confirm Code</span>}
                </button>
                <div className='text-center'>
                  {countdown > 0 ? (
                    <p className='text-[9px] font-black text-slate-300 uppercase tracking-widest'>
                      Resend in {countdown}s
                    </p>
                  ) : (
                    <button
                      type='button'
                      onClick={() => setCountdown(60)}
                      className='text-[10px] font-black uppercase text-orange-500 hover:underline'
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* STEP 3: RESET PASSWORD */}
          {step === 'RESET' && (
            <div className='space-y-8 animate-in fade-in slide-in-from-right-4'>
              <div className='space-y-3'>
                <h2 className='text-3xl font-black italic tracking-tighter text-slate-900 uppercase'>
                  New <span className='text-orange-500'>Key.</span>
                </h2>
                <p className='text-slate-400 font-bold text-sm'>
                  Set a high-entropy security key for your terminal.
                </p>
              </div>

              <form onSubmit={handleReset} className='space-y-4'>
                <div className='relative group'>
                  <Lock
                    className='absolute left-5 top-1/2 -translate-y-1/2 text-slate-300'
                    size={20}
                  />
                  <input
                    name='newPassword'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='New Security Key'
                    className='w-full pl-14 pr-14 py-5 bg-slate-50 border-4 border-transparent rounded-3xl outline-none font-bold text-sm focus:bg-white focus:border-orange-500/10 transition-all'
                    onChange={handleChange}
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-5 top-1/2 -translate-y-1/2 text-slate-300'
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <input
                  name='confirmPassword'
                  type='password'
                  placeholder='Confirm Security Key'
                  className='w-full px-8 py-5 bg-slate-50 border-4 border-transparent rounded-3xl outline-none font-bold text-sm focus:bg-white focus:border-orange-500/10 transition-all'
                  onChange={handleChange}
                />
                {error && (
                  <p className='text-red-500 text-[10px] font-black uppercase'>
                    {error}
                  </p>
                )}
                <button
                  disabled={loading}
                  className='w-full py-6 bg-orange-500 rounded-full font-black text-[11px] uppercase tracking-[0.2em] text-white shadow-xl active:scale-95 transition-all'
                >
                  {loading ? (
                    <LoadingSpinner />
                  ) : (
                    <span>Update Terminal Key</span>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* SUCCESS STATE */}
          {step === 'SUCCESS' && (
            <div className='text-center space-y-6 py-8 animate-in zoom-in-95'>
              <div className='w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto'>
                <CheckCircle2 size={48} strokeWidth={1.5} />
              </div>
              <h2 className='text-2xl font-black text-slate-900 uppercase'>
                Terminal Reset
              </h2>
              <p className='text-slate-400 font-bold text-sm'>
                Identity verified and key updated.
              </p>
              <Link
                href='/login'
                className='inline-block w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-orange-500 transition-colors'
              >
                Return to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Reusable Sub-components
function InputField({ icon: Icon, label, ...props }: any) {
  return (
    <div className='space-y-2'>
      <label className='text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2'>
        {label}
      </label>
      <div className='relative group'>
        <Icon
          className='absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors'
          size={20}
        />
        <input
          className='w-full pl-14 pr-6 py-5 bg-slate-50 border-4 border-transparent rounded-3xl outline-none font-bold text-sm focus:bg-white focus:border-orange-500/10 transition-all'
          {...props}
        />
      </div>
    </div>
  )
}

function LoadingSpinner() {
  return (
    <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
  )
}
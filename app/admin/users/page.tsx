'use client'

import { useState, useMemo } from 'react'
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  Search,
  MoreVertical,
  UserMinus,
  UserCheck,
  Mail,
  MapPin,
  Calendar,
  Fingerprint,
  Plus,
  Trash2,
  X,
  Lock,
} from 'lucide-react'
import { cn } from '@/app/lib/utils'

const INITIAL_USERS = [
  {
    id: 'USR-001',
    name: 'Amina Yusuf',
    email: 'amina@example.com',
    role: 'Customer',
    status: 'Verified',
    joined: 'Oct 2025',
    location: 'Lagos',
  },
  {
    id: 'USR-002',
    name: 'Admin Master',
    email: 'admin@easygear.ng',
    role: 'System Root',
    status: 'Verified',
    joined: 'Jan 2026',
    location: 'Headquarters',
  },
  // ... other initial users
]

export default function AdminUserManagement() {
  const [users, setUsers] = useState(INITIAL_USERS)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('All')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // --- NEW ADMIN FORM STATE ---
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    password: '',
    location: 'Lagos',
  })

  // SEARCH & ROLE FILTER
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesTab =
        activeTab === 'All' ||
        (activeTab === 'Admin'
          ? u.role === 'System Root'
          : u.role === activeTab)
      return matchesSearch && matchesTab
    })
  }, [users, searchQuery, activeTab])

  // --- HANDLERS ---
  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault()
    const adminAccount = {
      id: `ADM-${Math.floor(Math.random() * 1000)}`,
      name: newAdmin.name,
      email: newAdmin.email,
      role: 'System Root', // Matches our Login Logic
      status: 'Verified',
      joined: new Intl.DateTimeFormat('en-GB', {
        month: 'short',
        year: 'numeric',
      }).format(new Date()),
      location: newAdmin.location,
    }

    setUsers([adminAccount, ...users])
    setIsModalOpen(false)
    setNewAdmin({ name: '', email: '', password: '', location: 'Lagos' })
    alert(
      `Admin ${newAdmin.name} created. They can now login with password: ${newAdmin.password}`
    )
  }

  const deleteUser = (id: string) => {
    if (
      confirm(
        'Are you sure? This will revoke all terminal access for this node.'
      )
    ) {
      setUsers(users.filter((u) => u.id !== id))
    }
  }

  const toggleStatus = (id: string) => {
    setUsers(
      users.map((u) =>
        u.id === id
          ? {
              ...u,
              status: u.status === 'Suspended' ? 'Verified' : 'Suspended',
            }
          : u
      )
    )
  }

  return (
    <div className='space-y-8 relative'>
      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
        <div>
          <h1 className='text-4xl font-black text-slate-900 tracking-tight italic'>
            Account Registry
          </h1>
          <p className='text-slate-500 font-bold mt-1 uppercase text-[10px] tracking-[0.3em]'>
            Access Control & User Governance
          </p>
        </div>

        <div className='flex items-center gap-4'>
          <button
            onClick={() => setIsModalOpen(true)}
            className='flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200'
          >
            <Plus size={18} strokeWidth={3} /> Add Admin
          </button>
          <div className='flex bg-white border-4 border-slate-100 p-1.5 rounded-2xl shadow-sm'>
            {['All', 'Customer', 'Vendor', 'Admin'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'px-4 py-2 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest',
                  activeTab === tab
                    ? 'bg-slate-900 text-white shadow-lg'
                    : 'text-slate-400 hover:text-slate-600'
                )}
              >
                {tab}s
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className='relative group'>
        <Search
          className='absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600'
          size={20}
          strokeWidth={3}
        />
        <input
          type='text'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder='Search by name, email, or digital signature...'
          className='w-full pl-16 pr-8 py-5 bg-white border-4 border-slate-100 rounded-4xl outline-none font-bold focus:border-blue-600 transition-all shadow-sm'
        />
      </div>

      {/* User Cards Grid */}
      <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className='bg-white border-4 border-slate-100 rounded-[2.5rem] p-8 hover:border-blue-600/20 transition-all group relative overflow-hidden'
          >
            <div className='flex items-start justify-between relative z-10'>
              <div className='flex gap-5'>
                <div
                  className={cn(
                    'w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-colors',
                    user.role === 'System Root'
                      ? 'bg-blue-50 border-blue-100 text-blue-600'
                      : 'bg-slate-50 border-slate-100 text-slate-300'
                  )}
                >
                  <Fingerprint size={32} strokeWidth={1.5} />
                </div>
                <div>
                  <div className='flex items-center gap-2'>
                    <h3 className='text-xl font-black text-slate-900'>
                      {user.name}
                    </h3>
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border',
                        user.role === 'System Root'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 text-slate-400 border-slate-100'
                      )}
                    >
                      {user.role === 'System Root' ? 'Admin' : user.role}
                    </span>
                  </div>
                  <p className='text-slate-400 font-bold text-sm flex items-center gap-1'>
                    <Mail size={12} /> {user.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => deleteUser(user.id)}
                className='p-3 hover:bg-red-50 rounded-2xl text-slate-300 hover:text-red-500 transition-colors'
              >
                <Trash2 size={20} />
              </button>
            </div>

            {/* Meta Data Row */}
            <div className='grid grid-cols-3 gap-4 mt-8 pt-6 border-t-2 border-slate-50'>
              <div>
                <p className='text-[10px] font-black text-slate-300 uppercase tracking-widest'>
                  Status
                </p>
                <div className='flex items-center gap-1.5'>
                  {user.status === 'Verified' ? (
                    <ShieldCheck size={14} className='text-emerald-500' />
                  ) : (
                    <ShieldAlert size={14} className='text-orange-500' />
                  )}
                  <span className='text-xs font-black'>{user.status}</span>
                </div>
              </div>
              <div>
                <p className='text-[10px] font-black text-slate-300 uppercase tracking-widest'>
                  Location
                </p>
                <p className='text-xs font-black flex items-center gap-1'>
                  <MapPin size={12} className='text-slate-400' />{' '}
                  {user.location}
                </p>
              </div>
              <div>
                <p className='text-[10px] font-black text-slate-300 uppercase tracking-widest'>
                  Joined
                </p>
                <p className='text-xs font-black flex items-center gap-1'>
                  <Calendar size={12} className='text-slate-400' />{' '}
                  {user.joined}
                </p>
              </div>
            </div>

            <div className='mt-8 flex gap-3'>
              <button
                onClick={() => toggleStatus(user.id)}
                className={cn(
                  'flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all',
                  user.status === 'Suspended'
                    ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white'
                    : 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white'
                )}
              >
                {user.status === 'Suspended' ? (
                  <UserCheck size={16} />
                ) : (
                  <UserMinus size={16} />
                )}
                {user.status === 'Suspended' ? 'Restore' : 'Suspend'}
              </button>
              <button className='px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-colors'>
                Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- ADD ADMIN MODAL --- */}
      {isModalOpen && (
        <div className='fixed inset-0 z-100 flex items-center justify-center p-6'>
          <div
            className='absolute inset-0 bg-slate-900/60 backdrop-blur-sm'
            onClick={() => setIsModalOpen(false)}
          />
          <div className='relative w-full max-w-lg bg-white rounded-5xl border-8 border-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200'>
            <div className='p-10'>
              <div className='flex justify-between items-center mb-8'>
                <h2 className='text-3xl font-black text-slate-900 italic tracking-tighter uppercase'>
                  New Admin
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className='p-2 hover:bg-slate-100 rounded-full'
                >
                  <X />
                </button>
              </div>

              <form onSubmit={handleAddAdmin} className='space-y-5'>
                <div className='space-y-2'>
                  <label className='text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2'>
                    Full Name
                  </label>
                  <input
                    required
                    value={newAdmin.name}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, name: e.target.value })
                    }
                    className='w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-600 outline-none font-bold'
                    placeholder='e.g. Segun Arinze'
                  />
                </div>
                <div className='space-y-2'>
                  <label className='text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2'>
                    Admin Email
                  </label>
                  <input
                    required
                    type='email'
                    value={newAdmin.email}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, email: e.target.value })
                    }
                    className='w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-600 outline-none font-bold'
                    placeholder='admin@easygear.ng'
                  />
                </div>
                <div className='space-y-2'>
                  <label className='text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2'>
                    Temporary Password
                  </label>
                  <div className='relative'>
                    <Lock
                      className='absolute left-5 top-1/2 -translate-y-1/2 text-slate-300'
                      size={18}
                    />
                    <input
                      required
                      type='password'
                      value={newAdmin.password}
                      onChange={(e) =>
                        setNewAdmin({ ...newAdmin, password: e.target.value })
                      }
                      className='w-full pl-14 pr-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-600 outline-none font-bold'
                      placeholder='••••••••'
                    />
                  </div>
                </div>
                <button className='w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200 mt-4'>
                  Initialize Administrator
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

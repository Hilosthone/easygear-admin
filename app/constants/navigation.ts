import {
  LayoutDashboard,
  Users,
  Store,
  ShoppingCart,
  Package,
  CreditCard,
  BarChart3,
  Ticket,
  Bell,
  Settings,
  Star,
  Tag,
  Wallet,
} from 'lucide-react'

export const ADMIN_NAV = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Vendors', href: '/admin/vendors', icon: Store },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Payments', href: '/admin/payments', icon: CreditCard },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Support', href: '/admin/support', icon: Ticket },
]

export const VENDOR_NAV = [
  { name: 'Dashboard', href: '/vendor/dashboard', icon: LayoutDashboard },
  { name: 'My Gear', href: '/vendor/products', icon: Package },
  { name: 'Orders', href: '/vendor/orders', icon: ShoppingCart },
  { name: 'Earnings', href: '/vendor/earnings', icon: Wallet },
  { name: 'Reviews', href: '/vendor/reviews', icon: Star },
  { name: 'Promotions', href: '/vendor/promotions', icon: Tag },
]

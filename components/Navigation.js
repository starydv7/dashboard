import { useState } from 'react'
import { useRouter } from 'next/router'
import { 
  Home, 
  MapPin, 
  Building, 
  User, 
  BarChart3, 
  Menu,
  X,
  Shield,
  Pill
} from 'lucide-react'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const navigationItems = [
    {
      name: 'Main Dashboard',
      href: '/',
      icon: Home,
      description: 'Overview of all districts and health metrics'
    },
    {
      name: 'District Dashboard',
      href: '/district-dashboard',
      icon: MapPin,
      description: 'District-level health indicators and data'
    },
    {
      name: 'Taluk Dashboard',
      href: '/taluk-dashboard',
      icon: Building,
      description: 'Taluk-level health metrics and PHC data'
    },
    {
      name: 'ASHA Dashboard',
      href: '/asha-dashboard',
      icon: User,
      description: 'Individual ASHA worker performance metrics'
    },
    {
      name: 'Healthcare Charts',
      href: '/healthcare-charts',
      icon: BarChart3,
      description: 'Advanced healthcare analytics and charts'
    },
    {
      name: '1mg',
      href: '/1mg',
      icon: Pill,
      description: '1mg integration and medication management'
    }
  ]

  const handleNavigation = (href) => {
    router.push(href)
    setIsMenuOpen(false)
  }


  const isActive = (href) => {
    if (href === '/') {
      return router.pathname === '/'
    }
    return router.pathname === href
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
        >
          <span className="sr-only">Open main menu</span>
          {isMenuOpen ? (
            <X className="block h-6 w-6" />
          ) : (
            <Menu className="block h-6 w-6" />
          )}
        </button>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex lg:space-x-1">
        {navigationItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.href)}
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive(item.href)
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              title={item.description}
            >
              <Icon className="mr-2 h-4 w-4" />
              {item.name}
            </button>
          )
        })}
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={`group flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive(item.href)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  <div className="text-left">
                    <div>{item.name}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

    </>
  )
}

// Header Component with Navigation
export function DashboardHeader({ title, subtitle, showNavigation = true }) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{title}</h1>
              {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
            </div>
          </div>
          {showNavigation && (
            <nav className="flex items-center space-x-4">
              <Navigation />
            </nav>
          )}
        </div>
      </div>
    </header>
  )
}

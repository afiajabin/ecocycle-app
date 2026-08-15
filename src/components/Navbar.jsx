import { useState, useEffect } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { 
  Recycle, 
  Sun, 
  Moon, 
  Search, 
  Menu, 
  X, 
  PlusCircle, 
  User, 
  Truck, 
  Shield, 
  LayoutDashboard, 
  FileText, 
  Building, 
  Users, 
  ListOrdered
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useAuthRole } from '../context/AuthRoleContext'
import CommandPalette from './CommandPalette'

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const { currentRole, userProfile } = useAuthRole()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCommandOpen, setIsCommandOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsCommandOpen(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Exact sequences according to proposal
  const roleNavItems = {
    user: [
      { label: 'Dashboard', path: '/user/dashboard', icon: LayoutDashboard },
      { label: 'Request Pickup', path: '/user/request-pickup', icon: PlusCircle },
      { label: 'My Requests', path: '/user/my-requests', icon: FileText },
      { label: 'Profile', path: '/user/profile', icon: User }
    ],
    collector: [
      { label: 'Dashboard', path: '/collector/dashboard', icon: LayoutDashboard },
      { label: 'Requests', path: '/collector/requests', icon: ListOrdered },
      { label: 'Profile', path: '/collector/profile', icon: User }
    ],
    admin: [
      { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Users', path: '/admin/users', icon: Users },
      { label: 'Collectors', path: '/admin/collectors', icon: Truck },
      { label: 'Requests', path: '/admin/requests', icon: ListOrdered },
      { label: 'Facilities', path: '/admin/facilities', icon: Building }
    ]
  }

  const currentNavItems = roleNavItems[currentRole] || roleNavItems.user

  const closeMobile = () => setIsMobileMenuOpen(false)

  const defaultHomeRoute = currentRole === 'admin' ? '/admin/dashboard' : currentRole === 'collector' ? '/collector/dashboard' : '/user/dashboard'

  return (
    <>
      <header className="navbar-wrapper">
        <div className="container">
          <nav className="navbar" aria-label="Role Navigation">
            {/* Brand Logo */}
            <Link to={defaultHomeRoute} className="nav-brand" onClick={closeMobile}>
              <div className="brand-icon-wrapper">
                <Recycle size={22} strokeWidth={2.4} />
              </div>
              <span>EcoCycle</span>
              <span className="brand-badge">BD</span>
            </Link>

            {/* Desktop Navigation Links */}
            <ul className="nav-links">
              {currentNavItems.map(item => {
                const Icon = item.icon
                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}
                    >
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </NavLink>
                  </li>
                )
              })}
            </ul>

            {/* Nav Controls */}
            <div className="nav-actions">
              {/* Quick Search Spotlight Button */}
              <button
                type="button"
                className="nav-search-btn"
                onClick={() => setIsCommandOpen(true)}
                title="Search (Ctrl + K)"
                aria-label="Search navigation"
              >
                <Search size={15} />
                <span className="desktop-only">Search</span>
                <span className="search-shortcut">⌘K</span>
              </button>

              {/* Theme Toggle Button */}
              <button
                type="button"
                className="btn-icon"
                onClick={toggleTheme}
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                aria-label="Toggle theme mode"
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>

              {/* User CTA Action */}
              {currentRole === 'user' && (
                <button
                  type="button"
                  className="btn btn-primary btn-sm desktop-only"
                  onClick={() => navigate('/user/request-pickup')}
                >
                  <PlusCircle size={16} />
                  <span>Request Pickup</span>
                </button>
              )}

              {/* Mobile Hamburger Toggle */}
              <button
                type="button"
                className="btn-icon mobile-toggle"
                onClick={() => setIsMobileMenuOpen(prev => !prev)}
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </nav>
        </div>

        {/* Mobile Dropdown Drawer */}
        {isMobileMenuOpen && (
          <div className="mobile-drawer">
            <div style={{ marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Signed in as <strong>{userProfile.name}</strong> ({userProfile.roleTitle})
            </div>
            <ul className="mobile-nav-list">
              {currentNavItems.map(item => {
                const Icon = item.icon
                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
                      onClick={closeMobile}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <Icon size={18} />
                        <span>{item.label}</span>
                      </div>
                    </NavLink>
                  </li>
                )
              })}
            </ul>
            {currentRole === 'user' && (
              <div className="mobile-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                  onClick={() => {
                    closeMobile()
                    navigate('/user/request-pickup')
                  }}
                >
                  <PlusCircle size={16} />
                  <span>Request Plastic Pickup</span>
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Global Command Palette */}
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />
    </>
  )
}

import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthRole } from '../context/AuthRoleContext'
import { 
  Search, 
  ArrowRight, 
  LayoutDashboard, 
  PlusCircle, 
  FileText, 
  User, 
  Truck, 
  Shield, 
  Building, 
  Users, 
  ListOrdered,
  X,
  Sparkles
} from 'lucide-react'

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const { switchRole } = useAuthRole()

  const items = [
    // Citizen (User) Pages
    { title: 'User Dashboard', subtitle: 'Recycling statistics & active request preview', path: '/user/dashboard', icon: LayoutDashboard, group: 'User Pages', role: 'user' },
    { title: 'Request Pickup', subtitle: 'Submit plastic waste pickup across 64 BD districts', path: '/user/request-pickup', icon: PlusCircle, group: 'User Pages', role: 'user' },
    { title: 'My Requests', subtitle: 'Track request history & live 5-step status', path: '/user/my-requests', icon: FileText, group: 'User Pages', role: 'user' },
    { title: 'User Profile', subtitle: 'Citizen contact & default address', path: '/user/profile', icon: User, group: 'User Pages', role: 'user' },

    // Collector Pages
    { title: 'Collector Dashboard', subtitle: 'Assigned district overview & daily pickup queue', path: '/collector/dashboard', icon: LayoutDashboard, group: 'Collector Pages', role: 'collector' },
    { title: 'District Requests', subtitle: 'View & update assigned plastic pickups', path: '/collector/requests', icon: ListOrdered, group: 'Collector Pages', role: 'collector' },
    { title: 'Collector Profile', subtitle: 'Vehicle & assigned district details', path: '/collector/profile', icon: User, group: 'Collector Pages', role: 'collector' },

    // Admin Pages
    { title: 'Admin Dashboard', subtitle: 'Nationwide plastic collection metrics & district analytics', path: '/admin/dashboard', icon: LayoutDashboard, group: 'Admin Pages', role: 'admin' },
    { title: 'Manage Users', subtitle: 'Registered citizens & status controls', path: '/admin/users', icon: Users, group: 'Admin Pages', role: 'admin' },
    { title: 'Manage Collectors', subtitle: 'Create collectors & assign 64 districts', path: '/admin/collectors', icon: Truck, group: 'Admin Pages', role: 'admin' },
    { title: 'All Pickup Requests', subtitle: 'Nationwide requests audit & manual assignment', path: '/admin/requests', icon: ListOrdered, group: 'Admin Pages', role: 'admin' },
    { title: 'Recycling Facilities', subtitle: 'Manage authorized recycling & waste-to-energy plants', path: '/admin/facilities', icon: Building, group: 'Admin Pages', role: 'admin' },

    // Switch role actions
    { title: 'Switch to Citizen (User) Mode', subtitle: 'Switch active view to Afia Jabin (Dhaka Citizen)', path: '/user/dashboard', icon: Sparkles, group: 'Role Switcher', roleAction: 'user' },
    { title: 'Switch to District Collector Mode', subtitle: 'Switch active view to Kabir Hossain (Dhaka Collector)', path: '/collector/dashboard', icon: Sparkles, group: 'Role Switcher', roleAction: 'collector' },
    { title: 'Switch to System Admin Mode', subtitle: 'Switch active view to Dr. Shahriar Rahman (Admin)', path: '/admin/dashboard', icon: Sparkles, group: 'Role Switcher', roleAction: 'admin' },
  ]

  const filtered = items.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) || 
    item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
    item.group.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setQuery('')
      setSelectedIndex(0)
    }
  }, [isOpen])

  const handleSelect = (item) => {
    if (item.roleAction) {
      switchRole(item.roleAction)
    } else if (item.role) {
      switchRole(item.role)
    }
    navigate(item.path)
    onClose()
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => (prev + 1) % (filtered.length || 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => (prev - 1 + (filtered.length || 1)) % (filtered.length || 1))
      } else if (e.key === 'Enter' && filtered[selectedIndex]) {
        e.preventDefault()
        handleSelect(filtered[selectedIndex])
      } else if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, filtered, selectedIndex, onClose])

  if (!isOpen) return null

  return (
    <div className="command-backdrop" onClick={onClose}>
      <div className="command-modal" onClick={e => e.stopPropagation()}>
        <div className="command-input-wrapper">
          <Search size={20} color="var(--text-muted)" />
          <input
            ref={inputRef}
            type="text"
            className="command-input"
            placeholder="Search pages (Dashboard, Requests, Users, Facilities...)"
            value={query}
            onChange={e => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
          />
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={18} />
          </button>
        </div>

        <div className="command-results">
          {filtered.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No results found for "{query}"
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title + item.path}
                  className={`command-item ${idx === selectedIndex ? 'selected' : ''}`}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  <div className="command-item-left">
                    <div style={{ 
                      width: 32, 
                      height: 32, 
                      borderRadius: 'var(--radius-sm)', 
                      background: item.roleAction ? 'var(--accent-light)' : 'var(--primary-light)', 
                      color: item.roleAction ? 'var(--accent)' : 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{item.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.subtitle}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <span>{item.group}</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              )
            })
          )}
        </div>

        <div className="command-footer">
          <span>Navigate with <kbd>↑</kbd> <kbd>↓</kbd></span>
          <span>Select with <kbd>Enter</kbd></span>
          <span>Close with <kbd>Esc</kbd></span>
        </div>
      </div>
    </div>
  )
}

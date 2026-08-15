import { createContext, useContext, useState, useEffect } from 'react'

const AuthRoleContext = createContext()

export const MOCK_USERS = {
  user: {
    id: 'usr-101',
    name: 'Afia Jabin',
    email: 'afia.jabin@gmail.com',
    role: 'user',
    roleTitle: 'Citizen / Household',
    phone: '+880 1712-345678',
    district: 'Dhaka',
    address: 'House 42, Road 9A, Dhanmondi, Dhaka - 1209',
    avatar: 'AJ',
    memberSince: 'January 2026',
    totalRecycledKg: 48,
    totalRequests: 6,
  },
  collector: {
    id: 'col-201',
    name: 'Kabir Hossain',
    email: 'kabir.collector@ecocycle.bd',
    role: 'collector',
    roleTitle: 'District Plastic Collector',
    phone: '+880 1819-876543',
    district: 'Dhaka',
    assignedDistricts: ['Dhaka', 'Gazipur'],
    vehicleType: 'Electric Waste Van (EV-04)',
    vehicleNumber: 'Dhaka Metro-DH-11-2045',
    avatar: 'KH',
    joinedDate: 'March 2025',
    rating: 4.9,
    totalCollections: 142,
  },
  admin: {
    id: 'adm-001',
    name: 'Dr. Shahriar Rahman',
    email: 'admin.shahriar@ecocycle.bd',
    role: 'admin',
    roleTitle: 'System Administrator',
    phone: '+880 1911-001122',
    district: 'Dhaka (HQ)',
    avatar: 'SR',
    accessLevel: 'Super Administrator',
  }
}

export function AuthRoleProvider({ children }) {
  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('ecocycle-active-role') || 'user'
  })

  // Dynamic user profile that defaults directly to MOCK_USERS
  const [customProfiles, setCustomProfiles] = useState(() => {
    const saved = localStorage.getItem('ecocycle-custom-profiles')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // Clean out any stale Rahim reference
        if (parsed.user?.name && parsed.user.name.includes('Rahim')) {
          delete parsed.user
          localStorage.setItem('ecocycle-custom-profiles', JSON.stringify(parsed))
        }
        return parsed
      } catch (e) {
        return {}
      }
    }
    return {}
  })

  const userProfile = {
    ...MOCK_USERS[currentRole],
    ...(customProfiles[currentRole] || {})
  }

  useEffect(() => {
    localStorage.setItem('ecocycle-active-role', currentRole)
  }, [currentRole])

  const switchRole = (newRole) => {
    if (MOCK_USERS[newRole]) {
      setCurrentRole(newRole)
    }
  }

  const updateCurrentUserProfile = (updates) => {
    setCustomProfiles(prev => {
      const updated = {
        ...prev,
        [currentRole]: {
          ...(prev[currentRole] || {}),
          ...updates
        }
      }
      localStorage.setItem('ecocycle-custom-profiles', JSON.stringify(updated))
      return updated
    })
  }

  const resetToCodeDefaults = () => {
    localStorage.clear()
    setCustomProfiles({})
    window.location.reload()
  }

  return (
    <AuthRoleContext.Provider value={{
      currentRole,
      userProfile,
      switchRole,
      updateCurrentUserProfile,
      resetToCodeDefaults,
      allRoles: ['user', 'collector', 'admin']
    }}>
      {children}
    </AuthRoleContext.Provider>
  )
}

export function useAuthRole() {
  const context = useContext(AuthRoleContext)
  if (!context) {
    throw new Error('useAuthRole must be used within an AuthRoleProvider')
  }
  return context
}

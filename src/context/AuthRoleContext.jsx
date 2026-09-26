import { createContext, useContext, useState, useEffect } from 'react'

const AuthRoleContext = createContext()

export const MOCK_USERS = {
  user: {
    id: 'mock-citizen-1',
    name: 'Sadia Sultana',
    email: 'sadia.citizen@ecocycle.bd',
    role: 'user',
    roleTitle: 'Citizen / Household',
    phone: '+880 1712-345678',
    district: 'Dhaka',
    address: 'House 42, Road 9A, Dhanmondi, Dhaka - 1209',
    memberSince: 'January 2026',
    totalRecycledKg: 48,
    totalRequests: 6,
  },

  collector: {
    id: 'mock-collector-1',
    name: 'Afia Jabin',
    email: 'afiajabin12@gmail.com',
    role: 'collector',
    roleTitle: 'District Plastic Collector',
    phone: '+880 1712-345678',
    district: 'Dhaka',
    assignedDistricts: ['Dhaka', 'Gazipur'],
    vehicleType: 'Electric Waste Van (EV-04)',
    vehicleNumber: 'Dhaka Metro-DH-11-2045',
    joinedDate: 'March 2025',
    rating: 5.0,
    totalCollections: 18,
  },

  admin: {
    id: 'mock-admin-1',
    name: 'Dr. Shahriar Rahman',
    email: 'admin@ecocycle.bd',
    role: 'admin',
    roleTitle: 'System Administrator',
    phone: '+880 1911-001122',
    district: 'Dhaka (HQ)',
    accessLevel: 'Super Administrator',
  },
}

function getLatestRoleUser(role) {
  try {
    const saved = localStorage.getItem(`ecocycle-latest-${role}`)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (error) {
    console.error(`Could not read latest user for role ${role}:`, error)
  }
  return null
}

function normalizeRole(role) {
if (role === 'citizen') {
return 'user'
}

if (role === 'user') {
return 'user'
}

if (role === 'collector') {
return 'collector'
}

if (role === 'admin') {
return 'admin'
}

return null
}

function getAvatar(name) {
if (!name) {
return 'US'
}

return name
.split(' ')
.filter(Boolean)
.map(word => word[0])
.join('')
.slice(0, 2)
.toUpperCase()
}

function getRoleTitle(role) {
if (role === 'collector') {
return 'District Plastic Collector'
}

if (role === 'admin') {
return 'System Administrator'
}

return 'Citizen / Household'
}

export function AuthRoleProvider({ children }) {
const [loggedInUser, setLoggedInUser] = useState(() => {
const savedUser = localStorage.getItem('user')


if (!savedUser) {
  return null
}

try {
  return JSON.parse(savedUser)
} catch (error) {
  console.error('Could not read logged-in user:', error)
  return null
}


})

const [actualRole, setActualRole] = useState(() => {
const savedUser = localStorage.getItem('user')


if (!savedUser) {
  return null
}

try {
  const user = JSON.parse(savedUser)
  return normalizeRole(user.role)
} catch (error) {
  console.error('Could not read user role:', error)
  return null
}


})

const [currentRole, setCurrentRole] = useState(() => {
const savedActiveRole = localStorage.getItem('ecocycle-active-role')
if (savedActiveRole && ['user', 'collector', 'admin'].includes(savedActiveRole)) {
  return savedActiveRole
}

const savedUser = localStorage.getItem('user')
if (!savedUser) {
  return 'user'
}

try {
  const user = JSON.parse(savedUser)
  return normalizeRole(user.role) || 'user'
} catch (error) {
  console.error('Could not read current role:', error)
  return 'user'
}
})

const [customProfiles, setCustomProfiles] = useState(() => {
const saved = localStorage.getItem('ecocycle-custom-profiles')


if (!saved) {
  return {}
}

try {
  return JSON.parse(saved)
} catch (error) {
  console.error('Could not read custom profiles:', error)
  return {}
}


})

useEffect(() => {
const syncLoggedInUser = () => {
const savedUser = localStorage.getItem('user')

  if (!savedUser) {
    setLoggedInUser(null)
    setActualRole(null)
    setCurrentRole('user')
    return
  }

  try {
    const user = JSON.parse(savedUser)
    const role = normalizeRole(user.role)

    setLoggedInUser(user)
    setActualRole(role)

    if (role) {
      try {
        localStorage.setItem(`ecocycle-latest-${role}`, JSON.stringify(user))
      } catch (e) {}
    }

    const savedActive = localStorage.getItem('ecocycle-active-role')
    if (role !== 'admin') {
      setCurrentRole(role || 'user')
    } else if (savedActive && ['user', 'collector', 'admin'].includes(savedActive)) {
      setCurrentRole(savedActive)
    } else {
      setCurrentRole('admin')
    }
  } catch (error) {
    console.error('Could not synchronize logged-in user:', error)
    setLoggedInUser(null)
    setActualRole(null)
    setCurrentRole('user')
  }
}

if (loggedInUser && actualRole) {
  try {
    localStorage.setItem(`ecocycle-latest-${actualRole}`, JSON.stringify(loggedInUser))
  } catch (e) {}
}

window.addEventListener('storage', syncLoggedInUser)
window.addEventListener('auth-changed', syncLoggedInUser)

return () => {
  window.removeEventListener('storage', syncLoggedInUser)
  window.removeEventListener('auth-changed', syncLoggedInUser)
}


}, [currentRole, loggedInUser, actualRole])

useEffect(() => {
if (loggedInUser && actualRole) {
localStorage.setItem('ecocycle-active-role', currentRole)
}
}, [currentRole, loggedInUser, actualRole])

const activeRole = currentRole || actualRole || 'user'
const roleDefaults = MOCK_USERS[activeRole] || {}

let roleUser = null

if (loggedInUser && actualRole === activeRole) {
  roleUser = loggedInUser
} else {
  const latestForRole = getLatestRoleUser(activeRole)
  roleUser = latestForRole || roleDefaults
}

const userProfile = {
  ...roleDefaults,
  ...roleUser,
  role: activeRole,
  roleTitle: getRoleTitle(activeRole),
  avatar: getAvatar(roleUser?.name || roleDefaults.name),
}

const switchRole = (newRole) => {
if (!loggedInUser || !actualRole) {
return
}


if (actualRole === 'admin') {
  if (['user', 'collector', 'admin'].includes(newRole)) {
    setCurrentRole(newRole)

    localStorage.setItem(
      'ecocycle-active-role',
      newRole
    )
  }

  return
}

if (newRole === actualRole) {
  setCurrentRole(actualRole)

  localStorage.setItem(
    'ecocycle-active-role',
    actualRole
  )

  return
}

console.warn(
  `Access denied. This account is registered as "${actualRole}".`
)


}

const updateCurrentUserProfile = (updates) => {
if (!loggedInUser) {
return
}


const updatedUser = {
  ...loggedInUser,
  ...updates,
  role: loggedInUser.role,
}

localStorage.setItem(
  'user',
  JSON.stringify(updatedUser)
)

if (actualRole) {
  try {
    localStorage.setItem('ecocycle-latest-' + actualRole, JSON.stringify(updatedUser))
  } catch (e) {}
}

setLoggedInUser(updatedUser)

const profileKey =
  loggedInUser.id || loggedInUser.email

setCustomProfiles(prev => {
  const updatedProfiles = {
    ...prev,
    [profileKey]: {
      ...(prev[profileKey] || {}),
      ...updates,
    },
  }

  localStorage.setItem(
    'ecocycle-custom-profiles',
    JSON.stringify(updatedProfiles)
  )

  return updatedProfiles
})

window.dispatchEvent(new Event('auth-changed'))

}

const resetToCodeDefaults = () => {
localStorage.clear()
setCustomProfiles({})
setLoggedInUser(null)
setActualRole(null)
setCurrentRole('user')
window.location.reload()
}

return (
<AuthRoleContext.Provider
value={{
currentRole,
actualRole,
loggedInUser,
userProfile,
switchRole,
updateCurrentUserProfile,
resetToCodeDefaults,
allRoles: ['user', 'collector', 'admin'],
}}
>
{children}
</AuthRoleContext.Provider>
)
}

export function useAuthRole() {
const context = useContext(AuthRoleContext)

if (!context) {
throw new Error(
'useAuthRole must be used within an AuthRoleProvider'
)
}

return context
}

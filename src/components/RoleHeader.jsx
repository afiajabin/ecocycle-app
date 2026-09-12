import { useNavigate } from 'react-router-dom'
import { useAuthRole } from '../context/AuthRoleContext'
import { logoutUser } from '../services/api'
import { User, Truck, Shield, Sparkles, LogOut } from 'lucide-react'

export default function RoleHeader() {
  const {
    currentRole,
    actualRole,
    switchRole,
    userProfile,
  } = useAuthRole()

  const navigate = useNavigate()

  const roles = [
    {
      id: 'user',
      label: 'Citizen / User',
      icon: User,
      targetPath: '/user/dashboard',
    },
    {
      id: 'collector',
      label: 'District Collector',
      icon: Truck,
      targetPath: '/collector/dashboard',
    },
    {
      id: 'admin',
      label: 'System Admin',
      icon: Shield,
      targetPath: '/admin/dashboard',
    },
  ]

  const canAccessRole = (roleId) => {
    if (actualRole === 'admin') {
      return true
    }
    return actualRole === roleId
  }

  const handleSwitch = (roleId, targetPath) => {
    if (!canAccessRole(roleId)) {
      return
    }
    switchRole(roleId)
    navigate(targetPath)
  }

  const handleSignOut = async () => {
    if (window.confirm('Are you sure you want to sign out from EcoCycle?')) {
      await logoutUser()
      window.location.href = '/login'
    }
  }

  return (
    <div
      style={{
        background: 'var(--bg-surface-elevated)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '0.5rem 0',
        fontSize: '0.85rem',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              fontWeight: 700,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              fontSize: '0.72rem',
              letterSpacing: '0.05em',
            }}
          >
            Active Portal:
          </span>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.2rem 0.65rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              fontWeight: 700,
              fontSize: '0.8rem',
            }}
          >
            <Sparkles size={12} />
            {currentRole === 'user'
              ? 'Citizen / Household'
              : currentRole === 'collector'
                ? 'District Plastic Collector'
                : 'System Administrator'}
            {userProfile?.name ? ` (${userProfile.name})` : ''}
          </span>

          {userProfile?.district && (
            <span
              style={{
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
              }}
            >
              • District: <strong>{userProfile.district}</strong>
            </span>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flexWrap: 'wrap',
          }}
        >
          {/* Portal Switcher Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: 'var(--bg-surface)',
              padding: '0.2rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {roles.map(role => {
              const Icon = role.icon
              const isActive = currentRole === role.id
              const allowed = canAccessRole(role.id)

              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => handleSwitch(role.id, role.targetPath)}
                  disabled={!allowed}
                  title={
                    allowed
                      ? `Open ${role.label}`
                      : 'You do not have access to this portal'
                  }
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.3rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    cursor: allowed ? 'pointer' : 'not-allowed',
                    fontSize: '0.8rem',
                    fontWeight: isActive ? 700 : 500,
                    background: isActive ? 'var(--primary)' : 'transparent',
                    color: isActive
                      ? '#ffffff'
                      : allowed
                        ? 'var(--text-secondary)'
                        : 'var(--text-muted)',
                    opacity: allowed ? 1 : 0.45,
                    transition: 'var(--transition)',
                  }}
                >
                  <Icon size={13} />
                  <span>{role.label}</span>
                </button>
              )
            })}
          </div>

          {/* Global Sign Out Button */}
          <button
            type="button"
            onClick={handleSignOut}
            title="Sign Out from account"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.3rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              background: 'rgba(239, 68, 68, 0.08)',
              color: 'var(--error, #ef4444)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'var(--transition)',
            }}
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  )
}

import { useNavigate } from 'react-router-dom'
import { useAuthRole } from '../context/AuthRoleContext'
import { User, Truck, Shield, ArrowRight, Sparkles } from 'lucide-react'

export default function RoleHeader() {
  const { currentRole, switchRole, userProfile } = useAuthRole()
  const navigate = useNavigate()

  const roles = [
    {
      id: 'user',
      label: 'Citizen / User',
      icon: User,
      badge: 'Household Portal',
      targetPath: '/user/dashboard',
      desc: 'Submit & track plastic waste pickups'
    },
    {
      id: 'collector',
      label: 'District Collector',
      icon: Truck,
      badge: 'Field Operations',
      targetPath: '/collector/dashboard',
      desc: 'District pickup routes & facility drop-offs'
    },
    {
      id: 'admin',
      label: 'System Admin',
      icon: Shield,
      badge: 'Centralized Control',
      targetPath: '/admin/dashboard',
      desc: 'Users, collectors, requests & facilities'
    }
  ]

  const handleSwitch = (roleId, targetPath) => {
    switchRole(roleId)
    navigate(targetPath)
  }

  return (
    <div style={{
      background: 'var(--bg-surface-elevated)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '0.5rem 0',
      fontSize: '0.85rem'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.05em' }}>
            Active Portal:
          </span>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.2rem 0.65rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            fontWeight: 700,
            fontSize: '0.8rem'
          }}>
            <Sparkles size={12} />
            {userProfile.roleTitle} ({userProfile.name})
          </span>
          {userProfile.district && (
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              • District: <strong>{userProfile.district}</strong>
            </span>
          )}
        </div>

        {/* Role Selector Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'var(--bg-surface)', padding: '0.2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          {roles.map(r => {
            const Icon = r.icon
            const isActive = currentRole === r.id
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => handleSwitch(r.id, r.targetPath)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.3rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: isActive ? 700 : 500,
                  background: isActive ? 'var(--primary)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  transition: 'var(--transition)'
                }}
              >
                <Icon size={13} />
                <span>{r.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

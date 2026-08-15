import { Check, Clock, Truck, Building, Award, X } from 'lucide-react'

export default function RequestStepTracker({ status }) {
  const steps = [
    { key: 'Pending', label: '1. Request Submitted', icon: Clock },
    { key: 'Accepted', label: '2. Collector Assigned', icon: Truck },
    { key: 'Collected', label: '3. Waste Collected', icon: Check },
    { key: 'Delivered to Facility', label: '4. Delivered to Plant', icon: Building },
    { key: 'Completed', label: '5. Completed', icon: Award },
  ]

  if (status === 'Cancelled') {
    return (
      <div style={{
        background: 'var(--danger-light)',
        border: '1px solid hsla(0, 72%, 52%, 0.3)',
        borderRadius: 'var(--radius-md)',
        padding: '0.85rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem',
        color: 'var(--danger)',
        fontSize: '0.88rem',
        fontWeight: 600
      }}>
        <X size={18} />
        <span>This pickup request was cancelled.</span>
      </div>
    )
  }

  const getStepIndex = (st) => {
    switch (st) {
      case 'Pending': return 0
      case 'Accepted': return 1
      case 'Collected': return 2
      case 'Delivered to Facility': return 3
      case 'Completed': return 4
      default: return 0
    }
  }

  const currentIndex = getStepIndex(status)

  return (
    <div style={{ margin: '1.25rem 0', width: '100%' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '0.5rem',
        position: 'relative'
      }}>
        {steps.map((step, idx) => {
          const isDone = idx <= currentIndex
          const isCurrent = idx === currentIndex
          const Icon = step.icon

          return (
            <div key={step.key} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 700,
                background: isDone ? 'var(--primary)' : 'var(--bg-surface-elevated)',
                color: isDone ? '#ffffff' : 'var(--text-muted)',
                border: isCurrent ? '2px solid var(--accent)' : '1px solid var(--border-subtle)',
                boxShadow: isCurrent ? '0 0 0 3px var(--primary-glow)' : 'none',
                transition: 'var(--transition)'
              }}>
                <Icon size={14} />
              </div>
              <div style={{
                fontSize: '0.72rem',
                fontWeight: isDone ? 700 : 500,
                color: isDone ? 'var(--text-primary)' : 'var(--text-muted)',
                lineHeight: 1.2
              }}>
                {step.label}
              </div>
            </div>
          )
        })}
      </div>

      {/* Progress Bar Line */}
      <div style={{
        height: 4,
        background: 'var(--bg-surface-elevated)',
        borderRadius: 2,
        margin: '0.75rem 2rem 0 2rem',
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          width: `${(currentIndex / 4) * 100}%`,
          background: 'var(--primary)',
          transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}></div>
      </div>
    </div>
  )
}

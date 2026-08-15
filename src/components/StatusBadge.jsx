import { Clock, CheckCircle2, Truck, Building, XCircle, AlertCircle } from 'lucide-react'

export default function StatusBadge({ status, size = 'md' }) {
  const configs = {
    'Pending': {
      label: 'Pending Assignment',
      bg: 'var(--warm-accent-light)',
      color: 'var(--warm-accent)',
      border: 'hsla(38, 92%, 48%, 0.3)',
      icon: Clock
    },
    'Accepted': {
      label: 'Collector Assigned',
      bg: 'var(--info-light)',
      color: 'var(--info)',
      border: 'hsla(205, 85%, 50%, 0.3)',
      icon: Truck
    },
    'Collected': {
      label: 'Waste Collected',
      bg: 'hsl(255, 60%, 95%)',
      color: 'hsl(255, 65%, 45%)',
      border: 'hsla(255, 65%, 45%, 0.3)',
      icon: CheckCircle2
    },
    'Delivered to Facility': {
      label: 'Delivered to Facility',
      bg: 'hsl(280, 60%, 95%)',
      color: 'hsl(280, 70%, 42%)',
      border: 'hsla(280, 70%, 42%, 0.3)',
      icon: Building
    },
    'Completed': {
      label: 'Completed & Recycled',
      bg: 'var(--primary-light)',
      color: 'var(--primary)',
      border: 'var(--primary-border)',
      icon: CheckCircle2
    },
    'Cancelled': {
      label: 'Cancelled',
      bg: 'var(--danger-light)',
      color: 'var(--danger)',
      border: 'hsla(0, 72%, 52%, 0.3)',
      icon: XCircle
    }
  }

  const config = configs[status] || {
    label: status || 'Unknown',
    bg: 'var(--bg-surface-elevated)',
    color: 'var(--text-secondary)',
    border: 'var(--border-subtle)',
    icon: AlertCircle
  }

  const Icon = config.icon
  const fontSize = size === 'sm' ? '0.72rem' : size === 'lg' ? '0.88rem' : '0.78rem'
  const padding = size === 'sm' ? '0.15rem 0.5rem' : size === 'lg' ? '0.35rem 0.85rem' : '0.25rem 0.65rem'

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding,
        fontSize,
        fontWeight: 600,
        borderRadius: 'var(--radius-full)',
        background: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`,
        whiteSpace: 'nowrap'
      }}
    >
      <Icon size={size === 'sm' ? 11 : size === 'lg' ? 15 : 13} />
      <span>{config.label}</span>
    </span>
  )
}

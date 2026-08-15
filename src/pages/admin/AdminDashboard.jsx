import { Link, useNavigate } from 'react-router-dom'
import { useAuthRole } from '../../context/AuthRoleContext'
import { useData } from '../../context/DataContext'
import StatusBadge from '../../components/StatusBadge'
import { 
  Shield, 
  Users, 
  Truck, 
  ListOrdered, 
  Building, 
  Recycle, 
  BarChart3, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  Clock,
  TrendingUp,
  AlertCircle
} from 'lucide-react'

export default function AdminDashboard() {
  const { userProfile } = useAuthRole()
  const { requests, users, collectors, facilities, allDistricts } = useData()
  const navigate = useNavigate()

  const pendingRequests = requests.filter(r => r.status === 'Pending')
  const inProgressRequests = requests.filter(r => r.status === 'Accepted' || r.status === 'Collected' || r.status === 'Delivered to Facility')
  const completedRequests = requests.filter(r => r.status === 'Completed')
  
  const totalPlasticKg = requests
    .filter(r => r.status !== 'Cancelled')
    .reduce((acc, r) => acc + (Number(r.verifiedKg || r.estimatedKg) || 0), 0)

  const totalTonsDiverted = (totalPlasticKg / 1000).toFixed(2)

  // Calculate top districts by request volume
  const districtCounts = {}
  requests.forEach(r => {
    districtCounts[r.district] = (districtCounts[r.district] || 0) + 1
  })

  const sortedDistricts = Object.entries(districtCounts).sort((a, b) => b[1] - a[1])

  return (
    <div className="section">
      <div className="container">
        {/* Admin Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div>
            <span className="section-tag">
              <Shield size={14} /> National Command Center
            </span>
            <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', marginTop: '0.35rem' }}>
              EcoCycle System Administration
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Centralized monitoring for plastic waste collection, 64-district logistics, collector accounts, and authorized recycling facilities.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate('/admin/requests')}
            >
              <ListOrdered size={16} />
              <span>All Requests ({requests.length})</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/admin/facilities')}
            >
              <Building size={16} />
              <span>Facilities ({facilities.length})</span>
            </button>
          </div>
        </div>

        {/* 5 Main Admin KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.25rem', marginBottom: '2.5rem' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.65rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={18} />
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Citizens</span>
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800 }}>
              {users.length}
            </div>
            <Link to="/admin/users" style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.35rem' }}>
              Manage Users <ArrowRight size={12} />
            </Link>
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.65rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--info-light)', color: 'var(--info)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Truck size={18} />
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Collectors</span>
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800 }}>
              {collectors.length}
            </div>
            <Link to="/admin/collectors" style={{ fontSize: '0.78rem', color: 'var(--info)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.35rem' }}>
              District Fleet <ArrowRight size={12} />
            </Link>
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.65rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--warm-accent-light)', color: 'var(--warm-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={18} />
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pending</span>
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--warm-accent)' }}>
              {pendingRequests.length}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Awaiting Collector</span>
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.65rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'hsl(280, 60%, 95%)', color: 'hsl(280, 70%, 42%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building size={18} />
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Facilities</span>
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800 }}>
              {facilities.length}
            </div>
            <Link to="/admin/facilities" style={{ fontSize: '0.78rem', color: 'hsl(280, 70%, 42%)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.35rem' }}>
              Active Plants <ArrowRight size={12} />
            </Link>
          </div>

          <div className="card" style={{ padding: '1.5rem', background: 'var(--primary-light)', borderColor: 'var(--primary-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.65rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Recycle size={18} />
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700 }}>Total Plastic</span>
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>
              {totalTonsDiverted} <span style={{ fontSize: '1rem' }}>Tons</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>Verified Diverted</span>
          </div>
        </div>

        {/* Analytics & District Distribution Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem', marginBottom: '2.5rem' }}>
          {/* Recent Nationwide Requests Table */}
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2>Live Request Stream</h2>
                <p style={{ fontSize: '0.88rem' }}>Real-time updates from Bangladesh districts</p>
              </div>
              <Link to="/admin/requests" className="btn btn-outline btn-sm">
                View All ({requests.length}) <ArrowRight size={14} />
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {requests.slice(0, 4).map(req => (
                <div key={req.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.88rem',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <strong>#{req.id}</strong>
                      <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>{req.district}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>• {req.userName}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      {req.plasticTypes.join(', ')} (~{req.estimatedKg} kg) • {new Date(req.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <StatusBadge status={req.status} size="sm" />
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => navigate('/admin/requests')}
                    >
                      Audit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* District Breakdown */}
          <div className="card" style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '0.5rem' }}>District-Wise Volume</h2>
            <p style={{ fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              Plastic waste collection density across active divisions
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {sortedDistricts.map(([districtName, count]) => {
                const percentage = Math.round((count / requests.length) * 100)
                return (
                  <div key={districtName}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <MapPin size={13} color="var(--primary)" /> {districtName}
                      </span>
                      <span style={{ color: 'var(--text-muted)' }}>{count} requests ({percentage}%)</span>
                    </div>
                    <div style={{ height: 8, background: 'var(--bg-surface-elevated)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: `${percentage}%`, height: '100%', background: 'var(--primary)' }}></div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Total 64 districts supported. District collectors automatically filter pending pickups.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

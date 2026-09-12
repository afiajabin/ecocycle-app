import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthRole } from '../../context/AuthRoleContext'
import { getAdminStats, getAdminRequests, logoutUser } from '../../services/api'
import StatusBadge from '../../components/StatusBadge'
import { 
  Shield, 
  Users, 
  Truck, 
  ListOrdered, 
  Building, 
  Recycle, 
  MapPin, 
  ArrowRight, 
  Clock,
  LogOut,
  RefreshCw
} from 'lucide-react'

export default function AdminDashboard() {
  const { userProfile } = useAuthRole()
  const navigate = useNavigate()

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCitizens: 0,
    totalCollectors: 0,
    totalFacilities: 0,
    totalRequests: 0,
    pendingRequests: 0,
    acceptedRequests: 0,
    collectedRequests: 0,
    deliveredRequests: 0,
    completedRequests: 0,
    totalRecycledKg: 0,
    totalPlantReceivedKg: 0,
    plasticBreakdown: {},
  })
  const [recentRequests, setRecentRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError('')
      const [statsRes, reqsRes] = await Promise.all([
        getAdminStats(),
        getAdminRequests(),
      ])

      if (statsRes.success) {
        setStats(statsRes.data)
      }
      if (reqsRes.success) {
        setRecentRequests(reqsRes.data)
      }
    } catch (err) {
      console.error('Failed to load admin dashboard data:', err)
      setError(err.message || 'Could not connect to the server')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const handleSignOut = async () => {
    if (window.confirm('Are you sure you want to sign out from Admin Portal?')) {
      await logoutUser()
      window.location.href = '/login'
    }
  }

  const totalTonsDiverted = (stats.totalRecycledKg / 1000).toFixed(2)

  // Calculate district counts
  const districtCounts = {}
  recentRequests.forEach(r => {
    districtCounts[r.district] = (districtCounts[r.district] || 0) + 1
  })
  const sortedDistricts = Object.entries(districtCounts).sort((a, b) => b[1] - a[1])

  return (
    <div className="section">
      <div className="container">
        {/* Admin Header with Sign Out */}
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

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={fetchDashboardData}
              disabled={loading}
              title="Refresh live system stats"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => navigate('/admin/requests')}
            >
              <ListOrdered size={15} />
              <span>All Requests ({stats.totalRequests})</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => navigate('/admin/facilities')}
            >
              <Building size={15} />
              <span>Facilities ({stats.totalFacilities})</span>
            </button>

            <button
              type="button"
              className="btn btn-outline btn-sm"
              style={{ color: 'var(--error, #ef4444)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
              onClick={handleSignOut}
              title="Sign Out from account"
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="card" style={{ background: '#fef2f2', borderColor: '#fca5a5', color: '#991b1b', marginBottom: '2rem', padding: '1rem' }}>
            <strong>Server Error:</strong> {error}
          </div>
        )}

        {/* 5 Main Admin KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.65rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={18} />
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Citizens</span>
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800 }}>
              {stats.totalCitizens}
            </div>
            <Link to="/admin/users" style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.35rem' }}>
              Manage Users <ArrowRight size={12} />
            </Link>
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.65rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--info-light, #e0f2fe)', color: 'var(--info, #0284c7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Truck size={18} />
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Collectors</span>
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800 }}>
              {stats.totalCollectors}
            </div>
            <Link to="/admin/collectors" style={{ fontSize: '0.78rem', color: 'var(--info, #0284c7)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.35rem' }}>
              District Fleet <ArrowRight size={12} />
            </Link>
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.65rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--warm-accent-light, #fef3c7)', color: 'var(--warm-accent, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={18} />
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pending</span>
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--warm-accent, #d97706)' }}>
              {stats.pendingRequests}
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
              {stats.totalFacilities}
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
            <span style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>({stats.totalRecycledKg} kg total)</span>
          </div>
        </div>

        {/* Analytics & District Distribution Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
          {/* Recent Nationwide Requests Table */}
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2>Live Request Stream</h2>
                <p style={{ fontSize: '0.88rem' }}>Real-time updates from Bangladesh districts</p>
              </div>
              <Link to="/admin/requests" className="btn btn-outline btn-sm">
                View All ({recentRequests.length}) <ArrowRight size={14} />
              </Link>
            </div>

            {loading ? (
              <p style={{ color: 'var(--text-secondary)', padding: '2rem', textAlign: 'center' }}>Loading request stream...</p>
            ) : recentRequests.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', padding: '2rem', textAlign: 'center' }}>No requests created yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {recentRequests.slice(0, 5).map(req => (
                  <div key={req._id || req.requestId} style={{
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
                        <strong>#{req.requestId}</strong>
                        <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>{req.district}</span>
                        <span style={{ color: 'var(--text-secondary)' }}>• {req.userName}</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        {(req.plasticTypes || []).join(', ')} (~{req.estimatedKg} kg)
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
            )}
          </div>

          {/* District Breakdown */}
          <div className="card" style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '0.5rem' }}>District-Wise Volume</h2>
            <p style={{ fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              Plastic waste collection density across active divisions
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {sortedDistricts.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No district data yet.</p>
              ) : (
                sortedDistricts.map(([districtName, count]) => {
                  const percentage = recentRequests.length ? Math.round((count / recentRequests.length) * 100) : 0
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
                })
              )}
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

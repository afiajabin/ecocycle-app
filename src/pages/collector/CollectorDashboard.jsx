import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthRole } from '../../context/AuthRoleContext'
import { getCollectorStats, getDistrictRequests } from '../../services/api'
import StatusBadge from '../../components/StatusBadge'
import { 
  Truck, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Building, 
  ArrowRight, 
  Recycle, 
  RefreshCw,
  Phone
} from 'lucide-react'

export default function CollectorDashboard() {
  const { userProfile } = useAuthRole()
  const navigate = useNavigate()

  const [stats, setStats] = useState({
    pendingCount: 0,
    acceptedCount: 0,
    inTransitCount: 0,
    deliveredCount: 0,
    totalCollectedKg: 0,
    totalRequestsInJurisdiction: 0,
    assignedDistricts: ['Dhaka', 'Gazipur'],
  })
  const [districtRequests, setDistrictRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const assignedDistricts = stats.assignedDistricts?.length
    ? stats.assignedDistricts
    : userProfile.assignedDistricts || [userProfile.district || 'Dhaka']

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError('')
      const [statsRes, reqsRes] = await Promise.all([
        getCollectorStats(),
        getDistrictRequests({ status: 'all' }),
      ])

      if (statsRes.success) {
        setStats(statsRes.data)
      }
      if (reqsRes.success) {
        setDistrictRequests(reqsRes.data)
      }
    } catch (err) {
      console.error('Failed to load collector dashboard data:', err)
      setError(err.message || 'Could not connect to the backend server.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])



  return (
    <div className="section">
      <div className="container">
        {/* Collector Welcome & Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span className="section-tag">
                <Truck size={14} /> District Waste Logistics
              </span>
              <span className="badge badge-accent">
                Vehicle: {userProfile.vehicleType || 'Electric Van (EV-04)'}
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', marginTop: '0.35rem' }}>
              Collector Hub: {userProfile.name}
            </h1>
            
            <p style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.35rem' }}>
              <MapPin size={15} color="var(--primary)" />
              <span>Assigned Jurisdiction: <strong>{assignedDistricts.join(', ')}</strong> (Live territory sync)</span>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={fetchDashboardData}
              title="Refresh live data"
              disabled={loading}
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => navigate('/collector/requests')}
            >
              <span>Manage Requests ({districtRequests.length})</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {error && (
          <div className="card" style={{ background: '#fef2f2', borderColor: '#fca5a5', color: '#991b1b', marginBottom: '2rem', padding: '1rem' }}>
            <strong>Server Connection Error:</strong> {error}
          </div>
        )}

        {/* 4 Collector KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--warm-accent-light, #fef3c7)', color: 'var(--warm-accent, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={20} />
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>New in District</span>
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, color: 'var(--warm-accent, #d97706)' }}>
              {stats.pendingCount}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              Pending citizen requests in {assignedDistricts.join('/')}
            </p>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--info-light, #e0f2fe)', color: 'var(--info, #0284c7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Truck size={20} />
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Accepted Pickups</span>
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, color: 'var(--info, #0284c7)' }}>
              {stats.acceptedCount}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              Scheduled for collection today
            </p>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Recycle size={20} />
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Collected</span>
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>
              {stats.totalCollectedKg} <span style={{ fontSize: '1rem', fontWeight: 600 }}>kg</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              Plastic collected across assigned zones
            </p>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'hsl(280, 60%, 95%)', color: 'hsl(280, 70%, 42%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building size={20} />
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Facility Deliveries</span>
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, color: 'hsl(280, 70%, 42%)' }}>
              {stats.deliveredCount}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              Delivered to authorized recycling plants
            </p>
          </div>
        </div>

        {/* Priority District Queue Section */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2>Priority District Collection Queue</h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Citizen requests within your assigned territory ({assignedDistricts.join(', ')})
              </p>
            </div>
            <Link to="/collector/requests" className="btn btn-outline btn-sm">
              View All ({districtRequests.length}) <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: 'var(--text-secondary)' }}>Loading district pickup stream from server...</p>
            </div>
          ) : districtRequests.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-surface-elevated)' }}>
              <h3>No Active Requests in {assignedDistricts.join(', ')}</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                All district pickups have been cleared or delivered.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {districtRequests.slice(0, 3).map(req => (
                <div key={req._id || req.requestId} className="card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                      <strong style={{ fontSize: '1.1rem' }}>#{req.requestId}</strong>
                      <StatusBadge status={req.status} />
                      <span className="badge badge-success">{req.district}</span>
                    </div>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
                      <span><strong>Citizen:</strong> {req.userName} ({req.userPhone})</span>
                      <span><strong>Location:</strong> {req.address}</span>
                      <span><strong>Est. Weight:</strong> {req.estimatedKg} kg ({(req.plasticTypes || []).join(', ')})</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => navigate('/collector/requests')}
                  >
                    <span>Update Status</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Operating Guidelines Card for Collectors */}
        <div className="card" style={{ background: 'var(--bg-surface-elevated)' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>District Collector Operating Standards</h3>
          <ul style={{ listStyle: 'none', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <CheckCircle2 size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: 3 }} />
              <span>Verify weight with digital hook scale before marking as "Collected".</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <CheckCircle2 size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: 3 }} />
              <span>Deliver exclusively to authorized mechanical recycling or waste-to-energy centers.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

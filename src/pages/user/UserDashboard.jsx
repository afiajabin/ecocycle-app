import { Link, useNavigate } from 'react-router-dom'
import { useAuthRole } from '../../context/AuthRoleContext'
import { useData } from '../../context/DataContext'
import StatusBadge from '../../components/StatusBadge'
import RequestStepTracker from '../../components/RequestStepTracker'
import { 
  PlusCircle, 
  Recycle, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Truck, 
  Leaf, 
  AlertTriangle, 
  Sparkles,
  MapPin,
  Calendar,
  Layers
} from 'lucide-react'

export default function UserDashboard() {
  const { userProfile } = useAuthRole()
  const { requests } = useData()
  const navigate = useNavigate()

  // Filter requests for the current user
  const userRequests = requests.filter(r => r.userId === userProfile.id || r.userName === userProfile.name)
  
  // Find most recent active request
  const activeRequest = userRequests.find(r => r.status !== 'Completed' && r.status !== 'Cancelled')
  const completedCount = userRequests.filter(r => r.status === 'Completed').length
  const totalKg = userRequests
    .filter(r => r.status !== 'Cancelled')
    .reduce((acc, r) => acc + (Number(r.verifiedKg || r.estimatedKg) || 0), 0)

  return (
    <div className="section">
      <div className="container">
        {/* Welcome Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div>
            <span className="section-tag">
              <Leaf size={14} /> Citizen Recycling Portal
            </span>
            <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', marginTop: '0.5rem' }}>
              Welcome back, {userProfile.name}
            </h1>
            <p style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem' }}>
              <MapPin size={15} color="var(--primary)" />
              <span>{userProfile.address || 'Dhaka, Bangladesh'}</span>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate('/user/request-pickup')}
            >
              <PlusCircle size={17} />
              <span>Submit Pickup Request</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/user/my-requests')}
            >
              <span>View All Requests ({userRequests.length})</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Recycle size={20} />
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Recycled</span>
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>
              {totalKg} <span style={{ fontSize: '1rem', fontWeight: 600 }}>kg</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              Diverted from Dhaka waterways & landfills
            </p>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--info-light)', color: 'var(--info)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={20} />
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Requests</span>
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, color: 'var(--info)' }}>
              {activeRequest ? 1 : 0}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              {activeRequest ? `Current status: ${activeRequest.status}` : 'No pickups in transit'}
            </p>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--warm-accent-light)', color: 'var(--warm-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={20} />
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Completed</span>
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, color: 'var(--warm-accent)' }}>
              {completedCount}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              Delivered to authorized recycling plants
            </p>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--accent-light)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={20} />
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>CO₂ Offset</span>
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, color: 'var(--accent)' }}>
              ~{Math.round(totalKg * 1.5)} <span style={{ fontSize: '1rem', fontWeight: 600 }}>kg</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              Fossil greenhouse gases prevented
            </p>
          </div>
        </div>

        {/* Live Active Request Tracker Card */}
        {activeRequest ? (
          <div className="card" style={{ marginBottom: '2.5rem', padding: '2rem', border: '1.5px solid var(--primary-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <span className="badge badge-accent" style={{ marginBottom: '0.4rem' }}>
                  Live Status Tracking
                </span>
                <h2>Request #{activeRequest.id}</h2>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                  <span><Calendar size={13} style={{ display: 'inline', marginRight: 4 }} /> {activeRequest.preferredDate} ({activeRequest.preferredTime})</span>
                  <span><MapPin size={13} style={{ display: 'inline', marginRight: 4 }} /> {activeRequest.district}</span>
                  <span><Layers size={13} style={{ display: 'inline', marginRight: 4 }} /> ~{activeRequest.estimatedKg} kg ({activeRequest.plasticTypes.join(', ')})</span>
                </div>
              </div>
              <StatusBadge status={activeRequest.status} size="lg" />
            </div>

            {/* 5-Step Visual Progress Bar */}
            <RequestStepTracker status={activeRequest.status} />

            {/* Assigned Details Box */}
            <div style={{
              background: 'var(--bg-surface-elevated)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              marginTop: '1.5rem',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1.25rem',
              fontSize: '0.88rem'
            }}>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 700 }}>Assigned District Collector</div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                  {activeRequest.collectorName ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Truck size={15} color="var(--primary)" /> {activeRequest.collectorName} (Assigned to {activeRequest.district})
                    </span>
                  ) : (
                    <span style={{ color: 'var(--warm-accent)' }}>Pending assignment by {activeRequest.district} district dispatch</span>
                  )}
                </div>
              </div>

              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 700 }}>Target Recycling Plant</div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                  {activeRequest.facilityName || 'Authorized District Upcycling Plant'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
              <Link to="/user/my-requests" className="btn btn-outline btn-sm">
                View Full Tracking Details <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="card" style={{ marginBottom: '2.5rem', textAlign: 'center', padding: '3rem 2rem', background: 'var(--bg-surface-elevated)' }}>
            <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-full)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Recycle size={28} />
            </div>
            <h2>No Pending Pickups</h2>
            <p style={{ maxWidth: '500px', margin: '0.5rem auto 1.5rem auto', color: 'var(--text-secondary)' }}>
              Have plastic bottles, shopping bags, or rigid containers ready at home? Submit a pickup request and our district collector will collect them.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate('/user/request-pickup')}
            >
              <PlusCircle size={16} />
              <span>Submit New Pickup Request</span>
            </button>
          </div>
        )}

        {/* Bangladesh Urban Waterlogging & Waste Impact Info */}
        <div className="card" style={{ borderLeft: '4px solid var(--primary)', background: 'var(--bg-card)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Leaf size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.35rem' }}>
                Why Plastic Segregation Matters in Bangladesh Cities
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                In major cities like Dhaka and Chattogram, discarded plastic bags and bottles frequently clog underground stormwater drains and canals (such as Begunbari, Hatirjheel, and Chaktai canals), causing severe waterlogging during monsoon rains. By scheduling separate plastic collections through EcoCycle, you ensure 100% of your polymers are routed to authorized mechanical recycling and waste-to-energy facilities instead of urban drainage systems.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

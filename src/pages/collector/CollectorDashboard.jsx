import { Link, useNavigate } from 'react-router-dom'
import { useAuthRole } from '../../context/AuthRoleContext'
import { useData } from '../../context/DataContext'
import StatusBadge from '../../components/StatusBadge'
import { 
  Truck, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Building, 
  Layers, 
  ArrowRight, 
  Recycle, 
  Sparkles,
  Phone,
  Calendar
} from 'lucide-react'

export default function CollectorDashboard() {
  const { userProfile } = useAuthRole()
  const { requests } = useData()
  const navigate = useNavigate()

  const assignedDistricts = userProfile.assignedDistricts || [userProfile.district || 'Dhaka']

  // Filter requests belonging to collector's assigned districts
  const districtRequests = requests.filter(r => assignedDistricts.includes(r.district))
  
  const pendingRequests = districtRequests.filter(r => r.status === 'Pending')
  const acceptedRequests = districtRequests.filter(r => r.status === 'Accepted' && (r.collectorId === userProfile.id || !r.collectorId))
  const collectedRequests = districtRequests.filter(r => r.status === 'Collected')
  const deliveredRequests = districtRequests.filter(r => r.status === 'Delivered to Facility' || r.status === 'Completed')

  const totalDistrictKg = districtRequests
    .filter(r => r.status === 'Collected' || r.status === 'Delivered to Facility' || r.status === 'Completed')
    .reduce((acc, r) => acc + (Number(r.verifiedKg || r.estimatedKg) || 0), 0)

  return (
    <div className="section">
      <div className="container">
        {/* Collector Welcome & Assigned District Header */}
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
              <span>Assigned Jurisdiction: <strong>{assignedDistricts.join(', ')}</strong> (All district requests auto-assigned)</span>
            </p>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate('/collector/requests')}
          >
            <span>Manage District Requests ({districtRequests.length})</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* 4 Collector KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--warm-accent-light)', color: 'var(--warm-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={20} />
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>New in District</span>
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, color: 'var(--warm-accent)' }}>
              {pendingRequests.length}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              Pending citizen requests in {assignedDistricts.join('/')}
            </p>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--info-light)', color: 'var(--info)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Truck size={20} />
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Accepted Pickups</span>
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, color: 'var(--info)' }}>
              {acceptedRequests.length}
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
              {totalDistrictKg} <span style={{ fontSize: '1rem', fontWeight: 600 }}>kg</span>
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
              {deliveredRequests.length}
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

          {districtRequests.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-surface-elevated)' }}>
              <h3>No Active Requests in {assignedDistricts.join(', ')}</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                All district pickups have been cleared or delivered.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {districtRequests.slice(0, 3).map(req => (
                <div key={req.id} className="card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                      <strong style={{ fontSize: '1.1rem' }}>#{req.id}</strong>
                      <StatusBadge status={req.status} />
                      <span className="badge badge-success">{req.district}</span>
                    </div>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
                      <span><strong>Citizen:</strong> {req.userName} ({req.userPhone})</span>
                      <span><strong>Location:</strong> {req.address}</span>
                      <span><strong>Est. Weight:</strong> {req.estimatedKg} kg ({req.plasticTypes.join(', ')})</span>
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
          <ul style={{ listStyle: 'none', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
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

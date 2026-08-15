import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthRole } from '../../context/AuthRoleContext'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { 
  Truck, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Award, 
  Star, 
  CheckCircle2, 
  ShieldCheck,
  Save,
  Calendar
} from 'lucide-react'

export default function CollectorProfile() {
  const { userProfile, updateCurrentUserProfile } = useAuthRole()
  const { requests } = useData()
  const { addToast } = useToast()

  const [name, setName] = useState(userProfile.name || '')
  const [phone, setPhone] = useState(userProfile.phone || '')
  const [vehicleNumber, setVehicleNumber] = useState(userProfile.vehicleNumber || '')
  const [vehicleType, setVehicleType] = useState(userProfile.vehicleType || '')

  const assignedDistricts = userProfile.assignedDistricts || [userProfile.district || 'Dhaka']

  const completedPickups = requests.filter(r => 
    (r.collectorId === userProfile.id || r.collectorName === userProfile.name) && 
    (r.status === 'Completed' || r.status === 'Delivered to Facility')
  ).length

  const handleSave = (e) => {
    e.preventDefault()
    updateCurrentUserProfile({
      name,
      phone,
      vehicleNumber,
      vehicleType
    })
    addToast('Collector operational profile updated!', 'success')
  }

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '840px' }}>
        {/* Breadcrumb */}
        <div className="breadcrumb-nav">
          <Link to="/collector/dashboard" className="breadcrumb-link">Collector Dashboard</Link>
          <span>/</span>
          <span className="breadcrumb-current">Collector Profile</span>
        </div>

        <div className="section-header" style={{ textAlign: 'left', margin: '0 0 2.5rem 0' }}>
          <span className="section-tag">
            <Truck size={14} /> Field Logistics Profile
          </span>
          <h1 className="section-title">Collector Identification & Fleet Profile</h1>
          <p className="section-desc">
            Manage your registered contact details, vehicle registration ID, and view your district jurisdiction authorization.
          </p>
        </div>

        {/* Collector ID Banner */}
        <div className="wallet-banner" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255,255,255,0.2)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 800
            }}>
              {userProfile.avatar || 'KH'}
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Authorized District Waste Collector • Bangladesh
              </div>
              <h2 style={{ color: '#ffffff', fontSize: '1.6rem', marginTop: '0.2rem' }}>{name}</h2>
              <div style={{ fontSize: '0.88rem', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.2rem' }}>
                <span>ID: <strong>{userProfile.id}</strong></span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Star size={14} fill="#facc15" color="#facc15" /> {userProfile.rating || 4.9} Rating
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.78rem', opacity: 0.85 }}>Completed Pickups</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800 }}>
                {completedPickups}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', opacity: 0.85 }}>Assigned Districts</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, marginTop: '0.35rem' }}>
                {assignedDistricts.join(', ')}
              </div>
            </div>
          </div>
        </div>

        {/* Assigned Districts Card */}
        <div className="card" style={{ marginBottom: '2rem', padding: '1.75rem', background: 'var(--bg-surface-elevated)' }}>
          <h2 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={18} color="var(--primary)" />
            <span>District Jurisdiction Authorization</span>
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Your account is assigned by the EcoCycle Central Administration to handle plastic collection across the following districts:
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {assignedDistricts.map(d => (
              <span key={d} className="badge badge-success" style={{ fontSize: '0.85rem', padding: '0.35rem 0.85rem' }}>
                <ShieldCheck size={14} /> District: {d}
              </span>
            ))}
          </div>
        </div>

        {/* Form Settings */}
        <div className="card" style={{ padding: '2.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Vehicle & Contact Details</h2>

          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Collector Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Assigned Vehicle Type</label>
                <input
                  type="text"
                  className="form-input"
                  value={vehicleType}
                  onChange={e => setVehicleType(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Vehicle Registration Plate Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={vehicleNumber}
                  onChange={e => setVehicleNumber(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button type="submit" className="btn btn-primary">
                <Save size={16} />
                <span>Save Collector Profile</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

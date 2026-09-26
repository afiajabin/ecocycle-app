import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthRole } from '../../context/AuthRoleContext'
import { useToast } from '../../context/ToastContext'
import { getMyProfile, updateMyProfile, logoutUser } from '../../services/api'
import { 
  Truck, 
  MapPin, 
  Phone, 
  Star, 
  ShieldCheck,
  Save,
  RefreshCw
} from 'lucide-react'

export default function CollectorProfile() {
  const { userProfile, updateCurrentUserProfile, actualRole } = useAuthRole()
  const { addToast } = useToast()

  const [name, setName] = useState(userProfile.name || '')
  const [phone, setPhone] = useState(userProfile.phone || '')
  const [district, setDistrict] = useState(userProfile.district || 'Dhaka')
  const [vehicleNumber, setVehicleNumber] = useState(userProfile.vehicleNumber || '')
  const [vehicleType, setVehicleType] = useState(userProfile.vehicleType || '')
  const [assignedDistricts, setAssignedDistricts] = useState(userProfile.assignedDistricts || ['Dhaka', 'Gazipur'])
  const [totalCollections, setTotalCollections] = useState(userProfile.totalCollections || 0)
  const [rating, setRating] = useState(userProfile.rating || 4.9)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const fetchProfile = async () => {
    if (actualRole === 'admin') {
      return
    }
    try {
      setLoading(true)
      const res = await getMyProfile()
      if (res.success && res.data) {
        const u = res.data
        setName(u.name || '')
        setPhone(u.phone || '')
        setDistrict(u.district || 'Dhaka')
        setVehicleNumber(u.vehicleNumber || '')
        setVehicleType(u.vehicleType || '')
        setAssignedDistricts(u.assignedDistricts || [u.district || 'Dhaka'])
        setTotalCollections(u.totalCollections || 0)
        setRating(u.rating || 4.9)
      }
    } catch (err) {
      console.error('Error fetching collector profile:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (actualRole === 'admin') {
      setName(userProfile.name || '')
      setPhone(userProfile.phone || '')
      setDistrict(userProfile.district || 'Dhaka')
      setVehicleNumber(userProfile.vehicleNumber || '')
      setVehicleType(userProfile.vehicleType || '')
      setAssignedDistricts(userProfile.assignedDistricts || ['Dhaka', 'Gazipur'])
      setTotalCollections(userProfile.totalCollections || 0)
      setRating(userProfile.rating || 4.9)
    } else {
      fetchProfile()
    }
  }, [actualRole, userProfile])

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      const res = await updateMyProfile({
        name,
        phone,
        district,
        vehicleNumber,
        vehicleType,
      })

      if (res.success) {
        updateCurrentUserProfile({
          name,
          phone,
          district,
          vehicleNumber,
          vehicleType,
        })
        addToast('Collector operational profile updated successfully!', 'success')
      }
    } catch (err) {
      addToast(err.message || 'Failed to save profile', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    if (window.confirm('Are you sure you want to sign out from Collector portal?')) {
      await logoutUser()
      window.location.href = '/login'
    }
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="section-tag">
                <Truck size={14} /> Field Logistics Profile
              </span>
              <h1 className="section-title">Collector Identification & Fleet Profile</h1>
              <p className="section-desc">
                Manage your registered contact details, vehicle registration ID, and view your district jurisdiction authorization.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={fetchProfile}
                disabled={loading}
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
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
              {name ? name.slice(0, 2).toUpperCase() : 'CO'}
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Authorized District Waste Collector • Bangladesh
              </div>
              <h2 style={{ color: '#ffffff', fontSize: '1.6rem', marginTop: '0.2rem' }}>{name}</h2>
              <div style={{ fontSize: '0.88rem', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.2rem' }}>
                <span>District: <strong>{district}</strong></span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Star size={14} fill="#facc15" color="#facc15" /> {rating} Rating
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '0.78rem', opacity: 0.85 }}>Total Collections</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800 }}>
                {totalCollections}
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginTop: '1rem' }}>
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

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '1rem',
                marginTop: '1.5rem',
              }}
            >
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleSignOut}
              >
                <span>Sign Out</span>
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                <Save size={16} />
                <span>{saving ? 'Saving...' : 'Save Collector Profile'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

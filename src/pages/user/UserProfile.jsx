import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthRole } from '../../context/AuthRoleContext'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import {
  getMyProfile,
  updateMyProfile,
  getMyRequests,
} from '../../services/api'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Save,
  Recycle,
  RotateCcw,
} from 'lucide-react'

export default function UserProfile() {
  const navigate = useNavigate()

  const {
    userProfile,
    updateCurrentUserProfile,
    resetToCodeDefaults,
  } = useAuthRole()

  const { divisions } = useData()
  const { addToast } = useToast()

  const [name, setName] = useState(userProfile.name || '')
  const [email, setEmail] = useState(userProfile.email || '')
  const [phone, setPhone] = useState(userProfile.phone || '')
  const [district, setDistrict] = useState(
    userProfile.district || 'Dhaka'
  )
  const [address, setAddress] = useState(
    userProfile.address || ''
  )

  const [userRequests, setUserRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Load the latest profile and requests from the backend
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setIsLoading(true)

        const [profileResponse, requestsResponse] =
          await Promise.all([
            getMyProfile(),
            getMyRequests(),
          ])

        console.log(
          'User Profile API response:',
          profileResponse
        )

        console.log(
          'User Profile Requests API response:',
          requestsResponse
        )

        const backendUser =
          profileResponse?.data?.user ||
          profileResponse?.data ||
          {}

        setName(backendUser.name || '')
        setEmail(backendUser.email || '')
        setPhone(backendUser.phone || '')
        setDistrict(backendUser.district || 'Dhaka')
        setAddress(backendUser.address || '')

        const backendRequests = Array.isArray(
          requestsResponse?.data
        )
          ? requestsResponse.data
          : []

        setUserRequests(backendRequests)

        // Keep the local authentication information synchronized
        if (backendUser._id || backendUser.id) {
          localStorage.setItem(
            'user',
            JSON.stringify(backendUser)
          )
        }
      } catch (error) {
        console.error(
          'Load user profile error:',
          error
        )

        addToast(
          error.message ||
            'Unable to load your profile information.',
          'error'
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadProfileData()
  }, [addToast])

  const totalKg = userRequests
    .filter(request => request.status !== 'Cancelled')
    .reduce(
      (acc, request) =>
        acc +
        (Number(
          request.verifiedKg || request.estimatedKg
        ) || 0),
      0
    )

  const handleSave = async e => {
    e.preventDefault()

    try {
      setIsSaving(true)

      const profileData = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        district,
        address: address.trim(),
      }

      const response = await updateMyProfile(profileData)

      console.log(
        'Update Profile API response:',
        response
      )

      const updatedUser =
        response?.data?.user ||
        response?.data ||
        profileData

      // Update local authentication data as well
      localStorage.setItem(
        'user',
        JSON.stringify(updatedUser)
      )

      updateCurrentUserProfile({
        ...profileData,
        avatar: name
          .split(' ')
          .map(n => n[0])
          .join('')
          .substring(0, 2)
          .toUpperCase(),
      })

      // Make sure the form reflects the saved backend values
      setName(updatedUser.name || profileData.name)
      setEmail(updatedUser.email || profileData.email)
      setPhone(updatedUser.phone || profileData.phone)
      setDistrict(
        updatedUser.district || profileData.district
      )
      setAddress(
        updatedUser.address || profileData.address
      )

      addToast(
        `Citizen profile updated to "${updatedUser.name || profileData.name}"!`,
        'success'
      )
    } catch (error) {
      console.error(
        'Update user profile error:',
        error
      )

      addToast(
        error.message ||
          'Unable to update your profile.',
        'error'
      )
    } finally {
      setIsSaving(false)
    }
  }

  const handleSignOut = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('ecocycle-active-role')
    navigate('/login')
  }

  if (isLoading) {
    return (
      <div className="section">
        <div className="container">
          <div
            className="card"
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
            }}
          >
            <Recycle
              size={32}
              style={{
                color: 'var(--primary)',
                marginBottom: '1rem',
              }}
            />

            <h2>Loading your profile...</h2>

            <p
              style={{
                color: 'var(--text-secondary)',
                marginTop: '0.5rem',
              }}
            >
              Fetching your latest profile information.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="section">
      <div
        className="container"
        style={{ maxWidth: '840px' }}
      >
        {/* Breadcrumb */}
        <div className="breadcrumb-nav">
          <Link
            to="/user/dashboard"
            className="breadcrumb-link"
          >
            User Dashboard
          </Link>

          <span>/</span>

          <span className="breadcrumb-current">
            Citizen Profile
          </span>
        </div>

        <div
          className="section-header"
          style={{
            textAlign: 'left',
            margin: '0 0 2.5rem 0',
          }}
        >
          <span className="section-tag">
            <User size={14} /> Account Settings
          </span>

          <h1 className="section-title">
            Citizen Profile & District
          </h1>

          <p className="section-desc">
            Manage your personal contact info, default pickup
            address, and view your verified environmental impact
            score.
          </p>
        </div>

        {/* Impact Snapshot Banner */}
        <div
          className="wallet-banner"
          style={{
            padding: '2rem',
            marginBottom: '2.5rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255,255,255,0.2)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 800,
              }}
            >
              {userProfile.avatar ||
                name
                  .substring(0, 2)
                  .toUpperCase() ||
                'RA'}
            </div>

            <div>
              <div
                style={{
                  fontSize: '0.82rem',
                  opacity: 0.85,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Verified Citizen Account • Bangladesh
              </div>

              <h2
                style={{
                  color: '#ffffff',
                  fontSize: '1.6rem',
                  marginTop: '0.2rem',
                }}
              >
                {name}
              </h2>

              <div
                style={{
                  fontSize: '0.88rem',
                  opacity: 0.9,
                }}
              >
                Member since{' '}
                {userProfile.memberSince || '2026'} •{' '}
                {userRequests.length} Total Requests
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '1.5rem',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '0.78rem',
                  opacity: 0.85,
                }}
              >
                Total Plastic Diverted
              </div>

              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.8rem',
                  fontWeight: 800,
                }}
              >
                {totalKg} kg
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: '0.78rem',
                  opacity: 0.85,
                }}
              >
                CO₂ Offset
              </div>

              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.8rem',
                  fontWeight: 800,
                }}
              >
                ~{Math.round(totalKg * 1.5)} kg
              </div>
            </div>
          </div>
        </div>

        {/* Profile Edit Form */}
        <div
          className="card"
          style={{ padding: '2.5rem' }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
            }}
          >
            <h2
              style={{
                fontSize: '1.25rem',
                margin: 0,
              }}
            >
              Personal & Address Information
            </h2>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                resetToCodeDefaults()
                addToast(
                  'Reset data to match code files!',
                  'info'
                )
              }}
              title="Reset data to defaults in code"
            >
              <RotateCcw size={14} />
              <span>Reset to Code Defaults</span>
            </button>
          </div>

          <form onSubmit={handleSave}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1.25rem',
              }}
            >
              <div className="form-group">
                <label className="form-label">
                  Full Name
                </label>

                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={e =>
                    setName(e.target.value)
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Email Address
                </label>

                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={e =>
                    setEmail(e.target.value)
                  }
                  required
                />
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1.25rem',
              }}
            >
              <div className="form-group">
                <label className="form-label">
                  Phone Number (Bangladesh)
                </label>

                <input
                  type="text"
                  className="form-input"
                  value={phone}
                  onChange={e =>
                    setPhone(e.target.value)
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Default District
                </label>

                <select
                  className="form-select"
                  value={district}
                  onChange={e =>
                    setDistrict(e.target.value)
                  }
                  required
                >
                  {Object.entries(divisions).map(
                    ([divName, distList]) => (
                      <optgroup
                        key={divName}
                        label={divName}
                      >
                        {distList.map(d => (
                          <option
                            key={d}
                            value={d}
                          >
                            {d}
                          </option>
                        ))}
                      </optgroup>
                    )
                  )}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Default Pickup Address
              </label>

              <input
                type="text"
                className="form-input"
                value={address}
                onChange={e =>
                  setAddress(e.target.value)
                }
                required
              />
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
                disabled={isSaving}
              >
                <Save size={16} />

                <span>
                  {isSaving
                    ? 'Saving...'
                    : 'Save Profile Changes'}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
import { Link, useNavigate } from 'react-router-dom'
import { Recycle, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)

    const email = formData.get('email')
    const password = formData.get('password')

    try {
      const response = await fetch(
        'http://localhost:5000/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || 'Login failed')
        return
      }

      if (!data.token || !data.user) {
        alert('Invalid login response from server')
        return
      }

      const backendRole = data.user.role

      let frontendRole

      if (backendRole === 'citizen') {
        frontendRole = 'user'
      } else if (
        backendRole === 'user' ||
        backendRole === 'collector' ||
        backendRole === 'admin'
      ) {
        frontendRole = backendRole
      } else {
        alert('Invalid account role')
        return
      }

      const user = {
        ...data.user,
        role: frontendRole,
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('ecocycle-active-role', frontendRole)

      alert('Login successful')

      if (frontendRole === 'collector') {
        window.location.href = '/collector/dashboard'
      } else if (frontendRole === 'admin') {
        window.location.href = '/admin/dashboard'
      } else {
        window.location.href = '/user/dashboard'
      }

    } catch (error) {
      console.error('Login error:', error)
      alert('Could not connect to the server')
    }
  }

  return (
    <div className="section">
      <div className="container">

        <div
          style={{
            minHeight: 'calc(100vh - 220px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '980px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1.5rem',
              alignItems: 'stretch',
            }}
          >

            <div
              className="card"
              style={{
                background:
                  'linear-gradient(135deg, var(--primary) 0%, hsl(158, 75%, 18%) 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '2.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                }}
              >
                <Recycle size={28} />
              </div>

              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '2rem',
                  fontWeight: 800,
                  lineHeight: 1.2,
                  marginBottom: '1rem',
                }}
              >
                Welcome to EcoCycle
              </div>

              <p
                style={{
                  color: 'rgba(255,255,255,0.82)',
                  fontSize: '0.95rem',
                  lineHeight: 1.7,
                  marginBottom: '1.75rem',
                }}
              >
                Connect with your district collection network and help keep
                plastic waste away from landfills, waterways, and urban drains.
              </p>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.9rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.7rem',
                    fontSize: '0.88rem',
                    color: 'rgba(255,255,255,0.9)',
                  }}
                >
                  <ShieldCheck size={17} />
                  <span>District-based plastic collection</span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.7rem',
                    fontSize: '0.88rem',
                    color: 'rgba(255,255,255,0.9)',
                  }}
                >
                  <Recycle size={17} />
                  <span>Responsible recycling & waste-to-energy</span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.7rem',
                    fontSize: '0.88rem',
                    color: 'rgba(255,255,255,0.9)',
                  }}
                >
                  <ArrowRight size={17} />
                  <span>Serving communities across Bangladesh</span>
                </div>
              </div>
            </div>

            <div
              className="card"
              style={{
                padding: '2.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <div style={{ marginBottom: '1.75rem' }}>
                <span className="section-tag">
                  <Lock size={14} />
                  Account Access
                </span>

                <h1
                  style={{
                    fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
                    marginTop: '0.75rem',
                    marginBottom: '0.5rem',
                  }}
                >
                  Sign in to EcoCycle
                </h1>

                <p
                  style={{
                    fontSize: '0.9rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  Access your recycling dashboard and pickup requests.
                </p>
              </div>

              <form onSubmit={handleSubmit}>

                <div className="form-group">
                  <label className="form-label" htmlFor="login-email">
                    Email Address
                  </label>

                  <div style={{ position: 'relative' }}>
                    <Mail
                      size={17}
                      color="var(--text-muted)"
                      style={{
                        position: 'absolute',
                        left: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                      }}
                    />

                    <input
                      id="login-email"
                      name="email"
                      type="email"
                      className="form-input"
                      placeholder="Enter your email"
                      style={{ paddingLeft: '2.75rem' }}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="login-password">
                    Password
                  </label>

                  <div style={{ position: 'relative' }}>
                    <Lock
                      size={17}
                      color="var(--text-muted)"
                      style={{
                        position: 'absolute',
                        left: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                      }}
                    />

                    <input
                      id="login-password"
                      name="password"
                      type="password"
                      className="form-input"
                      placeholder="Enter your password"
                      style={{ paddingLeft: '2.75rem' }}
                      required
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.5rem',
                    fontSize: '0.82rem',
                  }}
                >
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                    }}
                  >
                    <input type="checkbox" />
                    Remember me
                  </label>

                  <button
                    type="button"
                    className="btn-ghost"
                    style={{
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                    }}
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%' }}
                >
                  <span>Sign In</span>
                  <ArrowRight size={17} />
                </button>
              </form>

              <div
                style={{
                  marginTop: '1.5rem',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid var(--border-subtle)',
                  textAlign: 'center',
                  fontSize: '0.88rem',
                  color: 'var(--text-secondary)',
                }}
              >
                Don't have an EcoCycle account?{' '}

                <Link
                  to="/register"
                  style={{
                    color: 'var(--primary)',
                    fontWeight: 700,
                  }}
                >
                  Create an account
                </Link>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
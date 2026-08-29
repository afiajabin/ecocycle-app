import { useEffect } from 'react'
import { Outlet, useLocation, Link } from 'react-router-dom'
import { Recycle } from 'lucide-react'
import RoleHeader from './RoleHeader'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  const isLoginPage =
    pathname === '/login' || pathname === '/'

  const isRegisterPage =
    pathname === '/register'

  return (
    <>
      {isLoginPage || isRegisterPage ? (
        <header
          className="navbar-wrapper"
          style={{ borderBottom: '1px solid var(--border-subtle)' }}
        >
          <div className="container">
            <nav
              className="navbar"
              aria-label="Main Navigation"
              style={{
                justifyContent: 'center',
                minHeight: isLoginPage ? '110px' : '70px',
              }}
            >
              <Link
                to="/login"
                className="nav-brand"
                style={{
                  transform: isLoginPage ? 'scale(1.35)' : 'scale(1)',
                  transformOrigin: 'center',
                }}
              >
                <div className="brand-icon-wrapper">
                  <Recycle size={22} strokeWidth={2.4} />
                </div>
                <span>EcoCycle</span>
                <span className="brand-badge">BD</span>
              </Link>
            </nav>
          </div>
        </header>
      ) : (
        <>
          <RoleHeader />
          <Navbar />
        </>
      )}

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      <Footer />
    </>
  )
}

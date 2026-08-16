import Login from './pages/Login'
import Register from './pages/Register'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './context/ToastContext'
import { AuthRoleProvider, useAuthRole } from './context/AuthRoleContext'
import { DataProvider } from './context/DataContext'
import Layout from './components/Layout'

// Public Overview Portal
import PortalHome from './pages/PortalHome'

// User (Citizen) Pages
import UserDashboard from './pages/user/UserDashboard'
import RequestPickup from './pages/user/RequestPickup'
import MyRequests from './pages/user/MyRequests'
import UserProfile from './pages/user/UserProfile'

// Collector Pages
import CollectorDashboard from './pages/collector/CollectorDashboard'
import CollectorRequests from './pages/collector/CollectorRequests'
import CollectorProfile from './pages/collector/CollectorProfile'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminCollectors from './pages/admin/AdminCollectors'
import AdminRequests from './pages/admin/AdminRequests'
import AdminFacilities from './pages/admin/AdminFacilities'

// 404
import NotFound from './pages/NotFound'

import './index.css'
import './styles/navbar.css'
import './styles/footer.css'
import './styles/components.css'
import './styles/pages.css'

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthRoleProvider>
          <DataProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Layout />}>
                  {/* Home Portal Overview */}
                   <Route index element={<Login />} />
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />

                  {/* User (Citizen) Routes */}
                  <Route path="user">
                    <Route index element={<Navigate to="/user/dashboard" replace />} />
                    <Route path="dashboard" element={<UserDashboard />} />
                    <Route path="request-pickup" element={<RequestPickup />} />
                    <Route path="my-requests" element={<MyRequests />} />
                    <Route path="profile" element={<UserProfile />} />
                  </Route>

                  {/* Collector Routes */}
                  <Route path="collector">
                    <Route index element={<Navigate to="/collector/dashboard" replace />} />
                    <Route path="dashboard" element={<CollectorDashboard />} />
                    <Route path="requests" element={<CollectorRequests />} />
                    <Route path="profile" element={<CollectorProfile />} />
                  </Route>

                  {/* Admin Routes */}
                  <Route path="admin">
                    <Route index element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="collectors" element={<AdminCollectors />} />
                    <Route path="requests" element={<AdminRequests />} />
                    <Route path="facilities" element={<AdminFacilities />} />
                  </Route>

                  {/* 404 Fallback */}
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </DataProvider>
        </AuthRoleProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}

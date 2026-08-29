import Login from './pages/Login'
import Register from './pages/Register'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './context/ToastContext'
import { AuthRoleProvider, useAuthRole } from './context/AuthRoleContext'
import { DataProvider } from './context/DataContext'

import Layout from './components/Layout'
import PortalHome from './pages/PortalHome'

import UserDashboard from './pages/user/UserDashboard'
import RequestPickup from './pages/user/RequestPickup'
import MyRequests from './pages/user/MyRequests'
import UserProfile from './pages/user/UserProfile'

import CollectorDashboard from './pages/collector/CollectorDashboard'
import CollectorRequests from './pages/collector/CollectorRequests'
import CollectorProfile from './pages/collector/CollectorProfile'

import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminCollectors from './pages/admin/AdminCollectors'
import AdminRequests from './pages/admin/AdminRequests'
import AdminFacilities from './pages/admin/AdminFacilities'

import NotFound from './pages/NotFound'

import './index.css'
import './styles/navbar.css'
import './styles/footer.css'
import './styles/components.css'
import './styles/pages.css'

function ProtectedRoute({ allowedRoles, children }) {
const { actualRole } = useAuthRole()

const token = localStorage.getItem('token')
const savedUser = localStorage.getItem('user')

if (!token || !savedUser) {
return <Navigate to="/login" replace />
}

const roles = Array.isArray(allowedRoles)
? allowedRoles
: [allowedRoles]

if (!actualRole || !roles.includes(actualRole)) {
const correctRoute =
actualRole === 'admin'
? '/admin/dashboard'
: actualRole === 'collector'
? '/collector/dashboard'
: '/user/dashboard'

return <Navigate to={correctRoute} replace />


}

return children
}

export default function App() {
return ( <ThemeProvider> <ToastProvider> <AuthRoleProvider> <DataProvider> <BrowserRouter> <Routes>
<Route path="/" element={<Layout />}>


              <Route index element={<Login />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />

              <Route path="portal" element={<PortalHome />} />

              <Route path="user">
                <Route
                  index
                  element={
                    <ProtectedRoute allowedRoles={['user', 'admin']}>
                      <Navigate to="/user/dashboard" replace />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['user', 'admin']}>
                      <UserDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="request-pickup"
                  element={
                    <ProtectedRoute allowedRoles={['user', 'admin']}>
                      <RequestPickup />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="my-requests"
                  element={
                    <ProtectedRoute allowedRoles={['user', 'admin']}>
                      <MyRequests />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="profile"
                  element={
                    <ProtectedRoute allowedRoles={['user', 'admin']}>
                      <UserProfile />
                    </ProtectedRoute>
                  }
                />
              </Route>

              <Route path="collector">
                <Route
                  index
                  element={
                    <ProtectedRoute allowedRoles={['collector', 'admin']}>
                      <Navigate to="/collector/dashboard" replace />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['collector', 'admin']}>
                      <CollectorDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="requests"
                  element={
                    <ProtectedRoute allowedRoles={['collector', 'admin']}>
                      <CollectorRequests />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="profile"
                  element={
                    <ProtectedRoute allowedRoles={['collector', 'admin']}>
                      <CollectorProfile />
                    </ProtectedRoute>
                  }
                />
              </Route>

              <Route path="admin">
                <Route
                  index
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <Navigate to="/admin/dashboard" replace />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="users"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminUsers />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="collectors"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminCollectors />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="requests"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminRequests />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="facilities"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminFacilities />
                    </ProtectedRoute>
                  }
                />
              </Route>

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
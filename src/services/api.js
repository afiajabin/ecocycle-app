const API_BASE_URL = 'http://localhost:5000/api'

const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token')

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong')
  }

  return data
}

// ---------- AUTH & PROFILE ----------

export const getMyProfile = () => {
  return apiRequest('/auth/me')
}

export const updateMyProfile = (profileData) => {
  return apiRequest('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  })
}

export const logoutUser = async () => {
  try {
    await apiRequest('/auth/logout', { method: 'POST' })
  } catch (e) {
    // Ignore server error on logout
  }
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  localStorage.removeItem('ecocycle-active-role')
}

// ---------- CITIZEN REQUESTS ----------

export const createPickupRequest = (requestData) => {
  return apiRequest('/requests', {
    method: 'POST',
    body: JSON.stringify(requestData),
  })
}

export const getMyRequests = () => {
  return apiRequest('/requests/my-requests')
}

export const cancelPickupRequest = (requestId) => {
  return apiRequest(`/requests/${requestId}/cancel`, {
    method: 'PATCH',
  })
}

// ---------- COLLECTOR OPERATIONS ----------

export const getCollectorStats = () => {
  return apiRequest('/collector/stats')
}

export const getDistrictRequests = (params = {}) => {
  const query = new URLSearchParams()
  if (params.status && params.status !== 'all') query.append('status', params.status)
  if (params.district && params.district !== 'all') query.append('district', params.district)
  if (params.search) query.append('search', params.search)
  
  const queryString = query.toString() ? `?${query.toString()}` : ''
  return apiRequest(`/collector/requests${queryString}`)
}

export const getRequestById = (id) => {
  return apiRequest(`/collector/requests/${id}`)
}

export const acceptRequest = (id) => {
  return apiRequest(`/collector/requests/${id}/accept`, {
    method: 'PATCH',
  })
}

export const collectRequest = (id, verifiedKg) => {
  return apiRequest(`/collector/requests/${id}/collect`, {
    method: 'PATCH',
    body: JSON.stringify({ verifiedKg }),
  })
}

export const deliverToFacility = (id, facilityId) => {
  return apiRequest(`/collector/requests/${id}/deliver`, {
    method: 'PATCH',
    body: JSON.stringify({ facilityId }),
  })
}

export const completeRequest = (id) => {
  return apiRequest(`/collector/requests/${id}/complete`, {
    method: 'PATCH',
  })
}

export const getFacilities = (district) => {
  const query = district && district !== 'all' ? `?district=${district}` : ''
  return apiRequest(`/facilities${query}`)
}

// ---------- ADMIN OPERATIONS ----------

export const getAdminStats = () => {
  return apiRequest('/admin/stats')
}

export const getAdminUsers = (params = {}) => {
  const query = new URLSearchParams()
  if (params.role && params.role !== 'all') query.append('role', params.role)
  if (params.district && params.district !== 'all') query.append('district', params.district)
  if (params.status && params.status !== 'all') query.append('status', params.status)
  if (params.search) query.append('search', params.search)

  const queryString = query.toString() ? `?${query.toString()}` : ''
  return apiRequest(`/admin/users${queryString}`)
}

export const updateAdminUser = (id, userData) => {
  return apiRequest(`/admin/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(userData),
  })
}

export const deleteAdminUser = (id) => {
  return apiRequest(`/admin/users/${id}`, {
    method: 'DELETE',
  })
}

export const getAdminCollectors = () => {
  return apiRequest('/admin/collectors')
}

export const assignCollectorJurisdiction = (id, data) => {
  return apiRequest(`/admin/collectors/${id}/jurisdiction`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export const getAdminRequests = (params = {}) => {
  const query = new URLSearchParams()
  if (params.status && params.status !== 'all') query.append('status', params.status)
  if (params.district && params.district !== 'all') query.append('district', params.district)
  if (params.search) query.append('search', params.search)

  const queryString = query.toString() ? `?${query.toString()}` : ''
  return apiRequest(`/admin/requests${queryString}`)
}

export const assignRequestCollector = (id, collectorId) => {
  return apiRequest(`/admin/requests/${id}/assign`, {
    method: 'PATCH',
    body: JSON.stringify({ collectorId }),
  })
}

export const deleteAdminRequest = (id) => {
  return apiRequest(`/admin/requests/${id}`, {
    method: 'DELETE',
  })
}

export const getAdminFacilities = () => {
  return apiRequest('/admin/facilities')
}

export const createAdminFacility = (facilityData) => {
  return apiRequest('/admin/facilities', {
    method: 'POST',
    body: JSON.stringify(facilityData),
  })
}

export const updateAdminFacility = (id, facilityData) => {
  return apiRequest(`/admin/facilities/${id}`, {
    method: 'PUT',
    body: JSON.stringify(facilityData),
  })
}

export const deleteAdminFacility = (id) => {
  return apiRequest(`/admin/facilities/${id}`, {
    method: 'DELETE',
  })
}
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

// ---------- AUTH / PROFILE ----------

export const getMyProfile = () => {
  return apiRequest('/auth/me')
}

export const updateMyProfile = (profileData) => {
  return apiRequest('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  })
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
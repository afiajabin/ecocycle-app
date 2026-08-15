import { createContext, useContext, useState, useEffect } from 'react'

const DataContext = createContext()

export const BANGLADESH_DIVISIONS = {
  'Dhaka Division': ['Dhaka', 'Gazipur', 'Narayanganj', 'Tangail', 'Faridpur', 'Manikganj', 'Munshiganj', 'Narsingdi', 'Gopalganj', 'Madaripur', 'Rajbari', 'Shariatpur', 'Kishoreganj'],
  'Chattogram Division': ['Chattogram', "Cox's Bazar", 'Cumilla', 'Feni', 'Brahmanbaria', 'Noakhali', 'Chandpur', 'Lakshmipur', 'Khagrachhari', 'Rangamati', 'Bandarban'],
  'Rajshahi Division': ['Rajshahi', 'Bogura', 'Pabna', 'Sirajganj', 'Naogaon', 'Natore', 'Chapai Nawabganj', 'Joypurhat'],
  'Khulna Division': ['Khulna', 'Jashore', 'Kushtia', 'Satkhira', 'Jhenaidah', 'Chuadanga', 'Magura', 'Meherpur', 'Narail', 'Bagerhat'],
  'Barishal Division': ['Barishal', 'Patuakhali', 'Bhola', 'Pirojpur', 'Jhalokati', 'Barguna'],
  'Sylhet Division': ['Sylhet', 'Moulvibazar', 'Habiganj', 'Sunamganj'],
  'Rangpur Division': ['Rangpur', 'Dinajpur', 'Kurigram', 'Gaibandha', 'Nilphamari', 'Panchagarh', 'Thakurgaon', 'Lalmonirhat'],
  'Mymensingh Division': ['Mymensingh', 'Jamalpur', 'Netrokona', 'Sherpur']
}

export const ALL_64_DISTRICTS = Object.values(BANGLADESH_DIVISIONS).flat()

const INITIAL_FACILITIES = [
  {
    id: 'fac-1',
    name: 'Dhaka North Mechanical Polymer Recycling Plant',
    district: 'Dhaka',
    location: 'Aminbazar Industrial Zone, Dhaka',
    type: 'Mechanical Recycling & Flaking',
    dailyCapacityTons: 45,
    totalReceivedKg: 324000,
    contactPerson: 'Engr. Mahfuzul Alam',
    contactPhone: '+880 1711-223344',
    status: 'Operational',
    acceptedTypes: ['PET Bottles', 'HDPE Containers', 'PP Plastics']
  },
  {
    id: 'fac-2',
    name: 'Chattogram Circular Polymer Upcycling Facility',
    district: 'Chattogram',
    location: 'Sagarika Industrial Area, Chattogram',
    type: 'Chemical & Mechanical Pelletizing',
    dailyCapacityTons: 60,
    totalReceivedKg: 480000,
    contactPerson: 'Tareq Chowdhury',
    contactPhone: '+880 1812-334455',
    status: 'Operational',
    acceptedTypes: ['PET Bottles', 'LDPE Bags & Films', 'Mixed Plastics']
  },
  {
    id: 'fac-3',
    name: 'Gazipur Waste-to-Energy & RDF Gasification Center',
    district: 'Gazipur',
    location: 'Kashimpur, Gazipur',
    type: 'Waste-to-Energy & Refuse-Derived Fuel (RDF)',
    dailyCapacityTons: 80,
    totalReceivedKg: 610000,
    contactPerson: 'Dr. Nazmul Huda',
    contactPhone: '+880 1913-445566',
    status: 'Operational',
    acceptedTypes: ['Non-recyclable Multilayer Plastics', 'Mixed Plastic Litter', 'LDPE Films']
  },
  {
    id: 'fac-4',
    name: 'Narayanganj High-Grade Extrusion Works',
    district: 'Narayanganj',
    location: 'Adamjee EPZ, Narayanganj',
    type: 'High-Density Extrusion',
    dailyCapacityTons: 35,
    totalReceivedKg: 195000,
    contactPerson: 'Kamrul Islam',
    contactPhone: '+880 1614-556677',
    status: 'Operational',
    acceptedTypes: ['HDPE Containers', 'PP Plastics']
  },
  {
    id: 'fac-5',
    name: 'Sylhet Regional Eco-Pelletizing Facility',
    district: 'Sylhet',
    location: 'Khadimnagar Industrial Estate, Sylhet',
    type: 'Mechanical Shredding & Washing',
    dailyCapacityTons: 25,
    totalReceivedKg: 112000,
    contactPerson: 'Abdul Mannan',
    contactPhone: '+880 1715-667788',
    status: 'Operational',
    acceptedTypes: ['PET Bottles', 'HDPE Containers']
  }
]

const INITIAL_COLLECTORS = [
  {
    id: 'col-201',
    name: 'Kabir Hossain',
    email: 'kabir.collector@ecocycle.bd',
    phone: '+880 1819-876543',
    assignedDistricts: ['Dhaka', 'Gazipur'],
    vehicleType: 'Electric Waste Van (EV-04)',
    vehicleNumber: 'Dhaka Metro-DH-11-2045',
    status: 'Active',
    totalCollections: 142,
    rating: 4.9
  },
  {
    id: 'col-202',
    name: 'Rashedul Karim',
    email: 'rashedul.ctg@ecocycle.bd',
    phone: '+880 1822-112233',
    assignedDistricts: ['Chattogram', "Cox's Bazar"],
    vehicleType: 'Heavy EV Truck (EV-08)',
    vehicleNumber: 'Chatto Metro-CT-09-3321',
    status: 'Active',
    totalCollections: 98,
    rating: 4.8
  },
  {
    id: 'col-203',
    name: 'Moinul Hassan',
    email: 'moinul.sylhet@ecocycle.bd',
    phone: '+880 1733-445566',
    assignedDistricts: ['Sylhet', 'Moulvibazar'],
    vehicleType: 'Electric Three-Wheeler Van',
    vehicleNumber: 'Sylhet-SY-05-1190',
    status: 'Active',
    totalCollections: 64,
    rating: 4.7
  },
  {
    id: 'col-204',
    name: 'Shakil Anwar',
    email: 'shakil.raj@ecocycle.bd',
    phone: '+880 1944-778899',
    assignedDistricts: ['Rajshahi', 'Bogura'],
    vehicleType: 'Standard EV Van',
    vehicleNumber: 'Rajshahi-RA-07-4482',
    status: 'Active',
    totalCollections: 51,
    rating: 4.9
  }
]

const INITIAL_USERS = [
  {
    id: 'usr-101',
    name: 'Afia Jabin',
    email: 'afia.jabin@gmail.com',
    phone: '+880 1712-345678',
    district: 'Dhaka',
    address: 'House 42, Road 9A, Dhanmondi, Dhaka - 1209',
    totalRequests: 4,
    totalKgRecycled: 48,
    status: 'Active',
    joinedDate: 'Jan 14, 2026'
  },
  {
    id: 'usr-102',
    name: 'Tasnim Jahan',
    email: 'tasnim.jahan@yahoo.com',
    phone: '+880 1815-998877',
    district: 'Chattogram',
    address: 'Flat 6B, Green Valley, Nasirabad, Chattogram',
    totalRequests: 5,
    totalKgRecycled: 62,
    status: 'Active',
    joinedDate: 'Feb 02, 2026'
  },
  {
    id: 'usr-103',
    name: 'Farhan Mahmud',
    email: 'farhan.m@gmail.com',
    phone: '+880 1923-456789',
    district: 'Dhaka',
    address: 'Plot 18, Block D, Mirpur 12, Dhaka',
    totalRequests: 3,
    totalKgRecycled: 31,
    status: 'Active',
    joinedDate: 'Feb 20, 2026'
  },
  {
    id: 'usr-104',
    name: 'Nusrat Chowdhury',
    email: 'nusrat.c@outlook.com',
    phone: '+880 1788-123456',
    district: 'Sylhet',
    address: 'Rose View Heights, Zindabazar, Sylhet',
    totalRequests: 2,
    totalKgRecycled: 22,
    status: 'Active',
    joinedDate: 'Mar 01, 2026'
  }
]

const INITIAL_REQUESTS = [
  {
    id: 'REQ-BD-8901',
    userId: 'usr-101',
    userName: 'Afia Jabin',
    userPhone: '+880 1712-345678',
    district: 'Dhaka',
    address: 'House 42, Road 9A, Dhanmondi, Dhaka - 1209',
    plasticTypes: ['PET Bottles', 'HDPE Containers'],
    estimatedKg: 12,
    verifiedKg: 12.5,
    preferredDate: '2026-08-16',
    preferredTime: 'Morning (9:00 AM - 1:00 PM)',
    status: 'Accepted',
    collectorId: 'col-201',
    collectorName: 'Kabir Hossain',
    facilityId: 'fac-1',
    facilityName: 'Dhaka North Mechanical Polymer Recycling Plant',
    notes: 'Plastic bottles rinsed and packed in 2 large transparent bags at gate.',
    createdAt: '2026-08-15T09:30:00Z',
    updatedAt: '2026-08-15T11:15:00Z'
  },
  {
    id: 'REQ-BD-8902',
    userId: 'usr-101',
    userName: 'Afia Jabin',
    userPhone: '+880 1712-345678',
    district: 'Dhaka',
    address: 'House 42, Road 9A, Dhanmondi, Dhaka - 1209',
    plasticTypes: ['LDPE Bags & Films', 'Mixed Plastics'],
    estimatedKg: 8,
    verifiedKg: 8.2,
    preferredDate: '2026-08-10',
    preferredTime: 'Afternoon (2:00 PM - 6:00 PM)',
    status: 'Completed',
    collectorId: 'col-201',
    collectorName: 'Kabir Hossain',
    facilityId: 'fac-1',
    facilityName: 'Dhaka North Mechanical Polymer Recycling Plant',
    notes: 'Clean household packaging wraps and bags.',
    createdAt: '2026-08-09T14:00:00Z',
    updatedAt: '2026-08-10T17:30:00Z'
  },
  {
    id: 'REQ-BD-8903',
    userId: 'usr-103',
    userName: 'Farhan Mahmud',
    userPhone: '+880 1923-456789',
    district: 'Dhaka',
    address: 'Plot 18, Block D, Mirpur 12, Dhaka',
    plasticTypes: ['PET Bottles', 'PP Plastics'],
    estimatedKg: 15,
    verifiedKg: null,
    preferredDate: '2026-08-17',
    preferredTime: 'Morning (9:00 AM - 1:00 PM)',
    status: 'Pending',
    collectorId: null,
    collectorName: null,
    facilityId: null,
    facilityName: null,
    notes: 'Beverage bottles from family event. Stored on ground floor.',
    createdAt: '2026-08-15T16:45:00Z',
    updatedAt: '2026-08-15T16:45:00Z'
  },
  {
    id: 'REQ-BD-8904',
    userId: 'usr-102',
    userName: 'Tasnim Jahan',
    userPhone: '+880 1815-998877',
    district: 'Chattogram',
    address: 'Flat 6B, Green Valley, Nasirabad, Chattogram',
    plasticTypes: ['HDPE Containers', 'PET Bottles'],
    estimatedKg: 18,
    verifiedKg: 19.0,
    preferredDate: '2026-08-14',
    preferredTime: 'Morning (9:00 AM - 1:00 PM)',
    status: 'Delivered to Facility',
    collectorId: 'col-202',
    collectorName: 'Rashedul Karim',
    facilityId: 'fac-2',
    facilityName: 'Chattogram Circular Polymer Upcycling Facility',
    notes: 'Detergent bottles and mineral water bottles.',
    createdAt: '2026-08-13T10:00:00Z',
    updatedAt: '2026-08-14T15:20:00Z'
  },
  {
    id: 'REQ-BD-8905',
    userId: 'usr-104',
    userName: 'Nusrat Chowdhury',
    userPhone: '+880 1788-123456',
    district: 'Sylhet',
    address: 'Rose View Heights, Zindabazar, Sylhet',
    plasticTypes: ['PET Bottles'],
    estimatedKg: 10,
    verifiedKg: 10.5,
    preferredDate: '2026-08-15',
    preferredTime: 'Afternoon (2:00 PM - 6:00 PM)',
    status: 'Collected',
    collectorId: 'col-203',
    collectorName: 'Moinul Hassan',
    facilityId: 'fac-5',
    facilityName: 'Sylhet Regional Eco-Pelletizing Facility',
    notes: 'Sorted bottles ready for collection.',
    createdAt: '2026-08-14T11:20:00Z',
    updatedAt: '2026-08-15T14:40:00Z'
  }
]

export function DataProvider({ children }) {
  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem('ecocycle-requests')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // Automatically migrate any legacy name to Afia Jabin
        return parsed.map(r => {
          if (r.userId === 'usr-101' || r.userName?.includes('Rahim')) {
            return { ...r, userName: 'Afia Jabin' }
          }
          return r
        })
      } catch (e) {
        return INITIAL_REQUESTS
      }
    }
    return INITIAL_REQUESTS
  })

  const [collectors, setCollectors] = useState(() => {
    const saved = localStorage.getItem('ecocycle-collectors')
    return saved ? JSON.parse(saved) : INITIAL_COLLECTORS
  })

  const [facilities, setFacilities] = useState(() => {
    const saved = localStorage.getItem('ecocycle-facilities')
    return saved ? JSON.parse(saved) : INITIAL_FACILITIES
  })

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('ecocycle-users')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        return parsed.map(u => {
          if (u.id === 'usr-101') {
            return { ...u, name: 'Afia Jabin', email: 'afia.jabin@gmail.com' }
          }
          return u
        })
      } catch (e) {
        return INITIAL_USERS
      }
    }
    return INITIAL_USERS
  })

  useEffect(() => {
    localStorage.setItem('ecocycle-requests', JSON.stringify(requests))
  }, [requests])

  useEffect(() => {
    localStorage.setItem('ecocycle-collectors', JSON.stringify(collectors))
  }, [collectors])

  useEffect(() => {
    localStorage.setItem('ecocycle-facilities', JSON.stringify(facilities))
  }, [facilities])

  useEffect(() => {
    localStorage.setItem('ecocycle-users', JSON.stringify(users))
  }, [users])

  // Actions
  const createRequest = (requestData) => {
    const id = 'REQ-BD-' + Math.floor(1000 + Math.random() * 9000)
    const newRequest = {
      id,
      verifiedKg: null,
      status: 'Pending',
      collectorId: null,
      collectorName: null,
      facilityId: null,
      facilityName: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...requestData
    }

    setRequests(prev => [newRequest, ...prev])

    // Update user stats
    setUsers(prev => prev.map(u => {
      if (u.id === requestData.userId) {
        return {
          ...u,
          totalRequests: (u.totalRequests || 0) + 1,
          totalKgRecycled: (u.totalKgRecycled || 0) + (Number(requestData.estimatedKg) || 0)
        }
      }
      return u
    }))

    return newRequest
  }

  const cancelRequest = (requestId) => {
    setRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return { ...r, status: 'Cancelled', updatedAt: new Date().toISOString() }
      }
      return r
    }))
  }

  const updateRequestStatus = (requestId, newStatus, extraData = {}) => {
    setRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        const updated = {
          ...r,
          status: newStatus,
          updatedAt: new Date().toISOString(),
          ...extraData
        }

        // If delivered to facility, increment facility received volume
        if (newStatus === 'Delivered to Facility' && extraData.facilityId) {
          const weight = Number(extraData.verifiedKg || r.verifiedKg || r.estimatedKg || 0)
          setFacilities(fPrev => fPrev.map(f => {
            if (f.id === extraData.facilityId) {
              return { ...f, totalReceivedKg: (f.totalReceivedKg || 0) + weight }
            }
            return f
          }))
        }

        return updated
      }
      return r
    }))
  }

  const assignCollectorToRequest = (requestId, collectorId) => {
    const collector = collectors.find(c => c.id === collectorId)
    setRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          collectorId: collector ? collector.id : null,
          collectorName: collector ? collector.name : null,
          status: r.status === 'Pending' && collector ? 'Accepted' : r.status,
          updatedAt: new Date().toISOString()
        }
      }
      return r
    }))
  }

  const deleteRequest = (requestId) => {
    setRequests(prev => prev.filter(r => r.id !== requestId))
  }

  const addCollector = (newCol) => {
    const id = 'col-' + Math.floor(200 + Math.random() * 800)
    const col = {
      id,
      status: 'Active',
      totalCollections: 0,
      rating: 5.0,
      ...newCol
    }
    setCollectors(prev => [...prev, col])
    return col
  }

  const updateCollectorDistricts = (collectorId, assignedDistricts) => {
    setCollectors(prev => prev.map(c => {
      if (c.id === collectorId) {
        return { ...c, assignedDistricts }
      }
      return c
    }))
  }

  const addFacility = (newFac) => {
    const id = 'fac-' + Math.floor(10 + Math.random() * 90)
    const fac = {
      id,
      totalReceivedKg: 0,
      status: 'Operational',
      ...newFac
    }
    setFacilities(prev => [...prev, fac])
    return fac
  }

  const toggleUserStatus = (userId) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' }
      }
      return u
    }))
  }

  return (
    <DataContext.Provider value={{
      requests,
      collectors,
      facilities,
      users,
      createRequest,
      cancelRequest,
      updateRequestStatus,
      assignCollectorToRequest,
      deleteRequest,
      addCollector,
      updateCollectorDistricts,
      addFacility,
      toggleUserStatus,
      divisions: BANGLADESH_DIVISIONS,
      allDistricts: ALL_64_DISTRICTS
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

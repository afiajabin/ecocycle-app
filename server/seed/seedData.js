const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Request = require('../models/Request');
const Facility = require('../models/Facility');

// Load environment variables
dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🌱 Connected to MongoDB Atlas for seeding...');

    // Clear existing collections
    await User.deleteMany({});
    await Request.deleteMany({});
    await Facility.deleteMany({});
    console.log('🧹 Cleaned existing database records.');

    // 1. Create Citizen Account (Her Part)
    const citizenUser = await User.create({
      name: 'Sadia Sultana',
      email: 'sadia.citizen@ecocycle.bd',
      password: 'password123',
      role: 'citizen',
      phone: '+880 1712-345678',
      district: 'Dhaka',
      address: 'House 42, Road 9A, Dhanmondi, Dhaka - 1209',
      totalRecycledKg: 48,
      totalRequestsCount: 4,
      status: 'Active',
    });

    // 2. Create Collector Accounts (Your Part)
    const afiaCollector = await User.create({
      name: 'Afia Jabin',
      email: 'afiajabin12@gmail.com',
      password: 'password123',
      role: 'collector',
      phone: '+880 1712-345678',
      district: 'Dhaka',
      assignedDistricts: ['Dhaka', 'Gazipur'],
      vehicleType: 'Electric Waste Van (EV-04)',
      vehicleNumber: 'Dhaka Metro-DH-11-2045',
      rating: 5.0,
      totalCollections: 18,
      status: 'Active',
    });

    const kabirCollector = await User.create({
      name: 'Kabir Hossain',
      email: 'kabir.collector@ecocycle.bd',
      password: 'password123',
      role: 'collector',
      phone: '+880 1819-876543',
      district: 'Dhaka',
      assignedDistricts: ['Dhaka', 'Gazipur'],
      vehicleType: 'Electric Waste Van (EV-02)',
      vehicleNumber: 'Dhaka Metro-DH-14-9988',
      rating: 4.9,
      totalCollections: 142,
      status: 'Active',
    });

    // 3. Create Admin Account
    const adminUser = await User.create({
      name: 'Dr. Shahriar Rahman',
      email: 'admin@ecocycle.bd',
      password: 'password123',
      role: 'admin',
      phone: '+880 1911-001122',
      district: 'Dhaka',
      status: 'Active',
    });

    console.log('👤 Users seeded:');
    console.log(`   - Citizen:   ${citizenUser.email} (pass: password123)`);
    console.log(`   - Collector: ${afiaCollector.email} (pass: password123)`);
    console.log(`   - Admin:     ${adminUser.email} (pass: password123)`);

    // 4. Create Facilities
    const facilities = await Facility.insertMany([
      {
        name: 'Dhaka North Mechanical Polymer Recycling Plant',
        district: 'Dhaka',
        location: 'Aminbazar Industrial Zone, Dhaka',
        type: 'Mechanical Recycling & Flaking',
        dailyCapacityTons: 45,
        totalReceivedKg: 324000,
        contactPerson: 'Engr. Mahfuzul Alam',
        contactPhone: '+880 1711-223344',
        status: 'Operational',
        acceptedTypes: ['PET Bottles', 'HDPE Containers', 'PP Plastics'],
      },
      {
        name: 'Chattogram Circular Polymer Upcycling Facility',
        district: 'Chattogram',
        location: 'Sagarika Industrial Area, Chattogram',
        type: 'Chemical & Mechanical Pelletizing',
        dailyCapacityTons: 60,
        totalReceivedKg: 480000,
        contactPerson: 'Tareq Chowdhury',
        contactPhone: '+880 1812-334455',
        status: 'Operational',
        acceptedTypes: ['PET Bottles', 'LDPE Bags & Films', 'Mixed Plastics'],
      },
      {
        name: 'Gazipur Waste-to-Energy & RDF Gasification Center',
        district: 'Gazipur',
        location: 'Kashimpur, Gazipur',
        type: 'Waste-to-Energy & Refuse-Derived Fuel (RDF)',
        dailyCapacityTons: 80,
        totalReceivedKg: 610000,
        contactPerson: 'Dr. Nazmul Huda',
        contactPhone: '+880 1913-445566',
        status: 'Operational',
        acceptedTypes: ['Non-recyclable Multilayer Plastics', 'Mixed Plastic Litter', 'LDPE Films'],
      },
      {
        name: 'Narayanganj High-Grade Extrusion Works',
        district: 'Narayanganj',
        location: 'Adamjee EPZ, Narayanganj',
        type: 'High-Density Extrusion',
        dailyCapacityTons: 35,
        totalReceivedKg: 195000,
        contactPerson: 'Kamrul Islam',
        contactPhone: '+880 1614-556677',
        status: 'Operational',
        acceptedTypes: ['HDPE Containers', 'PP Plastics'],
      },
      {
        name: 'Sylhet Regional Eco-Pelletizing Facility',
        district: 'Sylhet',
        location: 'Khadimnagar Industrial Estate, Sylhet',
        type: 'Mechanical Shredding & Washing',
        dailyCapacityTons: 25,
        totalReceivedKg: 112000,
        contactPerson: 'Abdul Mannan',
        contactPhone: '+880 1715-667788',
        status: 'Operational',
        acceptedTypes: ['PET Bottles', 'HDPE Containers'],
      },
    ]);
    console.log(`🏭 ${facilities.length} Recycling Facilities seeded.`);

    // 5. Create Pickup Requests
    const dhakaFac = facilities[0];

    await Request.insertMany([
      {
        requestId: 'REQ-BD-8901',
        userId: citizenUser._id,
        userName: citizenUser.name,
        userPhone: citizenUser.phone,
        district: 'Dhaka',
        address: citizenUser.address,
        plasticTypes: ['PET Bottles', 'HDPE Containers'],
        estimatedKg: 12,
        verifiedKg: 12.5,
        preferredDate: '2026-08-30',
        preferredTime: 'Morning (9:00 AM - 1:00 PM)',
        status: 'Accepted',
        collectorId: afiaCollector._id,
        collectorName: afiaCollector.name,
        facilityId: dhakaFac._id,
        facilityName: dhakaFac.name,
        notes: 'Plastic bottles rinsed and packed in 2 large transparent bags at gate.',
      },
      {
        requestId: 'REQ-BD-8902',
        userId: citizenUser._id,
        userName: citizenUser.name,
        userPhone: citizenUser.phone,
        district: 'Dhaka',
        address: citizenUser.address,
        plasticTypes: ['LDPE Bags & Films', 'Mixed Plastics'],
        estimatedKg: 8,
        verifiedKg: 8.2,
        preferredDate: '2026-08-28',
        preferredTime: 'Afternoon (2:00 PM - 6:00 PM)',
        status: 'Completed',
        collectorId: afiaCollector._id,
        collectorName: afiaCollector.name,
        facilityId: dhakaFac._id,
        facilityName: dhakaFac.name,
        notes: 'Clean household packaging wraps and bags.',
      },
      {
        requestId: 'REQ-BD-8903',
        userId: citizenUser._id,
        userName: 'Farhan Mahmud',
        userPhone: '+880 1923-456789',
        district: 'Dhaka',
        address: 'Plot 18, Block D, Mirpur 12, Dhaka',
        plasticTypes: ['PET Bottles', 'PP Plastics'],
        estimatedKg: 15,
        verifiedKg: null,
        preferredDate: '2026-08-31',
        preferredTime: 'Morning (9:00 AM - 1:00 PM)',
        status: 'Pending',
        collectorId: null,
        collectorName: null,
        facilityId: null,
        facilityName: null,
        notes: 'Beverage bottles from community event. Stored on ground floor.',
      },
      {
        requestId: 'REQ-BD-8904',
        userId: citizenUser._id,
        userName: 'Tanvir Ahmed',
        userPhone: '+880 1912-334455',
        district: 'Gazipur',
        address: 'Chowrasta Industrial Area, Gazipur',
        plasticTypes: ['PP Plastics', 'PET Bottles'],
        estimatedKg: 25,
        verifiedKg: null,
        preferredDate: '2026-08-30',
        preferredTime: 'Afternoon (2:00 PM - 6:00 PM)',
        status: 'Pending',
        collectorId: null,
        collectorName: null,
        facilityId: null,
        facilityName: null,
        notes: 'Clean sorted industrial plastics.',
      },
    ]);

    console.log('📦 Sample pickup requests seeded.');
    console.log('\n🎉 Unified database seeding finished successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDB();

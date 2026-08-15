export const adminStats = {
  totalUsers: 4827,
  activeBookings: 34,
  revenueToday: 18420,
  totalFleet: 156,
  availableCars: 98,
  maintenance: 12,
  rentedCars: 46,
  pendingKyc: 23,
  verifiedUsers: 4102,
  blockedUsers: 18,
};

export const bookingsTrend = [
  { month: "Jan", bookings: 142, revenue: 28400 },
  { month: "Feb", bookings: 168, revenue: 33600 },
  { month: "Mar", bookings: 195, revenue: 39000 },
  { month: "Apr", bookings: 210, revenue: 42000 },
  { month: "May", bookings: 248, revenue: 49600 },
  { month: "Jun", bookings: 286, revenue: 57200 },
  { month: "Jul", bookings: 312, revenue: 62400 },
  { month: "Aug", bookings: 298, revenue: 59600 },
];

export const fleetStatusData = [
  { label: "Available", value: 98, color: "#10b981" },
  { label: "Rented", value: 46, color: "#063B9F" },
  { label: "Maintenance", value: 12, color: "#f59e0b" },
];

export const fleetTracking = [
  { id: "car001", name: "BMW M4 Competition", lat: 24.86, lng: 67.01, status: "rented", city: "Karachi" },
  { id: "car002", name: "Mercedes-Benz S-Class", lat: 31.52, lng: 74.35, status: "rented", city: "Lahore" },
  { id: "car003", name: "Audi R8 V10", lat: 33.68, lng: 73.05, status: "rented", city: "Islamabad" },
  { id: "car005", name: "Toyota Corolla Altis", lat: 24.91, lng: 67.08, status: "available", city: "Karachi" },
  { id: "car007", name: "Tesla Model S", lat: 31.55, lng: 74.34, status: "rented", city: "Lahore" },
  { id: "car009", name: "Ford Mustang GT", lat: 33.72, lng: 73.07, status: "available", city: "Islamabad" },
  { id: "car010", name: "Hyundai Tucson", lat: 30.16, lng: 71.45, status: "maintenance", city: "Multan" },
];

export const adminFleet = [
  { id: "car001", name: "BMW M4 Competition", brand: "BMW", category: "Premium", pricePerDay: 189, seats: 4, transmission: "Automatic", fuelType: "Premium Unleaded", status: "rented", rating: 4.9, bookings: 38, image: "https://images.pexels.com/photos/16555016/pexels-photo-16555016.jpeg?auto=compress&cs=tinysrgb&h=120&w=180" },
  { id: "car002", name: "Mercedes-Benz S-Class", brand: "Mercedes-Benz", category: "Luxury", pricePerDay: 240, seats: 5, transmission: "Automatic", fuelType: "Premium Unleaded", status: "rented", rating: 4.8, bookings: 29, image: "https://images.pexels.com/photos/31040120/pexels-photo-31040120.jpeg?auto=compress&cs=tinysrgb&h=120&w=180" },
  { id: "car003", name: "Audi R8 V10", brand: "Audi", category: "Sports", pricePerDay: 350, seats: 2, transmission: "Automatic", fuelType: "Premium Unleaded", status: "rented", rating: 4.9, bookings: 18, image: "https://images.pexels.com/photos/30965480/pexels-photo-30965480.jpeg?auto=compress&cs=tinysrgb&h=120&w=180" },
  { id: "car004", name: "Range Rover Vogue", brand: "Land Rover", category: "SUV", pricePerDay: 215, seats: 7, transmission: "Automatic", fuelType: "Diesel", status: "available", rating: 4.7, bookings: 34, image: "https://images.pexels.com/photos/16510649/pexels-photo-16510649.jpeg?auto=compress&cs=tinysrgb&h=120&w=180" },
  { id: "car005", name: "Toyota Corolla Altis", brand: "Toyota", category: "Economy", pricePerDay: 45, seats: 5, transmission: "Automatic", fuelType: "Regular Unleaded", status: "available", rating: 4.5, bookings: 72, image: "https://images.pexels.com/photos/37620310/pexels-photo-37620310.jpeg?auto=compress&cs=tinysrgb&h=120&w=180" },
  { id: "car006", name: "Honda Civic Turbo", brand: "Honda", category: "Economy", pricePerDay: 55, seats: 5, transmission: "Automatic", fuelType: "Regular Unleaded", status: "available", rating: 4.6, bookings: 64, image: "https://images.pexels.com/photos/6794821/pexels-photo-6794821.jpeg?auto=compress&cs=tinysrgb&h=120&w=180" },
  { id: "car007", name: "Tesla Model S", brand: "Tesla", category: "Electric", pricePerDay: 195, seats: 5, transmission: "Automatic", fuelType: "Electric", status: "rented", rating: 4.9, bookings: 41, image: "https://images.pexels.com/photos/26957121/pexels-photo-26957121.jpeg?auto=compress&cs=tinysrgb&h=120&w=180" },
  { id: "car008", name: "Porsche 911 Carrera", brand: "Porsche", category: "Sports", pricePerDay: 310, seats: 4, transmission: "Automatic", fuelType: "Premium Unleaded", status: "available", rating: 4.9, bookings: 22, image: "https://images.pexels.com/photos/35849576/pexels-photo-35849576.jpeg?auto=compress&cs=tinysrgb&h=120&w=180" },
  { id: "car009", name: "Ford Mustang GT", brand: "Ford", category: "Sports", pricePerDay: 165, seats: 4, transmission: "Manual", fuelType: "Premium Unleaded", status: "available", rating: 4.7, bookings: 45, image: "https://images.pexels.com/photos/16284856/pexels-photo-16284856.jpeg?auto=compress&cs=tinysrgb&h=120&w=180" },
  { id: "car010", name: "Hyundai Tucson", brand: "Hyundai", category: "SUV", pricePerDay: 85, seats: 5, transmission: "Automatic", fuelType: "Regular Unleaded", status: "maintenance", rating: 4.6, bookings: 52, image: "https://images.pexels.com/photos/19911371/pexels-photo-19911371.jpeg?auto=compress&cs=tinysrgb&h=120&w=180" },
  { id: "car011", name: "Kia Sportage", brand: "Kia", category: "SUV", pricePerDay: 75, seats: 5, transmission: "Automatic", fuelType: "Regular Unleaded", status: "maintenance", rating: 4.5, bookings: 38, image: "https://images.pexels.com/photos/27286179/pexels-photo-27286179.jpeg?auto=compress&cs=tinysrgb&h=120&w=180" },
  { id: "car012", name: "Mercedes-Benz E-Class", brand: "Mercedes-Benz", category: "Premium", pricePerDay: 145, seats: 5, transmission: "Automatic", fuelType: "Premium Unleaded", status: "available", rating: 4.8, bookings: 33, image: "https://images.pexels.com/photos/10638649/pexels-photo-10638649.jpeg?auto=compress&cs=tinysrgb&h=120&w=180" },
];

export const adminBookings = [
  { id: "BK001", customer: "Bilal Ahmed", email: "bilal@email.com", car: "BMW M4 Competition", pickupDate: "2026-08-14", returnDate: "2026-08-18", days: 4, total: 756, status: "active", pickupLocation: "Karachi — Airport", payment: "card" },
  { id: "BK002", customer: "Ayesha Khan", email: "ayesha@email.com", car: "Mercedes-Benz S-Class", pickupDate: "2026-08-13", returnDate: "2026-08-20", days: 7, total: 1680, status: "active", pickupLocation: "Lahore — Gulberg", payment: "card" },
  { id: "BK003", customer: "Hamza Raza", email: "hamza@email.com", car: "Audi R8 V10", pickupDate: "2026-08-15", returnDate: "2026-08-16", days: 1, total: 350, status: "pending", pickupLocation: "Islamabad — Airport", payment: "card" },
  { id: "BK004", customer: "Sana Malik", email: "sana@email.com", car: "Tesla Model S", pickupDate: "2026-08-10", returnDate: "2026-08-12", days: 2, total: 390, status: "completed", pickupLocation: "Lahore — Airport", payment: "cash" },
  { id: "BK005", customer: "Usman Tariq", email: "usman@email.com", car: "Toyota Corolla Altis", pickupDate: "2026-08-14", returnDate: "2026-08-21", days: 7, total: 315, status: "confirmed", pickupLocation: "Karachi — Clifton", payment: "card" },
  { id: "BK006", customer: "Fatima Noor", email: "fatima@email.com", car: "Range Rover Vogue", pickupDate: "2026-08-08", returnDate: "2026-08-11", days: 3, total: 645, status: "completed", pickupLocation: "Islamabad — Blue Area", payment: "card" },
  { id: "BK007", customer: "Ali Hassan", email: "ali@email.com", car: "Porsche 911 Carrera", pickupDate: "2026-08-16", returnDate: "2026-08-18", days: 2, total: 620, status: "pending", pickupLocation: "Lahore — Gulberg", payment: "card" },
  { id: "BK008", customer: "Zainab Iqbal", email: "zainab@email.com", car: "Honda Civic Turbo", pickupDate: "2026-08-05", returnDate: "2026-08-07", days: 2, total: 110, status: "cancelled", pickupLocation: "Karachi — Airport", payment: "cash" },
  { id: "BK009", customer: "Bilal Ahmed", email: "bilal@email.com", car: "Ford Mustang GT", pickupDate: "2026-08-17", returnDate: "2026-08-19", days: 2, total: 330, status: "confirmed", pickupLocation: "Islamabad — Airport", payment: "card" },
  { id: "BK010", customer: "Hira Aslam", email: "hira@email.com", car: "Hyundai Tucson", pickupDate: "2026-08-12", returnDate: "2026-08-15", days: 3, total: 255, status: "active", pickupLocation: "Multan — City Center", payment: "card" },
  { id: "BK011", customer: "Adnan Yousaf", email: "adnan@email.com", car: "Mercedes-Benz E-Class", pickupDate: "2026-08-09", returnDate: "2026-08-13", days: 4, total: 580, status: "completed", pickupLocation: "Lahore — Airport", payment: "card" },
  { id: "BK012", customer: "Maryam Javed", email: "maryam@email.com", car: "Kia Sportage", pickupDate: "2026-08-18", returnDate: "2026-08-22", days: 4, total: 300, status: "pending", pickupLocation: "Rawalpindi — Saddar", payment: "cash" },
];

export const adminUsers = [
  { id: "u_001", name: "Bilal Ahmed", email: "bilal@email.com", phone: "0300-1234567", joined: "2024-11-12", status: "active", bookings: 8, cnic: "approved", license: "approved", totalSpent: 4820 },
  { id: "u_002", name: "Ayesha Khan", email: "ayesha@email.com", phone: "0321-2345678", joined: "2024-10-28", status: "active", bookings: 12, cnic: "approved", license: "approved", totalSpent: 9340 },
  { id: "u_003", name: "Hamza Raza", email: "hamza@email.com", phone: "0333-3456789", joined: "2024-09-15", status: "active", bookings: 5, cnic: "approved", license: "pending", totalSpent: 2150 },
  { id: "u_004", name: "Sana Malik", email: "sana@email.com", phone: "0345-4567890", joined: "2024-08-03", status: "active", bookings: 3, cnic: "pending", license: "pending", totalSpent: 980 },
  { id: "u_005", name: "Usman Tariq", email: "usman@email.com", phone: "0301-5678901", joined: "2024-12-01", status: "active", bookings: 7, cnic: "approved", license: "approved", totalSpent: 3240 },
  { id: "u_006", name: "Fatima Noor", email: "fatima@email.com", phone: "0322-6789012", joined: "2024-07-19", status: "blocked", bookings: 2, cnic: "rejected", license: "rejected", totalSpent: 540 },
  { id: "u_007", name: "Ali Hassan", email: "ali@email.com", phone: "0334-7890123", joined: "2025-01-05", status: "active", bookings: 4, cnic: "approved", license: "approved", totalSpent: 1680 },
  { id: "u_008", name: "Zainab Iqbal", email: "zainab@email.com", phone: "0346-8901234", joined: "2024-06-22", status: "active", bookings: 6, cnic: "approved", license: "pending", totalSpent: 2720 },
  { id: "u_009", name: "Hira Aslam", email: "hira@email.com", phone: "0302-9012345", joined: "2025-02-14", status: "active", bookings: 1, cnic: "pending", license: "pending", totalSpent: 255 },
  { id: "u_010", name: "Adnan Yousaf", email: "adnan@email.com", phone: "0323-0123456", joined: "2024-05-08", status: "active", bookings: 9, cnic: "approved", license: "approved", totalSpent: 5210 },
  { id: "u_011", name: "Maryam Javed", email: "maryam@email.com", phone: "0335-1234567", joined: "2025-03-01", status: "active", bookings: 2, cnic: "pending", license: "approved", totalSpent: 580 },
  { id: "u_012", name: "Kamran Shah", email: "kamran@email.com", phone: "0347-2345678", joined: "2024-04-17", status: "blocked", bookings: 0, cnic: "rejected", license: "pending", totalSpent: 0 },
];

export const adminReports = {
  totalRevenue: 371800,
  totalBookings: 1859,
  fleetUtilization: 64.2,
  avgRentalDays: 3.8,
  revenueByMonth: bookingsTrend,
  popularVehicles: [
    { name: "Toyota Corolla Altis", bookings: 72, revenue: 14400 },
    { name: "Honda Civic Turbo", bookings: 64, revenue: 18720 },
    { name: "Hyundai Tucson", bookings: 52, revenue: 22960 },
    { name: "Ford Mustang GT", bookings: 45, revenue: 31350 },
    { name: "BMW M4 Competition", bookings: 38, revenue: 41580 },
    { name: "Range Rover Vogue", bookings: 34, revenue: 38700 },
  ],
};

export const pricingRules = [
  { id: "pr001", name: "Weekend Discount", type: "weekend", discount: 10, active: true, description: "10% off Friday–Sunday bookings" },
  { id: "pr002", name: "Holiday Special", type: "holiday", discount: 15, active: true, description: "15% off during public holidays" },
  { id: "pr003", name: "High-Demand Surcharge", type: "high-demand", discount: -20, active: true, description: "+20% during peak demand periods" },
  { id: "pr004", name: "Long-Rental Discount", type: "long-rental", discount: 12, active: true, description: "12% off bookings 7+ days" },
  { id: "pr005", name: "Early Bird", type: "early-bird", discount: 8, active: false, description: "8% off bookings made 14+ days ahead" },
];

export const adminSettings = {
  company: {
    name: "DriveEasy Car Rentals",
    email: "contact@driveeasy.com",
    phone: "+92 21 111 222 333",
    address: "Shahrah-e-Faisal, Karachi, Pakistan",
    website: "www.driveeasy.com",
  },
  hours: {
    weekday: "8:00 AM – 10:00 PM",
    weekend: "9:00 AM – 8:00 PM",
    holiday: "10:00 AM – 6:00 PM",
  },
  policies: {
    cancellationWindow: 48,
    cancellationFee: 15,
    depositAmount: 200,
    depositRefundDays: 5,
  },
  adminUsers: [
    { id: "a_001", name: "DriveEasy Admin", email: "admin@driveeasy.com", role: "Super Admin", lastActive: "2026-08-14 09:30" },
    { id: "a_002", name: "Sarah Operations", email: "sarah@driveeasy.com", role: "Operations", lastActive: "2026-08-13 16:45" },
    { id: "a_003", name: "Mike Fleet", email: "mike@driveeasy.com", role: "Fleet Manager", lastActive: "2026-08-14 08:15" },
  ],
  notifications: {
    newBooking: true,
    cancellation: true,
    kycSubmission: true,
    lowInventory: false,
    dailyReport: true,
    paymentReceived: true,
  },
  security: {
    twoFactor: true,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAttempts: 5,
  },
};

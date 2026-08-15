const BOOKINGS_KEY = "driveeasy_bookings";

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

const readBookings = () => {
  try {
    return JSON.parse(localStorage.getItem(BOOKINGS_KEY)) || [];
  } catch {
    return [];
  }
};

const writeBookings = (bookings) => {
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
};

const bookingService = {
  async create(booking) {
    await delay();
    // return api.post("/bookings", booking).then(r => r.data);

    const bookings = readBookings();
    const newBooking = {
      ...booking,
      id: `BK${Date.now().toString().slice(-8)}`,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };
    bookings.push(newBooking);
    writeBookings(bookings);
    return newBooking;
  },

  async getByUser(userId) {
    await delay();
    // return api.get(`/bookings/user/${userId}`).then(r => r.data);
    return readBookings().filter((b) => b.userId === userId);
  },

  async getById(id) {
    await delay();
    // return api.get(`/bookings/${id}`).then(r => r.data);
    const booking = readBookings().find((b) => b.id === id);
    if (!booking) throw new Error("Booking not found.");
    return booking;
  },

  async getAll() {
    await delay();
    // return api.get("/bookings").then(r => r.data);
    return readBookings();
  },

  async updateStatus(id, status) {
    await delay();
    // return api.patch(`/bookings/${id}/status`, { status }).then(r => r.data);
    const bookings = readBookings();
    const idx = bookings.findIndex((b) => b.id === id);
    if (idx === -1) throw new Error("Booking not found.");
    bookings[idx].status = status;
    writeBookings(bookings);
    return bookings[idx];
  },
};

export default bookingService;

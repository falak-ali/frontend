// Auth service.
// Today this uses localStorage so the frontend is fully functional
// without a backend. When the Express API is ready, uncomment the
// network calls and remove the local fallbacks.

const USERS_KEY = "driveeasy_users";
const TOKEN_KEY = "driveeasy_token";
const CURRENT_KEY = "driveeasy_current_user";

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

const readUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
};

const writeUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const makeToken = (user) =>
  btoa(`${user.email}:${Date.now()}`);

const sanitize = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  verification: user.verification,
  createdAt: user.createdAt,
});

const authService = {
  async login({ email, password }) {
    await delay();
    // return api.post("/auth/login", { email, password }).then(r => r.data);

    const user = readUsers().find((u) => u.email === email && u.password === password);
    if (!user) throw new Error("Invalid email or password.");
    const token = makeToken(user);
    const safe = sanitize(user);
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(CURRENT_KEY, JSON.stringify(safe));
    return safe;
  },

  async signup({ name, email, phone, password }) {
    await delay();
    // return api.post("/auth/signup", { name, email, phone, password }).then(r => r.data);

    const users = readUsers();
    if (users.some((u) => u.email === email)) {
      throw new Error("An account with this email already exists.");
    }
    const newUser = {
      id: `u_${Date.now()}`,
      name,
      email,
      phone,
      password,
      role: "user",
      verification: { cnic: "pending", license: "pending" },
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    writeUsers(users);
    const token = makeToken(newUser);
    const safe = sanitize(newUser);
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(CURRENT_KEY, JSON.stringify(safe));
    return safe;
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(CURRENT_KEY);
  },

  getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem(CURRENT_KEY));
    } catch {
      return null;
    }
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  isAuthenticated() {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  // Seed a default admin account on first load for demo purposes.
  seedAdmin() {
    const users = readUsers();
    if (!users.some((u) => u.email === "admin@driveeasy.com")) {
      users.push({
        id: "u_admin",
        name: "DriveEasy Admin",
        email: "admin@driveeasy.com",
        phone: "0300-0000000",
        password: "admin123",
        role: "admin",
        verification: { cnic: "approved", license: "approved" },
        createdAt: new Date().toISOString(),
      });
      writeUsers(users);
    }
  },

  // Used by the admin dashboard to list all registered users.
  getAllUsers() {
    return readUsers().map(sanitize);
  },
};

export default authService;

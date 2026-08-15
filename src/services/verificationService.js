const USERS_KEY = "driveeasy_users";

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

const readUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
};

const writeUsers = (users) => {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return true;
  } catch {
    return false;
  }
};

const verificationService = {
  async submit({ userId, cnicFront, cnicBack, licenseFront, licenseBack }) {
    await delay();
    const users = readUsers();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx === -1) throw new Error("User not found.");

    users[idx].verification = {
      cnic: "pending",
      license: "pending",
      cnicFront,
      cnicBack,
      licenseFront,
      licenseBack,
      submittedAt: new Date().toISOString(),
      reviewedAt: null,
    };

    const ok = writeUsers(users);
    if (!ok) throw new Error("Storage limit reached. Please use smaller images (under 4 MB each).");
    return users[idx].verification;
  },

  async getStatus(userId) {
    await delay();
    const user = readUsers().find((u) => u.id === userId);
    if (!user?.verification) return { cnic: "not_submitted", license: "not_submitted" };
    return user.verification;
  },

  async updateStatus(userId, type, status) {
    await delay();
    if (!["cnic", "license"].includes(type)) throw new Error("Invalid document type.");
    if (!["pending", "approved", "rejected"].includes(status)) throw new Error("Invalid status.");

    const users = readUsers();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx === -1) throw new Error("User not found.");

    users[idx].verification = {
      ...users[idx].verification,
      [type]: status,
      reviewedAt: new Date().toISOString(),
    };
    writeUsers(users);
    return users[idx].verification;
  },
};

export default verificationService;

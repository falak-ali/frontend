import { cars as sampleCars } from "../data/cars";

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

const carService = {
  async getAll() {
    await delay();
    // return api.get("/cars").then(r => r.data);
    return sampleCars;
  },

  async getById(id) {
    await delay();
    // return api.get(`/cars/${id}`).then(r => r.data);
    const car = sampleCars.find((c) => c.id === id);
    if (!car) throw new Error("Car not found.");
    return car;
  },

  async getFeatured() {
    await delay();
    // return api.get("/cars/featured").then(r => r.data);
    return sampleCars.filter((c) => c.available).slice(0, 6);
  },

  async create(car) {
    await delay();
    // return api.post("/cars", car).then(r => r.data);
    return { ...car, id: `car_${Date.now()}` };
  },

  async update(id, updates) {
    await delay();
    // return api.put(`/cars/${id}`, updates).then(r => r.data);
    return { ...updates, id };
  },

  async remove(id) {
    await delay();
    // return api.delete(`/cars/${id}`).then(r => r.data);
    return { success: true };
  },
};

export default carService;

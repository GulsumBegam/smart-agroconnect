import axios from "axios";

// Change this to your host machine IP when testing on a real device
const BASE_URL = "http://localhost:3000/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token to every request if available
api.interceptors.request.use((config) => {
  const token = global.authToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Auth ──────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  me: () => api.get("/auth/me"),
};

// ── Listings ──────────────────────────────────────────────
export const listingsAPI = {
  getAll: (params) => api.get("/listings", { params }),
  getOne: (id) => api.get(`/listings/${id}`),
  create: (data) => api.post("/listings", data),
  placeBid: (id, data) => api.post(`/listings/${id}/bids`, data),
};

// ── Predict ───────────────────────────────────────────────
export const predictAPI = {
  crop: (data) => api.post("/predict/crop", data),
  price: (data) => api.post("/predict/price", data),
};

// ── Soil ──────────────────────────────────────────────────
export const soilAPI = {
  analyze: (data) => api.post("/soil/analyze", data),
};

export default api;

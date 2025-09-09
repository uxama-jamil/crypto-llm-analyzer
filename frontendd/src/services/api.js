import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NODE_ENV === "production" ? "" : "http://localhost:5000",
  timeout: 60000, // 60 seconds timeout for LLM analysis
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log("Making API request:", config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log("API response received:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error(
      "API error:",
      error.response?.status,
      error.response?.data || error.message
    );
    return Promise.reject(error);
  }
);

export const cryptoAPI = {
  // Analyze cryptocurrency
  analyze: async (coin, timeframe = "weekly") => {
    try {
      const response = await api.post("/api/analyze", {
        coin: coin.trim(),
        timeframe,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Failed to analyze cryptocurrency"
      );
    }
  },

  // Search for coin
  searchCoin: async (query) => {
    try {
      const response = await api.get(
        `/api/coins/search/${encodeURIComponent(query)}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Failed to search for coin"
      );
    }
  },
};

export default api;

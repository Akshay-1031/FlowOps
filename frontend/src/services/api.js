import axios from "axios";

const api = axios.create({
  baseURL: "https://flowops-wglc.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("flowops_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired/invalid JWTs automatically
api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || "";

    const isAuthError =
      status === 401 ||
      status === 403 ||
      message.toLowerCase().includes("expired") ||
      message.toLowerCase().includes("invalid");

    if (isAuthError) {
      localStorage.removeItem("flowops_token");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
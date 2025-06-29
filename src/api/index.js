import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

export async function fetchLogs(params = {}) {
  try {
    const response = await axios.get(`${API_BASE_URL}/monitor`, {
      params,
      auth: { username: "admin", password: "admin123" },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch logs:", error);
    throw error;
  }
}

export async function fetchLogLevels() {
  try {
    const response = await axios.get(`${API_BASE_URL}/monitor/levels`, {
      auth: { username: "admin", password: "admin123" },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch log levels:", error);
    return [];
  }
}

export async function fetchServices() {
  try {
    const response = await axios.get(`${API_BASE_URL}/monitor/services`, {
      auth: { username: "admin", password: "admin123" },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch services:", error);
    return [];
  }
}

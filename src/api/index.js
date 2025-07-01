import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

// Fetch logs (with filters/pagination)
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

// Fetch all log levels (for dropdown)
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

// Fetch all available service names (for dropdown)
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

// --- Dashboard endpoints below ---

// Fetch total log count
export async function fetchLogCount() {
  try {
    const response = await axios.get(`${API_BASE_URL}/monitor/count`, {
      auth: { username: "admin", password: "admin123" },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch log count:", error);
    return { count: 0 };
  }
}

// Fetch log count grouped by service
export async function fetchLogCountByService() {
  try {
    const response = await axios.get(`${API_BASE_URL}/monitor/count/services`, {
      auth: { username: "admin", password: "admin123" },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch log count by service:", error);
    return [];
  }
}

// Fetch log count grouped by level
export async function fetchLogCountByLevel() {
  try {
    const response = await axios.get(`${API_BASE_URL}/monitor/count/levels`, {
      auth: { username: "admin", password: "admin123" },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch log count by level:", error);
    return [];
  }
}

// Fetch unread alerts (for badge & dropdown)
export async function fetchUnreadAlerts() {
  try {
    const response = await axios.get("http://localhost:8080/api/alerts/unread", {
      auth: { username: "admin", password: "admin123" },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch unread alerts:", error);
    return [];
  }
}

// Fetch all alerts (for alerts page)
export async function fetchAlerts() {
  try {
    const response = await axios.get("http://localhost:8080/api/alerts", {
      auth: { username: "admin", password: "admin123" },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch alerts:", error);
    return [];
  }
}

// Mark alert as read
export async function markAlertAsRead(id) {
  try {
    const response = await axios.patch(
      `http://localhost:8080/api/alerts/${id}/read`,
      {},
      { auth: { username: "admin", password: "admin123" } }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to mark alert as read:", error);
    return null;
  }
}


// Fetch settings
export async function fetchSettings() {
  try {
    const response = await axios.get("http://localhost:8080/api/settings", {
      auth: { username: "admin", password: "admin123" },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return null;
  }
}

// Save/update settings
export async function saveSettings(settings) {
  try {
    const response = await axios.post("http://localhost:8080/api/settings", settings, {
      auth: { username: "admin", password: "admin123" },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to save settings:", error);
    return null;
  }
}

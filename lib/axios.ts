// src/lib/api.ts (Updated with Authorization Token)
import axios from "axios";

// const API_BASE_URL = "http://localhost:3001/api/v1";
const API_BASE_URL = "https://zewotir-media-host-backend.onrender.com";

const instance = axios.create({
  baseURL: API_BASE_URL,
});

export default instance;
/**
 * A simple utility to handle authenticated API requests.
 * It automatically retrieves the JWT from localStorage and attaches it to the Authorization header.
 *
 * @param endpoint - The API path (e.g., "/portfolio/assets")
 * @param options - Standard fetch options (method, body, etc.)
 */
export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  // 1. Retrieve the token from a secure client-side storage (e.g., Local Storage)
  // NOTE: For better security, prefer HTTP-Only Cookies (which are handled automatically by credentials: 'include')
  // We'll use Local Storage here for simplicity in this example.
  let token = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  // 2. Prepare default headers
  const defaultHeaders: Record<string, string> = {
    // If not using FormData (file uploads), set Content-Type to application/json
    // We check options.body to see if it's FormData. If it is, we skip Content-Type.
    ...(!(options.body instanceof FormData) && {
      "Content-Type": "application/json",
    }),
  };

  // 3. Add Authorization header if a token exists
  if (token) {
    // The standard format is "Bearer <TOKEN>"
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  // 4. Combine headers, prioritizing user-provided options
  const finalHeaders = {
    ...defaultHeaders,
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers: finalHeaders,
    // 🌟 Important: Keep credentials: 'include' for cookies (if you switch to cookies later)
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: response.statusText || "API error occurred." }));

    // Check if the error is specifically due to an expired/missing token
    if (response.status === 401 && errorData.error === "No token provided.") {
      // You would typically redirect the user to the login page here
      console.error("Authentication failed. Token may be expired.");
    }

    throw new Error(errorData.message || "Failed to fetch data");
  }

  // Handle 204 No Content response
  if (response.status === 204) return null;

  return response.json();
}

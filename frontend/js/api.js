const API_BASE = "http://localhost:5000/api";

export async function apiFetch(endpoint, method = "GET", body = null) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${API_BASE}${endpoint}`, options);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

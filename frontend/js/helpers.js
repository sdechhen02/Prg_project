export async function apiFetch(endpoint, options={}) {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  const res = await fetch(`http://localhost:5000/api${endpoint}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message||"Request failed");
  return data;
}

export function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

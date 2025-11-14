import { apiFetch } from "./api.js";

// Run when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  loadActivities();
  setupLogout(); // initialize logout button
});

// -----------------------------
// Load activities
// -----------------------------
async function loadActivities() {
  try {
    const data = await apiFetch("/activities");
    const list = document.getElementById("activityList");
    if (!list) return;
    list.innerHTML = data
      .map(
        (a) => `
        <li>
          <strong>${a.type}</strong> — ${a.calories} kcal on ${new Date(a.date).toLocaleDateString()}
          <button onclick="deleteActivity('${a._id}')">❌</button>
        </li>`
      )
      .join("");
  } catch (err) {
    console.error(err);
  }
}

// -----------------------------
// Add new activity
// -----------------------------
const activityForm = document.getElementById("activityForm");
if (activityForm) {
  activityForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const type = e.target.activityType.value;
    const calories = Number(e.target.calories.value);
    try {
      await apiFetch("/activities", "POST", { type, calories });
      e.target.reset();
      loadActivities();
    } catch (err) {
      alert(err.message);
    }
  });
}

// -----------------------------
// Delete activity
// -----------------------------
window.deleteActivity = async (id) => {
  try {
    await apiFetch(`/activities/${id}`, "DELETE");
    loadActivities();
  } catch (err) {
    alert("Failed to delete activity");
  }
};

// -----------------------------
// Logout function
// -----------------------------
function setupLogout() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", () => {
    // Remove JWT token
    localStorage.removeItem("token");

    // Redirect to login page
    window.location.href = "login.html";
  });
}

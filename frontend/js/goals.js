import { apiFetch } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  loadGoals();
  setupLogout(); // initialize logout
});

// Load all goals
async function loadGoals() {
  const goals = await apiFetch("/goals");
  const list = document.getElementById("goalList");
  list.innerHTML = goals
    .map(
      (g) => `
      <li>
        <strong>${g.title}</strong> - ${g.description} 
        ${g.achieved ? "✅ Achieved" : `<button onclick="markAchieved('${g._id}')">Mark Achieved</button>`}
        <button onclick="deleteGoal('${g._id}')">❌ Delete</button>
      </li>`
    )
    .join("");
}

// Add goal
document.getElementById("goalForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = e.target.goalTitle.value;
  const description = e.target.goalDescription.value;

  await apiFetch("/goals", "POST", { title, description });
  e.target.reset();
  loadGoals();
});

// Mark goal as achieved
window.markAchieved = async (id) => {
  await apiFetch(`/goals/${id}/achieve`, "PATCH");
  loadGoals();
};

// Delete goal
window.deleteGoal = async (id) => {
  await apiFetch(`/goals/${id}`, "DELETE");
  loadGoals();
};

// -----------------------------
// Logout function
// -----------------------------
function setupLogout() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", () => {
    // Remove JWT token from localStorage
    localStorage.removeItem("token"); // adjust key if different

    // Redirect to login page
    window.location.href = "login.html";
  });
}

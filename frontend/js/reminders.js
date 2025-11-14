import { apiFetch } from "./api.js";

// Run when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  loadReminders();
  setupLogout(); // initialize logout button
});

// -----------------------------
// Load all reminders
// -----------------------------
async function loadReminders() {
  const data = await apiFetch("/reminders");
  const list = document.getElementById("reminderList");
  if (!list) return;
  
  list.innerHTML = data
    .map(
      (r) => `
      <li>
        ${r.title} - ${r.type} at ${new Date(r.time).toLocaleTimeString()} 
        ${r.done ? "✅" : `<button onclick="markDone('${r._id}')">Done</button>`}
        <button onclick="deleteReminder('${r._id}')">❌</button>
      </li>`
    )
    .join("");
}

// -----------------------------
// Add new reminder
// -----------------------------
const reminderForm = document.getElementById("reminderForm");
if (reminderForm) {
  reminderForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const type = e.target.type.value;
    const time = e.target.time.value;

    await apiFetch("/reminders", "POST", { title, type, time });
    e.target.reset();
    loadReminders();
  });
}

// -----------------------------
// Mark reminder as done
// -----------------------------
window.markDone = async (id) => {
  await apiFetch(`/reminders/${id}/done`, "PATCH");
  loadReminders();
};

// -----------------------------
// Delete reminder
// -----------------------------
window.deleteReminder = async (id) => {
  await apiFetch(`/reminders/${id}`, "DELETE");
  loadReminders();
};

// -----------------------------
// Logout function
// -----------------------------
function setupLogout() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", () => {
    // Remove JWT token from localStorage
    localStorage.removeItem("token");

    // Redirect to login page
    window.location.href = "login.html";
  });
}

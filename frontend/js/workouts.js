import { apiFetch } from "./api.js";

// Run when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  loadWorkouts();
  setupLogout(); // initialize logout button
});

// -----------------------------
// Load workouts
// -----------------------------
async function loadWorkouts() {
  const data = await apiFetch("/workouts");
  const list = document.getElementById("workoutList");
  if (!list) return;
  list.innerHTML = data
    .map(
      (w) => `
      <li>
        ${w.workoutType} - ${w.duration} mins (${w.caloriesBurned} kcal)
        <button onclick="deleteWorkout('${w._id}')">❌</button>
      </li>`
    )
    .join("");
}

// -----------------------------
// Add new workout
// -----------------------------
const workoutForm = document.getElementById("workoutForm");
if (workoutForm) {
  workoutForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const workoutType = e.target.workoutType.value;
    const duration = Number(e.target.duration.value);
    const caloriesBurned = Number(e.target.caloriesBurned.value);
    try {
      await apiFetch("/workouts", "POST", { workoutType, duration, caloriesBurned });
      e.target.reset();
      loadWorkouts();
    } catch (err) {
      console.error(err);
      alert("Failed to add workout");
    }
  });
}

// -----------------------------
// Delete workout
// -----------------------------
window.deleteWorkout = async (id) => {
  try {
    await apiFetch(`/workouts/${id}`, "DELETE");
    loadWorkouts();
  } catch (err) {
    console.error(err);
    alert("Failed to delete workout");
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

import { apiFetch } from "./api.js";

document.addEventListener("DOMContentLoaded", loadWorkouts);

async function loadWorkouts() {
  const data = await apiFetch("/workouts");
  const list = document.getElementById("workoutList");
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

document.getElementById("workoutForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const workoutType = e.target.workoutType.value;
  const duration = Number(e.target.duration.value);
  const caloriesBurned = Number(e.target.caloriesBurned.value);
  await apiFetch("/workouts", "POST", { workoutType, duration, caloriesBurned });
  e.target.reset();
  loadWorkouts();
});

window.deleteWorkout = async (id) => {
  await apiFetch(`/workouts/${id}`, "DELETE");
  loadWorkouts();
};

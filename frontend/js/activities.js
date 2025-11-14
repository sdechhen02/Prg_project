import { apiFetch } from "./api.js";

document.addEventListener("DOMContentLoaded", loadActivities);

async function loadActivities() {
  try {
    const data = await apiFetch("/activities");
    const list = document.getElementById("activityList");
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

document.getElementById("activityForm").addEventListener("submit", async (e) => {
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

window.deleteActivity = async (id) => {
  try {
    await apiFetch(`/activities/${id}`, "DELETE");
    loadActivities();
  } catch (err) {
    alert("Failed to delete activity");
  }
};

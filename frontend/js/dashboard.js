import { apiFetch, logout } from "./helpers.js";

document.addEventListener("DOMContentLoaded", () => {
  // Attach logout handler
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) logoutBtn.addEventListener("click", logout);

  // Load dashboard data
  loadDashboard();
});

async function loadDashboard() {
  try {
    const goals = await apiFetch("/goals");
    const workouts = await apiFetch("/workouts");
    const activities = await apiFetch("/activities");
    const meals = await apiFetch("/diet/meals");
    const waterLogs = await apiFetch("/diet/water");
    const reminders = await apiFetch("/reminders");

    // ---------------- Stats ----------------
    const achievedGoals = goals.filter(g => g.achieved).length;
    const pendingGoals = goals.length - achievedGoals;
    const totalCalories = workouts.reduce((a,b)=>a+Number(b.caloriesBurned||0),0) +
                          activities.reduce((a,b)=>a+Number(b.calories||0),0);

    document.getElementById("goalsStat").textContent = `Goals: ${goals.length}`;
    document.getElementById("achievedGoalsStat").textContent = `Achieved: ${achievedGoals}`;
    document.getElementById("pendingGoalsStat").textContent = `Pending: ${pendingGoals}`;
    document.getElementById("workoutsStat").textContent = `Workouts: ${workouts.length}`;
    document.getElementById("activitiesStat").textContent = `Activities: ${activities.length}`;
    document.getElementById("caloriesStat").textContent = `Calories Burned: ${totalCalories} kcal`;
    document.getElementById("mealsStat").textContent = `Meals: ${meals.length}`;
    document.getElementById("waterStat").textContent = `Water Logs: ${waterLogs.length}`;
    document.getElementById("remindersStat").textContent = `Reminders: ${reminders.length}`;

    // ---------------- Charts ----------------
    renderCharts(goals, workouts, activities, meals, waterLogs, reminders);

  } catch(err) {
    console.error(err);
    alert("Failed to load dashboard data");
  }
}

function renderCharts(goals, workouts, activities, meals, waterLogs, reminders) {
  // Goals chart
  const achievedGoals = goals.filter(g => g.achieved).length;
  const pendingGoals = goals.length - achievedGoals;
  new Chart(document.getElementById("goalsChart"), {
    type: "doughnut",
    data: { labels: ["Achieved", "Pending"], datasets: [{ data: [achievedGoals, pendingGoals], backgroundColor: ["#4CAF50", "#FF9800"] }] },
    options: { plugins: { title: { display: true, text: "Goals Progress" } } }
  });

  // Workouts chart
  new Chart(document.getElementById("workoutsChart"), {
    type: "bar",
    data: {
      labels: workouts.map(w => w.workoutType || "Workout"),
      datasets: [{ label: "Duration (mins)", data: workouts.map(w => Number(w.duration) || 0), backgroundColor: "#2196F3" }]
    },
    options: { plugins: { title: { display: true, text: "Workout Duration" } } }
  });

  // Activities chart
  new Chart(document.getElementById("activitiesChart"), {
    type: "bar",
    data: {
      labels: activities.map(a => a.type || "Activity"),
      datasets: [{ label: "Calories Burned", data: activities.map(a => Number(a.calories) || 0), backgroundColor: "#f44336" }]
    },
    options: { plugins: { title: { display: true, text: "Activities Calories" } } }
  });

  // Diet chart
  const mealCalories = meals.map(m => Number(m.calories) || 0);
  const waterAmount = waterLogs.map(w => Number(w.amount) || 0);
  new Chart(document.getElementById("dietChart"), {
    type: "line",
    data: {
      labels: [...meals.map(m => m.mealName), ...waterLogs.map((_,i)=>`Water ${i+1}`)],
      datasets: [
        { label: "Meal Calories", data: mealCalories, borderColor: "#FF9800", fill: false },
        { label: "Water Intake (ml)", data: waterAmount, borderColor: "#2196F3", fill: false }
      ]
    },
    options: { plugins: { title: { display: true, text: "Diet & Water Intake" } } }
  });

  // Reminders chart
  const types = ["goal","workout","meal","water"];
  const typeCounts = types.map(t => reminders.filter(r => r.type === t).length);
  new Chart(document.getElementById("remindersChart"), {
    type: "pie",
    data: { labels: ["Goal","Workout","Meal","Water"], datasets: [{ data: typeCounts, backgroundColor: ["#4CAF50","#2196F3","#FF9800","#9C27B0"] }] },
    options: { plugins: { title: { display: true, text: "Reminders Types" } } }
  });
}

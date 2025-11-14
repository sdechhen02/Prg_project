const API_BASE = "http://localhost:5000/api";

// ---------------- AUTH ----------------
async function signupUser(e) {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!name || !email || !password) return alert("Please fill all fields");

  try {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      alert("Signup successful!");
      window.location.href = "dashboard.html";
    } else {
      alert(data.message || "Signup failed");
    }
  } catch (err) {
    console.error(err);
    alert("Signup failed");
  }
}

async function loginUser(e) {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) return alert("Please fill both fields");

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      alert("Login successful!");
      window.location.href = "dashboard.html";
    } else {
      alert(data.message || "Login failed");
    }
  } catch (err) {
    console.error(err);
    alert("Login failed");
  }
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

// ---------------- HELPER ----------------
async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

// ---------------- GOALS ----------------
async function addGoal(e) {
  e.preventDefault();
  const title = document.getElementById("goalTitle")?.value?.trim();
  const description = document.getElementById("goalDescription")?.value?.trim();
  if (!title || !description) return alert("Please enter both title and description");

  try {
    await apiFetch("/goals", { method: "POST", body: JSON.stringify({ title, description }) });
    document.getElementById("goalForm")?.reset();
    fetchGoals();
  } catch (err) {
    alert(err.message);
  }
}

async function fetchGoals() {
  try {
    const goals = await apiFetch("/goals");
    const list = document.getElementById("goalList");
    list.innerHTML = goals.map(g => `
      <li>
        <strong>${g.title}</strong> - ${g.description}
        <button onclick="editGoal('${g._id}', '${g.title}', '${g.description}')">Edit</button>
        <button onclick="deleteGoal('${g._id}')">Delete</button>
      </li>
    `).join("");
  } catch (err) {
    console.error(err);
    document.getElementById("goalList").innerHTML = "<li>Failed to load goals</li>";
  }
}

async function deleteGoal(id) {
  if (!confirm("Are you sure you want to delete this goal?")) return;
  try {
    await apiFetch(`/goals/${id}`, { method: "DELETE" });
    fetchGoals();
  } catch (err) {
    alert(err.message);
  }
}

async function editGoal(id, oldTitle, oldDescription) {
  const title = prompt("Edit title:", oldTitle);
  const description = prompt("Edit description:", oldDescription);
  if (!title || !description) return;
  try {
    await apiFetch(`/goals/${id}`, { method: "PUT", body: JSON.stringify({ title, description }) });
    fetchGoals();
  } catch (err) {
    alert(err.message);
  }
}

// ---------------- WORKOUTS ----------------
async function addWorkout(e) {
  e.preventDefault();
  const workoutType = document.getElementById("workoutType")?.value?.trim();
  const duration = document.getElementById("duration")?.value?.trim();
  const caloriesBurned = document.getElementById("caloriesBurned")?.value?.trim();

  if (!workoutType || !duration || !caloriesBurned) return alert("Please fill all workout fields");

  try {
    await apiFetch("/workouts", { method: "POST", body: JSON.stringify({ workoutType, duration, caloriesBurned }) });
    loadWorkouts();
  } catch (err) {
    alert(err.message);
  }
}

async function loadWorkouts() {
  try {
    const workouts = await apiFetch("/workouts");
    const list = document.getElementById("workoutList");
    list.innerHTML = workouts.map(w => `
      <li>
        ${w.workoutType} - ${w.duration} mins (${w.caloriesBurned} kcal)
        <button onclick="editWorkout('${w._id}', '${w.workoutType}', '${w.duration}', '${w.caloriesBurned}')">Edit</button>
        <button onclick="deleteWorkout('${w._id}')">Delete</button>
      </li>
    `).join("");
  } catch (err) {
    console.error(err);
    document.getElementById("workoutList").innerHTML = "<li>Failed to load workouts</li>";
  }
}

async function deleteWorkout(id) {
  if (!confirm("Delete this workout?")) return;
  try {
    await apiFetch(`/workouts/${id}`, { method: "DELETE" });
    loadWorkouts();
  } catch (err) {
    alert(err.message);
  }
}

async function editWorkout(id, oldType, oldDuration, oldCalories) {
  const workoutType = prompt("Edit type:", oldType);
  const duration = prompt("Edit duration:", oldDuration);
  const caloriesBurned = prompt("Edit calories:", oldCalories);
  if (!workoutType || !duration || !caloriesBurned) return;
  try {
    await apiFetch(`/workouts/${id}`, { method: "PUT", body: JSON.stringify({ workoutType, duration, caloriesBurned }) });
    loadWorkouts();
  } catch (err) {
    alert(err.message);
  }
}

// ---------------- ACTIVITIES ----------------
async function addActivity(e) {
  e.preventDefault();
  const activityType = document.getElementById("activityType").value.trim();
  const calories = Number(document.getElementById("activityCalories").value);
  if (!activityType || !calories) return alert("Enter activity type & calories");

  try {
    await apiFetch("/activities", { method: "POST", body: JSON.stringify({ activityType, calories }) });
    fetchActivities();
    document.getElementById("activityForm").reset();
  } catch (err) {
    alert(err.message);
  }
}

async function fetchActivities() {
  try {
    const activities = await apiFetch("/activities");
    const list = document.getElementById("activityList");
    list.innerHTML = activities.map(a => `
      <li>
        ${a.activityType} - ${a.calories} cal
        <button onclick="editActivity('${a._id}', '${a.activityType}', '${a.calories}')">Edit</button>
        <button onclick="deleteActivity('${a._id}')">Delete</button>
      </li>
    `).join("");
  } catch (err) {
    console.error(err);
    document.getElementById("activityList").innerHTML = "<li>Failed to load activities</li>";
  }
}

async function editActivity(id, oldType, oldCalories) {
  const activityType = prompt("Edit activity type:", oldType);
  const calories = Number(prompt("Edit calories:", oldCalories));
  if (!activityType || !calories) return;

  try {
    await apiFetch(`/activities/${id}`, { method: "PUT", body: JSON.stringify({ activityType, calories }) });
    fetchActivities();
  } catch (err) {
    alert(err.message);
  }
}

async function deleteActivity(id) {
  if (!confirm("Delete this activity?")) return;
  try {
    await apiFetch(`/activities/${id}`, { method: "DELETE" });
    fetchActivities();
  } catch (err) {
    alert(err.message);
  }
}

// ---------------- DIET ----------------
async function addMeal(e) {
  e.preventDefault();
  const mealName = document.getElementById("meal-name")?.value?.trim();
  const calories = document.getElementById("mealCalories")?.value?.trim();

  if (!mealName || !calories) return alert("Please fill all meal fields");

  try {
    await apiFetch("/diet/meal", { method: "POST", body: JSON.stringify({ mealName, calories }) });
    document.getElementById("mealForm")?.reset();
    fetchMeals();
  } catch (err) {
    alert(err.message);
  }
}

async function fetchMeals() {
  try {
    const meals = await apiFetch("/diet/meals");
    const list = document.getElementById("meal-list");
    list.innerHTML = meals.map(m => `
      <li>
        ${m.mealName} - ${m.calories} cal
        <button onclick="editMeal('${m._id}', '${m.mealName}', '${m.calories}')">Edit</button>
        <button onclick="deleteMeal('${m._id}')">Delete</button>
      </li>
    `).join("");
  } catch (err) {
    console.error(err);
    document.getElementById("meal-list").innerHTML = "<li>Failed to load meals</li>";
  }
}

async function deleteMeal(id) {
  if (!confirm("Delete this meal?")) return;
  try {
    await apiFetch(`/diet/meal/${id}`, { method: "DELETE" });
    fetchMeals();
  } catch (err) {
    alert(err.message);
  }
}

async function editMeal(id, oldName, oldCalories) {
  const mealName = prompt("Edit meal name:", oldName);
  const calories = prompt("Edit calories:", oldCalories);
  if (!mealName || !calories) return;
  try {
    await apiFetch(`/diet/meal/${id}`, { method: "PUT", body: JSON.stringify({ mealName, calories }) });
    fetchMeals();
  } catch (err) {
    alert(err.message);
  }
}

// ---------------- WATER ----------------
async function addWater(e) {
  e.preventDefault();
  const amount = document.getElementById("water-amount")?.value?.trim();
  if (!amount) return alert("Please enter water amount");

  try {
    await apiFetch("/diet/water", { method: "POST", body: JSON.stringify({ amount }) });
    document.getElementById("waterForm")?.reset();
    fetchWater();
  } catch (err) {
    alert(err.message);
  }
}

async function fetchWater() {
  try {
    const waterLogs = await apiFetch("/diet/water");
    const list = document.getElementById("water-list");
    list.innerHTML = waterLogs.map(w => `
      <li>
        ${w.amount} ml
        <button onclick="editWater('${w._id}', '${w.amount}')">Edit</button>
        <button onclick="deleteWater('${w._id}')">Delete</button>
      </li>
    `).join("");
  } catch (err) {
    console.error(err);
    document.getElementById("water-list").innerHTML = "<li>Failed to load water logs</li>";
  }
}

async function deleteWater(id) {
  if (!confirm("Delete this water log?")) return;
  try {
    await apiFetch(`/diet/water/${id}`, { method: "DELETE" });
    fetchWater();
  } catch (err) {
    alert(err.message);
  }
}

async function editWater(id, oldAmount) {
  const amount = prompt("Edit water amount:", oldAmount);
  if (!amount) return;
  try {
    await apiFetch(`/diet/water/${id}`, { method: "PUT", body: JSON.stringify({ amount }) });
    fetchWater();
  } catch (err) {
    alert(err.message);
  }
}

// ---------------- INITIAL LOAD ----------------
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.endsWith("goal.html")) {
    fetchGoals();
    document.getElementById("goalForm")?.addEventListener("submit", addGoal);
  }
  if (window.location.pathname.endsWith("workout.html")) {
    loadWorkouts();
    document.getElementById("workoutForm")?.addEventListener("submit", addWorkout);
  }
  if (window.location.pathname.endsWith("activity.html")) {
    fetchActivities();
    document.getElementById("activityForm")?.addEventListener("submit", addActivity);
  }
  if (window.location.pathname.endsWith("diet.html")) {
    fetchMeals();
    fetchWater();
    document.getElementById("mealForm")?.addEventListener("submit", addMeal);
    document.getElementById("waterForm")?.addEventListener("submit", addWater);
  }
});


// ---------------- REMINDERS ----------------
async function addReminder(e) {
  e.preventDefault();
  const title = document.getElementById("reminderTitle")?.value?.trim();
  const time = document.getElementById("reminderTime")?.value;
  const type = document.getElementById("reminderType")?.value;

  if (!title || !time) return alert("Please enter reminder title and time");

  try {
    await apiFetch("/reminders", { method: "POST", body: JSON.stringify({ title, time, type }) });
    document.getElementById("reminderForm")?.reset();
    fetchReminders();
  } catch (err) {
    alert(err.message);
  }
}

async function fetchReminders() {
  try {
    const reminders = await apiFetch("/reminders");
    const list = document.getElementById("reminderList");
    list.innerHTML = reminders.map(r => {
      const date = new Date(r.time).toLocaleString();
      return `
        <li>
          <strong>${r.title}</strong> [${r.type}] - ${date}
          <button onclick="markReminderDone('${r._id}')">Mark Done</button>
          <button onclick="deleteReminder('${r._id}')">Delete</button>
        </li>`;
    }).join("");
  } catch (err) {
    console.error(err);
    document.getElementById("reminderList").innerHTML = "<li>Failed to load reminders</li>";
  }
}

async function markReminderDone(id) {
  try {
    await apiFetch(`/reminders/${id}/done`, { method: "PATCH" });
    fetchReminders();
  } catch (err) {
    alert(err.message);
  }
}

async function deleteReminder(id) {
  if (!confirm("Delete this reminder?")) return;
  try {
    await apiFetch(`/reminders/${id}`, { method: "DELETE" });
    fetchReminders();
  } catch (err) {
    alert(err.message);
  }
}

// ---------------- INITIAL LOAD ----------------
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.endsWith("reminder.html")) {
    fetchReminders();
    document.getElementById("reminderForm")?.addEventListener("submit", addReminder);
  }
});

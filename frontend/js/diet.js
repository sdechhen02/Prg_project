import { apiFetch } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  loadMeals();
  loadWater();
  setupLogout(); // initialize logout button
});

// ---------------- MEALS ----------------
async function loadMeals() {
  try {
    const meals = await apiFetch("/diet/meals");
    const list = document.getElementById("mealList");
    if (!list) return;
    list.innerHTML = meals
      .map(
        (m) => `<li>
          ${m.mealName} - ${m.calories} kcal 
          <button onclick="deleteMeal('${m._id}')">❌</button>
          <button onclick="editMeal('${m._id}', '${m.mealName}', ${m.calories})">✏️</button>
        </li>`
      )
      .join("");
  } catch (err) {
    console.error(err);
    alert("Failed to load meals");
  }
}

const mealForm = document.getElementById("mealForm");
if (mealForm) {
  const mealFormHandler = async (e) => {
    e.preventDefault();
    const mealName = e.target.mealName.value;
    const calories = Number(e.target.calories.value);
    try {
      await apiFetch("/diet/meals", "POST", { mealName, calories });
      e.target.reset();
      loadMeals();
    } catch (err) {
      console.error(err);
      alert("Failed to add meal");
    }
  };

  mealForm.addEventListener("submit", mealFormHandler);
  // Save default handler for editing
  mealForm.defaultHandler = mealFormHandler;
}

window.deleteMeal = async (id) => {
  try {
    await apiFetch(`/diet/meals/${id}`, "DELETE");
    loadMeals();
  } catch (err) {
    console.error(err);
    alert("Failed to delete meal");
  }
};

window.editMeal = (id, mealName, calories) => {
  const nameInput = document.getElementById("mealName");
  const calInput = document.getElementById("calories");
  nameInput.value = mealName;
  calInput.value = calories;

  const form = document.getElementById("mealForm");
  form.onsubmit = async (e) => {
    e.preventDefault();
    try {
      await apiFetch(`/diet/meals/${id}`, "PUT", {
        mealName: nameInput.value,
        calories: Number(calInput.value),
      });
      form.reset();
      form.onsubmit = form.defaultHandler; // restore default handler
      loadMeals();
    } catch (err) {
      console.error(err);
      alert("Failed to update meal");
    }
  };
};

// ---------------- WATER ----------------
async function loadWater() {
  try {
    const logs = await apiFetch("/diet/water");
    const list = document.getElementById("waterList");
    if (!list) return;
    list.innerHTML = logs
      .map((w) => `<li>${w.amount} ml at ${new Date(w.date).toLocaleString()}</li>`)
      .join("");
  } catch (err) {
    console.error(err);
    alert("Failed to load water logs");
  }
}

const waterForm = document.getElementById("waterForm");
if (waterForm) {
  waterForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const amount = Number(e.target.amount.value);
    try {
      await apiFetch("/diet/water", "POST", { amount, type: "water" });
      e.target.reset();
      loadWater();
    } catch (err) {
      console.error(err);
      alert("Failed to log water");
    }
  });
}

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

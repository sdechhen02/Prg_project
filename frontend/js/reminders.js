import { apiFetch } from "./api.js";

document.addEventListener("DOMContentLoaded", loadReminders);

async function loadReminders() {
  const data = await apiFetch("/reminders");
  const list = document.getElementById("reminderList");
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

document.getElementById("reminderForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = e.target.title.value;
  const type = e.target.type.value;
  const time = e.target.time.value;
  await apiFetch("/reminders", "POST", { title, type, time });
  e.target.reset();
  loadReminders();
});

window.markDone = async (id) => {
  await apiFetch(`/reminders/${id}/done`, "PATCH");
  loadReminders();
};

window.deleteReminder = async (id) => {
  await apiFetch(`/reminders/${id}`, "DELETE");
  loadReminders();
};

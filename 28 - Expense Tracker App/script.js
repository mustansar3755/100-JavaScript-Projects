const STORAGE_KEY = "ledger_entries_v1";
let currentType = "expense";
let currentFilter = "all";

// Get Elements From HTML

const form = document.getElementById("entryForm");
const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("entryDate");
const entriesList = document.getElementById("entriesList");
const btnExpense = document.getElementById("btnExpense");
const btnIncome = document.getElementById("btnIncome");

// Current-Date

dateInput.value = new Date().toISOString().split("T")[0];

document.getElementById("todayDate").textContent =
  new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

//   Get Entries From Local-Storage

function getEntries() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (e) {
    return [];
  }
}

// FN to save Entries

function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}
// Fn to set Type

function setType(type) {
  currentType = type;
  btnExpense.classList.toggle("active", type === "expense");
  btnIncome.classList.toggle("active", type === "income");
}
// Buttons Event-Listners

btnExpense.addEventListener("click", () => setType("expense"));
btnIncome.addEventListener("click", () => setType("income"));

document.querySelectorAll(".filters button").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".filters button")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    render()
  });
});
// Form Submit

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const entries = getEntries();
  entries.unshift({
    id: Date.now(),
    title: titleInput.value.trim(),
    amount: parseFloat(amountInput.value),
    category: categoryInput.value,
    type: currentType,
    date: dateInput.value,
  });
  saveEntries(entries);
  form.reset();
  dateInput.value = new Date().toISOString().split("T")[0];
  setType("expense");
    render()
});

// Delete Entry

function deleteEntry(id) {
  const entries = getEntries().filter((en) => en.id !== id);
  saveEntries(entries);
    render()
}
// Fn To formate Amount

function formatAmount(n) {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximunFractionDigits: 2,
  });
}

// Fn To formate Date

function formatDate(d) {
  const dt = new Date(d);
  return dt.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}

// Render Function

function render() {
  console.log("Running Render FN");
  const entries = getEntries();

  const income = entries
    .filter((e) => e.type === "income")
    .reduce((s, e) => s + e.amount, 0);
  const expense = entries
    .filter((e) => e.type === "expense")
    .reduce((s, e) => s + e.amount, 0);

  document.getElementById("totalIncome").textContent = formatAmount(income);
  document.getElementById("totalExpense").textContent = formatAmount(expense);
  document.getElementById("totalBalance").textContent = formatAmount(
    income - expense,
  );

  const filtered =
    currentFilter === "all"
      ? entries
      : entries.filter((e) => e.type === currentFilter);

  if (filtered.length === 0) {
    entriesList.innerHTML =
      '<div class="empty">No entries yet. Add your first one above.</div>';
      return;
  }

  entriesList.innerHTML = filtered
    .map(
      (en) => `<div class="entry">
        <div class="d">${formatDate(en.date)}</div>
        <div>
          ${escapeHtml(en.title)}
          <div class="cat">${escapeHtml(en.category)}</div>
        </div>
        <div class="amt ${en.type}">${en.type === "income" ? "+" : "-"}${formatAmount(en.amount)}</div>
        <button class="del" onclick="deleteEntry(${en.id})" aria-label="Delete entry">×</button>
      </div>`,
    )
    .join("");
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

render();

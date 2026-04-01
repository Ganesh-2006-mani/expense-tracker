const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const categoryEl = document.getElementById("category");

const list = document.getElementById("list");

const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");

let chart;

// LOAD DATA
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

init();

function init() {
  list.innerHTML = "";
  transactions.forEach(addTransactionDOM);
  updateValues();
}

// ADD TRANSACTION
form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (text.value.trim() === "" || amount.value.trim() === "") {
    alert("Enter all fields");
    return;
  }

  const transaction = {
    id: Date.now(),
    text: text.value,
    amount: +amount.value,
    category: categoryEl.value
  };

  transactions.push(transaction);

  addTransactionDOM(transaction);
  updateValues();
  updateLocalStorage();

  text.value = "";
  amount.value = "";
});

// ADD TO DOM
function addTransactionDOM(t) {
  const li = document.createElement("li");
  li.classList.add(t.amount < 0 ? "minus" : "plus");

  li.innerHTML = `
    ${t.text} (${t.category})
    <span>${t.amount < 0 ? "-" : "+"}₹${Math.abs(t.amount)}</span>
    <button onclick="removeTransaction(${t.id})">x</button>
  `;

  list.appendChild(li);
}

// UPDATE VALUES
function updateValues() {
  const amounts = transactions.map(t => t.amount);

  const total = amounts.reduce((a, b) => a + b, 0);
  const inc = amounts.filter(a => a > 0).reduce((a, b) => a + b, 0);
  const exp = amounts.filter(a => a < 0).reduce((a, b) => a + b, 0) * -1;

  balance.innerText = `₹${total}`;
  income.innerText = `₹${inc}`;
  expense.innerText = `₹${exp}`;

  updateCategoryChart();
}

// DELETE
function removeTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateLocalStorage();
  init();
}

// SAVE
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// CATEGORY CHART
function updateCategoryChart() {
  const map = {};

  transactions.forEach(t => {
    if (t.amount < 0) {
      if (!map[t.category]) map[t.category] = 0;
      map[t.category] += Math.abs(t.amount);
    }
  });

  const labels = Object.keys(map);
  const data = Object.values(map);

  const ctx = document.getElementById("chart");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: [
          "#ef4444",
          "#3b82f6",
          "#22c55e",
          "#f59e0b",
          "#a855f7"
        ]
      }]
    }
  });
}

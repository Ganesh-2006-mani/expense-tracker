const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");

const list = document.getElementById("list");

const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");

// LOAD DATA
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

init();

function init() {
  list.innerHTML = "";
  transactions.forEach(addTransactionDOM);
  updateValues();
}

// ADD
form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (text.value.trim() === "" || amount.value.trim() === "") {
    alert("Enter all fields");
    return;
  }

  const transaction = {
    id: Date.now(),
    text: text.value,
    amount: +amount.value
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
    ${t.text}
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

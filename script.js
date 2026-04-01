// ELEMENTS
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const list = document.getElementById("list");

const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");

// 🔥 LOAD FROM LOCALSTORAGE
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// INIT
init();

function init() {
  list.innerHTML = "";
  transactions.forEach(addTransactionDOM);
  updateValues();
}

// ADD TRANSACTION
form.addEventListener("submit", function(e) {
  e.preventDefault();

  if (text.value.trim() === "" || amount.value.trim() === "") {
    alert("Enter description and amount");
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
function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? "-" : "+";

  const li = document.createElement("li");
  li.classList.add(transaction.amount < 0 ? "minus" : "plus");

  li.innerHTML = `
    ${transaction.text} 
    <span>${sign}₹${Math.abs(transaction.amount)}</span>
    <button onclick="removeTransaction(${transaction.id})">x</button>
  `;

  list.appendChild(li);
}

// UPDATE BALANCE
function updateValues() {
  const amounts = transactions.map(t => t.amount);

  const total = amounts.reduce((acc, val) => acc + val, 0).toFixed(2);

  const inc = amounts
    .filter(val => val > 0)
    .reduce((acc, val) => acc + val, 0)
    .toFixed(2);

  const exp = (
    amounts
      .filter(val => val < 0)
      .reduce((acc, val) => acc + val, 0) * -1
  ).toFixed(2);

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

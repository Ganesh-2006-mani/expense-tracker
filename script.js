const form = document.getElementById("expenseForm");
const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const typeSelect = document.getElementById("type");
const list = document.getElementById("list");

const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const balanceEl = document.getElementById("balance");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

form.addEventListener("submit", function (e) {
  e.preventDefault();
  addTransaction();
});

function addTransaction() {
  const title = titleInput.value.trim();
  const amount = amountInput.value.trim();
  const type = typeSelect.value;

  if (title === "" || amount === "") {
    alert("Enter title and amount");
    return;
  }

  const transaction = {
    title,
    amount: Number(amount),
    type
  };

  transactions.push(transaction);
  saveData();
  updateUI();

  titleInput.value = "";
  amountInput.value = "";
}

function updateUI() {
  list.innerHTML = "";

  let income = 0;
  let expense = 0;

  transactions.forEach((t, index) => {
    const li = document.createElement("li");
    li.classList.add(t.type);

    li.innerHTML = `
      ${t.title} - ₹${t.amount}
      <button class="delete-btn" onclick="deleteTransaction(${index})">X</button>
    `;

    list.appendChild(li);

    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  });

  incomeEl.innerText = income;
  expenseEl.innerText = expense;
  balanceEl.innerText = income - expense;
}

function deleteTransaction(index) {
  transactions.splice(index, 1);
  saveData();
  updateUI();
}

function saveData() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

updateUI();

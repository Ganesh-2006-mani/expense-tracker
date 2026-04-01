const form = document.getElementById("expenseForm");
const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const typeSelect = document.getElementById("type");
const list = document.getElementById("list");

const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const balanceEl = document.getElementById("balance");

const canvas = document.getElementById("chart");
const ctx = canvas.getContext("2d");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let editIndex = -1;

form.addEventListener("submit", function (e) {
  e.preventDefault();
  addOrUpdateTransaction();
});

function addOrUpdateTransaction() {
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

  if (editIndex === -1) {
    transactions.push(transaction);
  } else {
    transactions[editIndex] = transaction;
    editIndex = -1;
  }

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
      <span class="btns">
        <button class="edit-btn" onclick="editTransaction(${index})">Edit</button>
        <button class="delete-btn" onclick="deleteTransaction(${index})">X</button>
      </span>
    `;

    list.appendChild(li);

    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  });

  incomeEl.innerText = income;
  expenseEl.innerText = expense;
  balanceEl.innerText = income - expense;

  drawChart(income, expense);
}

function editTransaction(index) {
  const t = transactions[index];
  titleInput.value = t.title;
  amountInput.value = t.amount;
  typeSelect.value = t.type;
  editIndex = index;
}

function deleteTransaction(index) {
  transactions.splice(index, 1);
  saveData();
  updateUI();
}

function saveData() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function drawChart(income, expense) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const total = income + expense;
  if (total === 0) return;

  const incomeAngle = (income / total) * Math.PI * 2;

  // Income slice
  ctx.beginPath();
  ctx.moveTo(150, 100);
  ctx.fillStyle = "#2ecc71";
  ctx.arc(150, 100, 80, 0, incomeAngle);
  ctx.fill();

  // Expense slice
  ctx.beginPath();
  ctx.moveTo(150, 100);
  ctx.fillStyle = "#e74c3c";
  ctx.arc(150, 100, 80, incomeAngle, Math.PI * 2);
  ctx.fill();
}

updateUI();

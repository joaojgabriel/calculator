const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;

let displayValue = "";
const display = document.querySelector("#display");

function operate(a, operator, b) {
  return;
}

const numberKeys = document.querySelectorAll(".number");

[...numberKeys].forEach((number) =>
  number.addEventListener("click", (e) => populateDisplay(e.target.textContent))
);



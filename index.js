const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;

let a;
let operator;
let b;

let displayValue = "";
const display = document.querySelector("#display");

function operate(a, operator, b) {
  switch (operator) {
    case "+":
      return add(a, b);
    case "-":
      return subtract(a, b);
    case "*":
      return multiply(a, b);
    case "/":
      return divide(a, b);
    default:
      console.warning("Invalid operator " + operator);
  }
}

const numberKeys = document.querySelectorAll(".number");

[...numberKeys].forEach((number) =>
  number.addEventListener("click", (e) => populateDisplay(e.target.textContent))
);

function populateDisplay(value) {
  displayValue += value;
  display.textContent = displayValue;
}

const functionBtns = document.querySelectorAll(".function");

[...functionBtns].forEach((button) =>
  button.addEventListener("click", handleFunction)
);

function handleFunction(e) {
  if (!displayValue) return;

  let button = e.target.textContent;
  if (button === "AC") {
    displayValue = "";
    a = null;
    b = null;
    return;
  }

  a ? (b = +displayValue) : (a = +displayValue);
  displayValue = "";

  if (button === "=") {
    displayValue = operate(a, operator, b);
    a = null;
    b = null;
    operator = null;
  } else {
    operator = button;
  }
}

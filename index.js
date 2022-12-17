const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;

let a;
let operator;
let b;
let isOperatorSelected = false;
let isOperatorActive = false;

const display = document.querySelector("#display");
let numberOnDisplay;

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
      console.warn("Invalid operator " + operator);
  }
}

const digitKeys = document.querySelectorAll(".digit");

[...digitKeys].forEach((digit) =>
  digit.addEventListener("click", addDigitToDisplay)
);

function addDigitToDisplay(e) {
  isOperatorSelected = false;
  let digit = e.target.textContent;
  display.textContent += digit;
  numberOnDisplay = +display.textContent;

  a && operator ? (b = numberOnDisplay) : (a = numberOnDisplay);
}

const functionBtns = document.querySelectorAll(".function");

[...functionBtns].forEach((button) =>
  button.addEventListener("click", handleFunction)
);

function handleFunction(e) {
  let thisFunction = e.target.textContent;
  display.textContent = "";

  if (thisFunction === "AC") {
    a = null;
    operator = null;
    b = null;
    isOperatorSelected = false;
    numberOnDisplay = null;
  }

  if (!numberOnDisplay) return;

  if (thisFunction === "=") {
    if (!b || !operator || isOperatorSelected) return;

    let result = operate(a, operator, b);
    display.textContent = result;
    if (result !== "ERROR") {
      numberOnDisplay = +display.textContent;
      a = numberOnDisplay;
      isOperatorActive = false;
    }
  } else {
    a = numberOnDisplay;
    numberOnDisplay = null;
    operator = thisFunction;
    b = null;
    isOperatorSelected = true;
    isOperatorActive = true;
  }
}

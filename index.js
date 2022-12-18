const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;

const display = document.querySelector("#display");
const digits = document.querySelectorAll(".digit");
const functionalButtons = document.querySelectorAll(".function");

let firstOperand;
let preOperator;
let operator;
let secondOperand;
let repeatedOperand;
let currentNumber;

[...digits].forEach((digit) =>
  digit.addEventListener("click", (e) => addDigit(e.target.textContent))
);

[...functionalButtons].forEach((functionalButton) =>
  functionalButton.addEventListener("click", (e) => handleLogic(e.target.id))
);

function handleLogic(functionality) {
  if (functionality === "clear") resetCalculator();
  else if (functionality === "equals") runEquals();
  else runOperator(functionality);
}

function resetCalculator() {
  firstOperand = null;
  operator = null;
  secondOperand = null;
  currentNumber = null;
  display.textContent = "";
}

function runOperator(chosenOperator) {
  if (!(currentNumber ?? true) && currentNumber !== 0) return;
  if (operator) runEquals();
  preOperator = chosenOperator;
  firstOperand = currentNumber;
  currentNumber = null;
}

function runEquals() {
  let result;

  if (secondOperand !== null && secondOperand !== undefined) {
    if (secondOperand === 0 && operator === "divide") {
      resetCalculator();
      display.textContent = "ERROR";
      return;
    }
    result = operate(firstOperand, operator, secondOperand);
    repeatedOperand = secondOperand;
    secondOperand = null;
  } else {
    result = operate(firstOperand, operator, repeatedOperand);
  }
  firstOperand = result;
  display.textContent = result;
  storeNumber();
}

function addDigit(digit) {
  if (!!preOperator || display.textContent === "ERROR") {
    display.textContent = digit;
  } else {
    display.textContent += digit;
  }
  storeNumber();
}

function storeNumber() {
  currentNumber = +display.textContent;
  isAfterOperator()
    ? (secondOperand = currentNumber)
    : (firstOperand = currentNumber);
}

function isAfterOperator() {
  if (preOperator) {
    operator = preOperator;
    preOperator = null;
    return true;
  }
  return false;
}

function operate(a, operator, b) {
  switch (operator) {
    case "add":
      return add(a, b);
    case "subtract":
      return subtract(a, b);
    case "multiply":
      return multiply(a, b);
    case "divide":
      return divide(a, b);
    default:
      console.warn(`Invalid operator ${operator}`);
  }
}

function displayError() {
  display.textContent = "ERROR";
}

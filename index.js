const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;

const display = document.querySelector("#display");
const digits = document.querySelectorAll(".digit");

[...digits].forEach((digit) =>
  digit.addEventListener("click", (e) => addDigit(e.target.textContent))
);

function addDigit(digit) {
  isNewNumber()
    ? (display.textContent = digit)
    : (display.textContent += digit);
}

function isNewNumber() {
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
      return b === 0 ? displayError() : divide(a, b);
    default:
      console.warn(`Invalid operator ${operator}`);
  }
}

function displayError() {
  display.textContent = "ERROR";
}

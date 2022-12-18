const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;

const display = document.querySelector("#display");
const digitBtns = document.querySelectorAll(".digit");

let currentNumber;
let a;
let preOperator;
let operator;
let b;
let displayingError = false;

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
  }
}
[...digitBtns].forEach((digit) =>
  digit.addEventListener("click", (e) => addDigit(e.target.textContent))
);

function addDigit(digit) {
  setOperatorLogic();
  if (!a || (a && !b) || displayingError) {
    display.textContent = "";
  }
  display.textContent += digit;
  currentNumber = display.textContent;
  setOperandLogic();
}

function setOperatorLogic() {
  if (preOperator) {
    operator = preOperator;
    preOperator = null;
  }
}

function setOperandLogic() {
  a & operator ? (b = currentNumber) : (a = currentNumber);
}

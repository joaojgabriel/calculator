const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;

const display = document.querySelector("#display");
const digitBtns = document.querySelectorAll(".digit");
const functionalBtns = document.querySelectorAll(".function");

let currentNumber;
let firstOperand;
let preOperator;
let operator;
let secondOperand;
let repeatedOperand;

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
  if (!currentNumber) {
    display.textContent = "";
  }
  display.textContent += digit;
  currentNumber = +display.textContent;
  assignToOperand(currentNumber);
}

function setOperatorLogic() {
  if (preOperator) {
    currentNumber = null;
    operator = preOperator;
    preOperator = null;
  }
}

function assignToOperand(number) {
  (firstOperand ?? false) && operator
    ? (secondOperand = number)
    : (firstOperand = number);
}

[...functionalBtns].forEach((functionalBtn) =>
  functionalBtn.addEventListener("click", (e) => runFunction(e.target.id))
);

function runFunction(functionChosen) {
  switch (functionChosen) {
    case "clear":
      resetCalculator();
      break;
    case "equals":
      runEquals();
      break;
    default:
      runOperator(functionChosen);
  }
}

function resetCalculator() {
  firstOperand = null;
  preOperator = null;
  operator = null;
  secondOperand = null;
  repeatedOperand = null;
  currentNumber = null;
  display.textContent = "";
}

function runEquals() {
  if (!operator) return;

  if (operator === "divide" && currentNumber === 0) {
    resetCalculator();
    display.textContent = "ERROR";
    return;
  }

  let result;

  if (secondOperand ?? false) {
    result = operate(firstOperand, operator, secondOperand);
    repeatedOperand = secondOperand;
    secondOperand = null;
  } else {
    result = operate(firstOperand, operator, repeatedOperand);
  }

  firstOperand = result;
  currentNumber = firstOperand;
  display.textContent = currentNumber;
}

function runOperator(selectedOperator) {
  if (secondOperand) runEquals();
  preOperator = selectedOperator;
  firstOperand = currentNumber;
}

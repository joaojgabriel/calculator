const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;

const display = document.querySelector("#display");
const digitBtns = document.querySelectorAll(".digit");
const functionalBtns = document.querySelectorAll(".function");

let firstOperand = 0;
let preOperator = "add";
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
  if (preOperator) {
    display.textContent = "";
    setOperator();
  }
  display.textContent += digit;
  assignToOperand(+display.textContent);
}

function setOperator() {
  operator = preOperator;
  preOperator = null;
}

function assignToOperand(number) {
  operator ? (secondOperand = number) : (firstOperand = number);
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
  display.textContent = "";
}

function runEquals() {
  if (!operator) return;

  if (isError(operator === "divide" && secondOperand === 0)) return;

  let result;

  if (secondOperand ?? false) {
    result = operate(firstOperand, operator, secondOperand);
    repeatedOperand = secondOperand;
    secondOperand = null;
  } else {
    result = operate(firstOperand, operator, repeatedOperand);
  }

  if (isError(!result.isFinite())) return;

  firstOperand = result;
  display.textContent = firstOperand;
}

function isError(condition) {
  if (condition) {
    resetCalculator();
    display.textContent = "ERROR";
    return true;
  }
  return false;
}

function runOperator(selectedOperator) {
  if (secondOperand ?? false) runEquals();
  !firstOperand && selectedOperator !== "subtract"
    ? (preOperator = "add")
    : (preOperator = selectedOperator);
}

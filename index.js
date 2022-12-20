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
let secondOperand = 0;
let repeatedOperand;
let decimalPoint = false;
let isNewNumber = true;

function operateIntegers(a, operator, b) {
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

function operateFloats(a, operator, b) {}

[...digitBtns].forEach((digit) =>
  digit.addEventListener("click", (e) => addDigit(e.target.textContent))
);

function addDigit(digit) {
  if (isNewNumber) {
    display.textContent = "";
    startNewNumber();
  }
  display.textContent += digit;
  assignToOperand(+display.textContent);
}

function startNewNumber() {
  operator = preOperator;
  preOperator = null;
  isNewNumber = false;
  decimalPoint = false;
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
    case "dot":
      runDecimalPoint();
      break;
    default:
      runOperator(functionChosen);
  }
}

function resetCalculator() {
  firstOperand = 0;
  preOperator = "add";
  operator = null;
  secondOperand = 0;
  repeatedOperand = null;
  decimalPoint = false;
  isNewNumber = true;
  display.textContent = "";
}

function runEquals() {
  if (!operator) return;

  if (isError(operator === "divide" && secondOperand === 0)) return;

  let result;

  if (secondOperand ?? false) {
    Number.isInteger(firstOperand) && Number.isInteger(secondOperand)
      ? (result = operateIntegers(firstOperand, operator, secondOperand))
      : (result = operateFloats(firstOperand, operator, secondOperand));

    repeatedOperand = secondOperand;
    secondOperand = null;
  } else {
    Number.isInteger(firstOperand) && Number.isInteger(repeatedOperand)
      ? (result = operateIntegers(firstOperand, operator, repeatedOperand))
      : (result = operateFloats(firstOperand, operator, repeatedOperand));
  }

  if (isError(!Number.isFinite(result))) return;

  firstOperand = result;
  display.textContent = formatResult(result);
}

function getNumberOfDecimals(number) {
  numberString = number.toString();
  if (!numberString.includes(".")) return 0;
  return +numberString.split(".")[1].length;
}

function formatResult(result) {
  let resultString = result.toString();
  let resultLength = resultString.length;

  if (resultLength > 7) {
    result = +result.toPrecision(7);
  }

  if (!Number.isInteger(result)) {
    let decimalPlaces = getNumberOfDecimals(resultString);
    if (decimalPlaces > 6) {
      result = result.toFixed(6);
    }
  }

  return result;
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
  isNewNumber = true;
}

function runDecimalPoint() {
  if (decimalPoint & !isNewNumber) return;
  if (isNewNumber) {
    display.textContent = "0";
    isNewNumber = false;
  }
  display.textContent += ".";
  decimalPoint = true;
}

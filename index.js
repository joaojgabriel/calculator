const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;

const display = document.querySelector("#display");
const output = document.querySelector("#output");
const digitBtns = document.querySelectorAll(".digit");
const functionalBtns = document.querySelectorAll(".function");

let firstOperand = 0;
let preOperator = "add";
let operator;
let secondOperand = 0;
let repeatedOperand;
let decimalPoint = false;
let isNewNumber = true;

addEventListener("keydown", (e) => {
  if (e.key === "/" || e.key === "Backspace") e.preventDefault();
});
addEventListener("keyup", handleKey);

function handleKey(e) {
  if (Number.isInteger(+e.key)) addDigit(e.key);
  switch (e.key) {
    case "Delete":
      runFunction("clear");
      break;
    case "/":
      runFunction("divide");
      break;
    case "*":
      runFunction("multiply");
      break;
    case "-":
      runFunction("subtract");
      break;
    case "Backspace":
      runFunction("backspace");
      break;
    case "+":
      runFunction("add");
      break;
    case ".":
      runFunction("dot");
      break;
    case "Enter":
      runFunction("equals");
      break;
    case ",":
      runFunction("dot");
      break;
    case "Escape":
      runFunction("clear");
      break;
  }
}

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

function operateFloats(a, operator, b) {
  if (a === 0 || b === 0) {
    return operateIntegers(a, operator, b);
  }

  let aDecimals = getNumberOfDecimals(a);
  let bDecimals = getNumberOfDecimals(b);
  let decimalOffset;

  if (operator === "multiply") {
    let sumOfDecimals = aDecimals + bDecimals;
    decimalOffset = Math.pow(10, sumOfDecimals);

    let aDecimalOffset = Math.pow(10, aDecimals);
    let bDecimalOffset = Math.pow(10, bDecimals);
    a *= aDecimalOffset;
    b *= bDecimalOffset;
  } else {
    let maxDecimals = Math.max(aDecimals, bDecimals);
    decimalOffset = Math.pow(10, maxDecimals);

    a *= decimalOffset;
    b *= decimalOffset;
  }

  switch (operator) {
    case "add":
      a = add(a, b);
      break;
    case "subtract":
      a = subtract(a, b);
      break;
    case "multiply":
      a = multiply(a, b);
  }

  if (!(operator === "divide")) {
    b = decimalOffset;
  }
  return divide(a, b);
}

[...digitBtns].forEach((digit) =>
  digit.addEventListener("click", (e) => addDigit(e.target.textContent))
);

function addDigit(digit) {
  if (!(secondOperand ?? false) & !preOperator)
    // After running equals
    return;
  if (isNewNumber) {
    output.textContent = "";
    startNewNumber();
  }
  output.textContent += digit;
  assignToOperand(+output.textContent);
}

function removeDigit() {
  if (!(secondOperand ?? false) & !preOperator)
    // After running equals
    return;
  if (output.textContent === "") return;
  if (output.textContent[output.textContent.length - 1] === ".") {
    decimalPoint = false;
  }
  output.textContent = output.textContent.slice(0, -1);
  assignToOperand(+output.textContent);
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
    case "backspace":
      removeDigit();
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
  output.textContent = "";
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
  isNewNumber = true;
  removeHighlight();
  output.textContent = formatResult(result);
  isError(isOverflowing());
}

function isOverflowing() {
  return (
    +document.defaultView.getComputedStyle(output).width.slice(0, -2) +
      +document.defaultView
        .getComputedStyle(display)
        ["padding-left"].slice(0, -2) >
    +document.defaultView.getComputedStyle(display).width.slice(0, -2)
  );
}

function getNumberOfDecimals(number) {
  numberString = number.toString();
  if (!numberString.includes(".")) return 0;
  return +numberString.split(".")[1].length;
}

function formatResult(result) {
  let resultString = result.toString();
  let resultLength = resultString.length;
  if (resultLength > 11) {
    result = result.toExponential(2);
  }

  return result;
}

function isError(condition) {
  if (condition) {
    resetCalculator();
    output.textContent = "ERROR";
    return true;
  }
  return false;
}

function runOperator(selectedOperator) {
  if (secondOperand ?? false) runEquals();
  !firstOperand & (selectedOperator !== "subtract")
    ? (preOperator = "add")
    : (preOperator = selectedOperator);
  highlightPreOperator(preOperator);
  isNewNumber = true;
}

function highlightPreOperator(preOperator) {
  removeHighlight();

  document.querySelector(`#${preOperator}`).classList.add("active-operator");
}

function removeHighlight() {
  document.querySelector("#add").classList.remove("active-operator");
  document.querySelector("#subtract").classList.remove("active-operator");
  document.querySelector("#multiply").classList.remove("active-operator");
  document.querySelector("#divide").classList.remove("active-operator");
}

function runDecimalPoint() {
  if (decimalPoint & !isNewNumber) return;
  if (isNewNumber) {
    output.textContent = "0";
    isNewNumber = false;
  }
  output.textContent += ".";
  decimalPoint = true;
}

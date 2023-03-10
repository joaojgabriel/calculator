const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;

const display = document.querySelector("#display");
const output = document.querySelector("#output");
const digitBtns = document.querySelectorAll(".digit");
const functionalBtns = document.querySelectorAll(".function");

let firstOperand;
let preOperator;
let operator;
let secondOperand;
let decimalPoint = false;
let nextDigitStartsNum = true;

addEventListener("keydown", (e) => {
  if (
    e.key === "/" ||
    e.key === "Backspace" ||
    e.key === "F5" ||
    e.key === "Enter"
  )
    e.preventDefault();
});
addEventListener("keyup", handleKey);

function handleKey(e) {
  if (Number.isInteger(+e.key)) addDigit(e.key);
  switch (e.key) {
    case "Delete":
      runFunction("clear");
      break;
    case "F5":
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

  if (operator !== divide) {
    b = decimalOffset;
  }
  return divide(a, b);
}

[...digitBtns].forEach((digit) =>
  digit.addEventListener("click", (e) => addDigit(e.target.textContent))
);

function addDigit(digit) {
  if (!firstOperand && firstOperand !== 0) {
    isNegative = preOperator === "subtract";
    resetCalculator();
    nextDigitStartsNum = false;
    if (isNegative) output.textContent = "-";
  }
  if (nextDigitStartsNum) {
    output.textContent = "";
    nextDigitStartsNum = false;
    decimalPoint = false;
    commitOperator();
  }
  output.textContent += digit;
  assignToOperand(+output.textContent);
}

function removeDigit() {
  let displayedText = output.textContent;
  if (displayedText === "") return;
  if (displayedText[displayedText.length - 1] === ".") {
    decimalPoint = false;
  }
  output.textContent = displayedText.slice(0, -1);
  assignToOperand(+output.textContent);
}

function commitOperator() {
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
  firstOperand = null;
  preOperator = null;
  operator = null;
  secondOperand = null;
  decimalPoint = false;
  nextDigitStartsNum = true;
  removeHighlight();
  output.textContent = "";
}

function runEquals() {
  if (!operator || isError(operator === "divide" && secondOperand === 0)) {
    return;
  }

  let result;

  if (secondOperand || secondOperand === 0) {
    if (Number.isInteger(firstOperand) && Number.isInteger(secondOperand)) {
      result = operateIntegers(firstOperand, operator, secondOperand);
    } else {
      result = operateFloats(firstOperand, operator, secondOperand);
    }

    secondOperand = null;
  } else {
    return;
  }

  if (isError(!Number.isFinite(result))) return;

  firstOperand = result;
  nextDigitStartsNum = true;
  removeHighlight();
  output.textContent = formatResult(result);
  isError(isOverflowing());
}

function isOverflowing() {
  let outputWidth = +document.defaultView
    .getComputedStyle(output)
    .width.slice(0, -2);

  let outputToDisplay = +document.defaultView
    .getComputedStyle(display)
    ["padding-left"].slice(0, -2);

  let displayWidth = +document.defaultView
    .getComputedStyle(display)
    .width.slice(0, -2);

  return outputWidth + outputToDisplay > displayWidth;
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
  if (secondOperand || secondOperand === 0) runEquals();
  preOperator = selectedOperator;
  highlightPreOperator(preOperator);
  nextDigitStartsNum = true;
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
  if (decimalPoint & !nextDigitStartsNum) return;

  decimalPoint = true;

  if (nextDigitStartsNum) {
    // if after equals, reset
    if (operator) resetCalculator();
    output.textContent = "0";
    nextDigitStartsNum = false;
    commitOperator();
    assignToOperand(0);
  }
  output.textContent += ".";
  decimalPoint = true;
}

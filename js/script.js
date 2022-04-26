let displayInput = document.querySelector('.input-control'),
    displayOutput = document.querySelector('.input-result'),
    myKeyboard = document.querySelector('.keyboard');

let expression = "",
    token = [];

myKeyboard.addEventListener("click", function (event) {
    let target = event.target;
    if (target.classList.contains("clear")) {
        token.splice(0, token.length);
        expression = "";
        displayInput.value = "";
        displayOutput.value = "";
    } else if (target.classList.contains("complete")) {
        token.splice(0, token.length);
        let answer = eval(expression).toString();
        token.push(answer);
        //to do checked value 
        expression = answer;
        displayOutput.value = displayInput.value + " = " + answer;
        displayInput.value = answer;
    } else if (target.classList.contains("key-value")) {
        if (!isFinite(target.innerText) && target.innerText != '.' || token.length == 0) {
            token.push(target.innerText);
        } else if (isFinite(target.innerText) && !isFinite(token[token.length - 1])) {
            token.push(target.innerText);
        } else {
            token[token.length - 1] += target.innerText;
        }
        expression += target.innerText;
        displayInput.value += target.innerText;
    } else if (target.classList.contains("key-const")) {
        let value = `Math.${target.dataset.fnc}`;
        token.push(value);
        expression += value;
        displayInput.value += target.innerText;
    } else if (target.classList.contains("key-function")) {
        let length = token.length;
        let value = `Math.${target.dataset.fnc}`;
        if (length == 1 && isFinite(token[length - 1])) {
            token = [value, '(', token[0], ')'];
            expression = value + '(' + expression + ')';
            displayInput.value = target.innerText + '(' + displayInput.value + ')';
        } else if (token[length - 1] != '(' && length > 0 && token[length - 1] != '+' &&
            token[length - 1] != '-' && token[length - 1] != '*' && token[length - 1] != '/') {
            token.push('*', value, '(');
            expression += '*' + value + '(';
            displayInput.value += '*' + target.innerText + '(';
        } else {
            token.push(value, '(');
            expression += value + '(';
            displayInput.value += target.innerText + '(';
        }
    } else if (target.classList.contains("key-power")) {
        token.push("**");
        expression += "**";
        displayInput.value += "^";
    } else if (target.classList.contains("key-hyperbole")) {
        token = ['1', '/', '(', ...token, ')'];
        expression = "1/(" + expression + ')';
        displayInput.value = "1/(" + displayInput.value + ')';
    } else if (target.classList.contains("key-factorial")) {
        let lastToken = token[token.length - 1];
        if (isFinite(lastToken)) {
            expression = expression.substr(0, expression.length - lastToken.length);
            expression += `fact(${lastToken})`;
        } else if (lastToken == ")") {
            let opend = 0,
                closed = 0,
                index = token.length - 1,
                start = expression.length;
            do {
                let value = token[index];

                if (value == "(") {
                    opend += 1;
                }
                if (value == ")") {
                    closed += 1;
                }
                index -= 1;
                start -= value.length;
            } while (opend != closed);
            if (token[index] != '+' &&
                token[index] != '-' && token[index] != '*' && token[index] != '/') {
                start -= token[index].length + 1;
            }
            let exp = expression.slice(start + 1, expression.length);
            expression = expression.substr(0, expression.length - exp.length);
            expression += `fact(${exp})`;
        }
        displayInput.value += "!";
    } else if (target.classList.contains("key-plusm")) {
        if (expression.length != 0) {
            if (token.length == 1 && isFinite(token[0]) && token[0] < 0) {
                token[0] = token[0].slice(1, token[0].length);
                expression = expression.slice(1, expression.length);
                displayInput.value = displayInput.value.slice(1, displayInput.value.length);
            } else if (token.length == 1 && isFinite(token[0]) && expression[0] != '-' && token[0] > 0) {
                token.unshift('-');
                expression = "-" + expression;
                displayInput.value = "-" + displayInput.value;
            } else if (token.length == 2 && isFinite(token[1]) && expression[0] == '-') {
                token.shift();
                expression = expression.slice(1, expression.length);
                displayInput.value = displayInput.value.slice(1, displayInput.value.length);
            } else if ((expression[0] != "-") || (expression[0] == "-" && expression[expression.length - 1] != ')')) {
                token = ['-', '(', ...token, ')'];
                expression = "-(" + expression + ")";
                displayInput.value = "-(" + displayInput.value + ")";
            } else {
                token.slice(2, token.length);
                expression = expression.slice(2, expression.length - 1);
                displayInput.value = displayInput.value.slice(2, displayInput.value.length - 1);
            }
        }
    }
});

function fact(value) {
    value = +eval(value);

    function factorial(number) {
        result = 1;
        while (number > 0) {
            result *= number;
            number -= 1;
        }
        return result;
    }

    let cof = [2.5066282746310005,
        1.0000000000190015,
        76.18009172947146,
        -86.50532032941677,
        24.01409824083091,
        -1.231739572450155,
        0.1208650973866179e-2,
        -0.5395239384953e-5,
    ];

    function GammaLn(x) {
        let y, ser, co, j, index = 2;
        ser = cof[1], y = x;
        co = cof[index++];
        for (j = 2; j < 8; j++) {
            y += 1.;
            ser += co / y;
            co = cof[index++];
        }
        y = x + 5.5;
        y -= (x + 0.5) * Math.log(y);
        return (-y + Math.log(cof[0] * ser / x));
    }

    function Gamma(x) {
        return ((Math.exp(GammaLn(x))).toFixed(32));
    }

    if (Number.isInteger(value) && value < 0) {
        return "error";
    }

    if (Number.isInteger(value)) {
        return factorial(value);
    } else if (value > 0) {
        return Gamma(value) * value
    } else {
        let sum = (digit - 1) * (-1);
        return Math.PI / (Math.sin(Math.PI * sum) * Gamma(sum)) * value;
    }

}

// function calculateCos(deg) {
// 	var rad = (Math.PI / 180) * deg;

//   	return Math.cos(rad);
// }

// var deg = 30;
// var y = calculateCos(deg);

// // cos(30 deg) = 0.8660254037844387
// console.log('cos(' + deg + ' deg) = ' + y);
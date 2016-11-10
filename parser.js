var Operator = require('./Operator.js');
var Function = require('./Function.js');
var ShuntingYardParser = require('./ShuntingYardParser.js');
var Stack = require('./Stack.js');
var Variable = require('./Variable.js');

function Parser(variables) {

    this._operators = new Stack();
    this._operators.push(new Operator('^', true, 4));
    this._operators.push(new Operator('*', false, 3));
    this._operators.push(new Operator('/', false, 3));
    this._operators.push(new Operator('+', false, 2));
    this._operators.push(new Operator('-', false, 2));
    
    this._operators.push(new Operator('and', false, 5));
    this._operators.push(new Operator('or', false, 5));
    this._operators.push(new Operator('&&', false, 5));
    this._operators.push(new Operator('||', false, 5));


    this._functions = require('./FunctionsDefinition.js');

    this._constants = new Stack();
    this._constants.push(new Variable("PI", Math.PI));
    this._constants.push(new Variable("E", Math.E));

    this._variables = variables;

    this._emptyRegex = /empty\W+([a-zA-Z\.0-9]*)/g;
    this._notEmptyRegex = /not empty\W+([a-zA-Z\.0-9]*)/g;

    this._shuntingYardParser = new ShuntingYardParser(this._operators, this._functions);
}

Parser.prototype.evaluateRpn = function(rpn) {
    var computation = new Stack();
    console.log(rpn);
    var chars = rpn.split(' ');
    var len = chars.length;
    for(var i = 0; i < len; i++) {
        var v1, v2;
        switch(chars[i]) {
            case '^':
                v2 = computation.pop();
                v1 = computation.pop();
                computation.push(Math.pow(parseFloat(v1), parseFloat(v2)));
                break;
            case '+':
                v2 = computation.pop();
                v1 = computation.pop();
                computation.push(parseFloat(v1) + parseFloat(v2));
                break;
            case '*':
                v2 = computation.pop();
                v1 = computation.pop();
                computation.push(parseFloat(v1) * parseFloat(v2));
                break;
            case '-':
                v2 = computation.pop();
                v1 = computation.pop();
                computation.push(parseFloat(v1) - parseFloat(v2));
                break;
            case '/':
                v2 = computation.pop();
                v1 = computation.pop();
                computation.push(parseFloat(v1) / parseFloat(v2));
                break;
            case 'and':
            case '&&':
                v2 = computation.pop();
                v1 = computation.pop();
                computation.push(parseFloat(v2) && parseFloat(v1));
                break;
            case 'or':
            case '||':
                v2 = computation.pop();
                v1 = computation.pop();
                computation.push(parseFloat(v2) || parseFloat(v1));
                break;
            case ' ':
                break;
            case ',':
                break;
            default:
                if(!isNaN(parseFloat(chars[i])))
                    computation.push(parseFloat(chars[i]));
                else {
                    var func = this._functions.popValue(chars[i]);
                    var variable = this._variables.popValue(chars[i]);
                    var constant = this._constants.popValue(chars[i]);

                    if(!func && !variable && !constant) {
                        break;
                    } else if(variable != false && !constant) {
                        if(this._constants.containsValue(variable.getValue())) {
                            computation.push(this._constants.popValue(variable.getValue()).getValue());
                        } else {
                            computation.push(variable.getValue());
                        }
                        break;
                    } else if(!variable && constant) {
                        computation.push(constant.getValue());
                        break;
                    }
                    var params = new Array();
                    for(var j = 0; j  < func.getNumArgs(); j++) {
                        params.push(computation.pop());
                    }
                    // Due to RPN notation, arguments are reversed
                    params.reverse();
                    computation.push(func.getCallable()(params));
                }
        }
    }
    return parseFloat(computation.pop());
}

Parser.prototype.isSet = function(varName) {
    return this._variables.containsValue(varName) || this._constants.containsValue(varName);
}

Parser.prototype.parse = function(input) {

    if(this._operators.containsValue(input[0]))
        input = input.substr(0,0) + '0' + input.substr(0); // Insert a leading 0 if the input starts with an operator

    var tmp;

    // Parsing empty and not functions (special function that require the parser context, this context is not available in the function context)
    while(tmp = this._notEmptyRegex.exec(input)) {
        input = input.replace(tmp[0], this.isSet(tmp[1]));
    }

    while(tmp = this._emptyRegex.exec(input)) {
        input = input.replace(tmp[0], !this.isSet(tmp[1]));
    }

    input = input.replace("true", "1");
    input = input.replace("false", "0");

    this._input = input;

    if(this._input.indexOf('=') == -1) {
        var rpn = this._shuntingYardParser.convertInfixNotationToRpn(this._input);
        return this.evaluateRpn(rpn);
    } else { // This is a var declaration
        var splitedInput = this._input.split("=");
        var varName = splitedInput[0].replace(" ", "");
        var expression = splitedInput[1];
        if(varName.indexOf('(') == -1) { // Variable definition
            if(this._constants.containsValue(varName) || this._functions.containsValue(varName)) {
                return "Error : symbol " + varName + " already exists";
            }
            var value = this.evaluateRpn(this._shuntingYardParser.convertInfixNotationToRpn(expression));
            this._variables.push(new Variable(varName, value));
            return "";
        } else { // function definition
            var funcName = varName.split('(')[0];
            var argList = varName.split('(')[1].replace(')', '').replace(' ', '').split(',');
            var argNumber = argList.length;
            if(this._constants.containsValue(funcName) || this._functions.containsValue(funcName)) {
                return "Error : symbol " + varName + " already exists";
            }
            for(var i = 0; i < argNumber; i++) {
                expression = expression.replace(argList[i], 'params['+i+']');
            }
            this._functions.push(new Function(funcName, function(params) {
                return eval(expression);
            }, argNumber));
        }
    }
}

module.exports = Parser;


var readline = require('readline');

var vars = new Stack();
vars.push(new Variable("ans", 0));

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

var ops = "", funcs = "", consts = "", var1 = "";

var p = new  Parser(vars);
for(var i = 0; i < p._operators.length(); i++) ops += p._operators.at(i).getSymbol() + " ";
for(var i = 0; i < p._functions.length(); i++) funcs += p._functions.at(i).getSymbol() + " ";
for(var i = 0; i < p._constants.length(); i++) consts += p._constants.at(i).getSymbol() + " ";
for(var i = 0; i < p._variables.length(); i++) var1 += p._variables.at(i).getSymbol() + " ";

console.log("Welcome to this parser, operators available : ", ops);
console.log("Functions available : ", funcs);
console.log("Constants available : ", consts);
console.log("Variables available : ", var1);
console.log("Type 'end' to quit");

var p = new Parser(vars);
var result;

var loop = function() {
    rl.question(' > ', function(answer) {
        if(answer == "end") {
            process.exit();
        }
        result = p.parse(answer);
        console.log(answer + " = " + result);
        p._variables.popValue("ans").setValue(result);
        loop();
    });
}

loop();

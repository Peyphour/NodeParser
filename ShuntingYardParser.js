var Stack = require('./Stack.js');

function ShuntingYardParser(operatorList, functionList) {
    this._operators = new Map();
    this._functions = new Map();

    var len = operatorList.length();
    for(var i = 0; i < len; i++) {
        var o = operatorList.at(i);
        this._operators.set(o.getSymbol(), o);
    }

    len = functionList.length();
    for(var i = 0; i < len; i++) {
        var o = functionList.at(i);
        this._functions.set(o.getName(), o);
    }
}

ShuntingYardParser.prototype.addNode = function(stack, operator) {
    var rightNode = stack.pop();
    var leftNode = stack.pop();
    stack.push(new AstNode(operator, leftNode, rightNode));
}

ShuntingYardParser.prototype.parseInput = function(input) {
    var regex = /([-+]?[0-9]*\.?[0-9]+\s?)?(,)?(&&|\|\|)?([\+\*\-\/^\s?])?([a-zA-Z_][a-zA-Z0-9_]*)?([()])?/g
    var toReturn = new Array();

    while(tmp = regex.exec(input)) {
        if(tmp[1] === undefined && tmp[2] === undefined && tmp[3] === undefined && tmp[4] === undefined && tmp[5] === undefined)
            break;
        if(tmp[1] !== undefined)
            toReturn.push(tmp[1].replace(" ", ""));

        if(tmp[2] !== undefined)
            toReturn.push(tmp[2].replace(" ", ""));

        if(tmp[3] !== undefined)
            toReturn.push(tmp[3].replace(" ", ""));

        if(tmp[4] !== undefined)
            toReturn.push(tmp[4].replace(" ", ""));

        if(tmp[5] !== undefined)
            toReturn.push(tmp[5].replace(" ", ""));
    }
    return toReturn;
}

ShuntingYardParser.prototype.convertInfixNotationToRpn = function(input) {
    var operatorStack = new Stack();
    var sb = "";
    var chars = this.parseInput(input);
    main:
    for(var i = 0; i < chars.length; i++) {
        var popped;
        switch(chars[i]) {
            case ' ':
                break;
            case '':
                break;
            case '(':
                operatorStack.push('(');
                break;
            case ')':
                while(operatorStack.length() != 0) {
                    popped = operatorStack.pop();
                    if('(' == popped) {
                        continue main;
                    } else {
                        sb += " " + popped;
                    }
                }
                return "Mismatched par";
            case ',':
                while(operatorStack.peek() != '(') {
                    sb += " " + operatorStack.pop();
                }
                break;
            default:
                if(!(this._operators.get(chars[i]) === undefined)) {
                    var o1 = this._operators.get(chars[i]);
                    var o2;
                    while(operatorStack.length() != 0 && undefined !== (o2 = this._operators.get(operatorStack.peek()))) {
                        if((!o1.isRightAssociative() && 0 == o1.comparePrecedence(o2)) || o1.comparePrecedence(o2) < 0) {
                            operatorStack.pop();
                            sb += " " + o2.getSymbol();
                        } else {
                            break;
                        }
                    }
                    operatorStack.push(chars[i]);
                } else if(!(this._functions.get(chars[i]) === undefined)) {
                    operatorStack.push(chars[i]);
                } else {
                    if(sb.length > 0) {
                        sb += " ";
                    }
                    sb += chars[i];
                }
                break;
        }
    }
    while(operatorStack.length() != 0) {
        sb += " " + operatorStack.pop();
    }
    return sb;
}

module.exports = ShuntingYardParser;

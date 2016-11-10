function Operator(symbol, rightAssociative, precedence) {

    this._symbol = symbol;
    this._rightAssociative = rightAssociative;
    this._precedence = precedence;
}

Operator.prototype.isRightAssociative = function() {
    return this._rightAssociative;
}

Operator.prototype.getPrecedence = function() {
    return this._precedence;
}

Operator.prototype.comparePrecedence = function(o) {

    if(!o instanceof Operator) {
        throw "comparePrecedence : argument is not an operator";
        return;
    }

    return this._precedence > o.getPrecedence() ? 1 : o.getPrecedence() == this._precedence ? 0 : -1;
}

Operator.prototype.getSymbol = function() {
    return this._symbol;
}

module.exports = Operator;

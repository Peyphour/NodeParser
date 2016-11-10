function Variable(name, value) {
    this._name = name;
    this._value = value;
}

Variable.prototype.getName = function() {
    return this._name;
}

Variable.prototype.getSymbol = function() {
    return this._name;
}

Variable.prototype.getValue = function() {
    return this._value;
}

Variable.prototype.setValue = function(value) {
    this._value = value;
}

module.exports = Variable;

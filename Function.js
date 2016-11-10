function Function(name, callable, numArgs) {
    this._name = name;
    this._callable = callable;
    this._numArgs = numArgs;
}

Function.prototype.getName = function() {
    return this._name;
}

Function.prototype.getSymbol = function() {
    return this._name;
}

Function.prototype.getCallable = function() {
    return this._callable;
}

Function.prototype.getNumArgs = function() {
    return this._numArgs;
}



module.exports = Function;

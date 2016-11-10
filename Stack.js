function Stack() {
    this._stack = new Array();
}

Stack.prototype.pop = function() {
    return this._stack.pop();
}

Stack.prototype.push = function(value) {
    return this._stack.push(value);
}

Stack.prototype.peek = function() {
    return this._stack[this._stack.length - 1];
}

Stack.prototype.length = function() {
    return this._stack.length;
}

Stack.prototype.at = function(i) {
    return this._stack[i];
}

Stack.prototype.containsValue = function(value) {
    for(var i = 0; i < this.length(); i++) {
        if(this._stack[i].getSymbol() == value)
            return true;
    }
    return false;
}

Stack.prototype.popValue = function(value) {
    for(var i = 0; i < this.length(); i++) {
        if(this._stack[i].getSymbol() == value)
            return this._stack[i];
    }
    return false;
}

module.exports = Stack;

var Stack = require('./Stack.js');
var Function = require('./Function.js');

functions = new Stack();
// params must be an array, it will contain the function arguments
functions.push(new Function("sin", function(params) {
    return Math.sin(params[0]);
}, 1));

functions.push(new Function("cos", function(params) {
    return Math.cos(params[0]);
}, 1));

functions.push(new Function("sqrt", function(params) {
    return Math.sqrt(params[0]);
}, 1));

functions.push(new Function("max", function(params) {
    return params[0] > params[1] ? params[0] : params[1];
}, 2));

functions.push(new Function("not", function(params) {
    if(params[0] == "0" || params[0] == "false" || params[0] == undefined || params[0] == null)
        return 1;
    else if(params[0] == "1" || params[0] == "true")
        return 0;
    else
        return - params[0];
}, 1));

functions.push(new Function("poly2", function(params) {
    return params[0] * params[3] * params[3] + params[1] * params[3] + params[2];
}, 4));

module.exports = functions;

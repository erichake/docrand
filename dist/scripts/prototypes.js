window.$LEVELS = [];
window.RDM = function (x, y) {
    return Math.floor(Math.min(x, y) + Math.random() * (Math.abs(y - x) + 1));
};
window.katex = null;
window.SimpleKeyboard = null;
Math.arccos = function (_n) {
    if (isNaN(_n) || Math.abs(_n) > 1)
        return Math.PI / 2;
    return Math.acos(_n);
};
Array.prototype.isnull = function () {
    let s = this.reduce((a, b) => Math.abs(a) + Math.abs(b));
    return s < 1e-13;
};
Array.prototype.isnum = function () {
    return this.findIndex(Number.isNaN) === -1;
};
// sum two vectors :
Array.prototype.sum = function (arr) {
    return this.map((a, i) => a + arr[i]);
};
// substract two vectors :
Array.prototype.sub = function (arr) {
    return this.map((a, i) => a - arr[i]);
};
// multiply a vector by a number :
Array.prototype.times = function (_k) {
    return this.map((a, i) => _k * a);
};
// produit scalaire :
Array.prototype.ps = function (arr) {
    return this.map((a, i) => a * arr[i]).reduce((a, b) => a + b);
};
// compute norm of a vector :
Array.prototype.norm = function () {
    return Math.sqrt(this.map((a, i) => a * a).reduce((a, b) => a + b));
};
// Compute distance between two points :
Array.prototype.distance = function (arr) {
    return this.sub(arr).norm();
};
// normalize a vector :
Array.prototype.normalize = function () {
    return this.times(1 / this.norm());
};
// remove Element from array :
Array.prototype.remove = function (_elt) {
    let i = this.indexOf(_elt);
    if (i !== -1) {
        this.splice(i, 1);
    }
};
// push element only if it's not in :
Array.prototype.push_single = function (_elt) {
    if (this.indexOf(_elt) === -1) {
        this.push(_elt);
    }
};
Number.prototype.rnd0 = function () {
    return Math.abs(this) < 1e-13 ? 0 : this;
};
Number.prototype.isnull = function () {
    return Math.abs(this) < 1e-13;
};
Number.prototype.equal = function (_n) {
    return Math.abs(this - _n) < 1e-13;
};
Number.prototype.sign = function () {
    let s = Math.sign(this);
    return s === 0 ? 1 : s;
};
Number.prototype.sqr = function () {
    return this * this;
};
Number.prototype.sqrt = function () {
    return Math.sqrt(this);
};
Number.prototype.abs = function () {
    return Math.abs(this);
};
export {};

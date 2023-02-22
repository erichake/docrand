/*************************************** 
This file is part of DocRand <https://docrand.dgpad.net>.
DocRand is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
DocRand is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
You should have received a copy of the GNU General Public License along with DocRand. If not, see <https://www.gnu.org/licenses/>.
**************************************/

export {};
declare global {
  type v3D = [number, number, number];
  type v2D = [number, number];
  interface Window {
    RDM: (x: number, y: number) => number;
    $START_LEVEL: number;
    $PLUGIN: any;
    $SETTINGS: any;
    $LEVELS: string[];
    katex: any;
    SimpleKeyboard: any;
  }
  interface Array<T> {
    isnull(): boolean;
    isnum(): boolean;
    sum(arr: number[]): number[];
    sub(arr: number[]): number[];
    times(_k: number): number[];
    ps(arr: number[]): number;
    norm(): number;
    distance(arr: number[]): number;
    normalize(): number[];
    remove(_elt: any): void;
    push_single(_elt: any): void;
  }
  interface Number {
    rnd0(): number;
    isnull(): boolean;
    equal(_n: number): boolean;
    sign(): number;
    sqrt(): number;
    sqr(): number;
    abs(): number;
  }

  interface Math {
    arccos(_n: number): number;
  }
}

window.$LEVELS = [];

window.RDM = function (x: number, y: number) {
  return Math.floor(Math.min(x, y) + Math.random() * (Math.abs(y - x) + 1));
};
window.katex = null;
window.SimpleKeyboard = null;

Math.arccos = function (_n: number): number {
  if (isNaN(_n) || Math.abs(_n) > 1) return Math.PI / 2;
  return Math.acos(_n);
};

Array.prototype.isnull = function (): boolean {
  let s = this.reduce((a: number, b: number) => Math.abs(a) + Math.abs(b));
  return s < 1e-13;
};

Array.prototype.isnum = function (): boolean {
  return this.findIndex(Number.isNaN) === -1;
};

// sum two vectors :
Array.prototype.sum = function (arr: number[]): number[] {
  return this.map((a: number, i: number) => a + arr[i]);
};

// substract two vectors :
Array.prototype.sub = function (arr: number[]): number[] {
  return this.map((a: number, i: number) => a - arr[i]);
};

// multiply a vector by a number :
Array.prototype.times = function (_k: number): number[] {
  return this.map((a: number, i: number) => _k * a);
};

// produit scalaire :
Array.prototype.ps = function (arr: number[]): number {
  return this.map((a: number, i: number) => a * arr[i]).reduce(
    (a: number, b: number) => a + b
  );
};

// compute norm of a vector :
Array.prototype.norm = function (): number {
  return Math.sqrt(
    this.map((a: number, i: number) => a * a).reduce(
      (a: number, b: number) => a + b
    )
  );
};

// Compute distance between two points :
Array.prototype.distance = function (arr): number {
  return this.sub(arr).norm();
};

// normalize a vector :
Array.prototype.normalize = function (): number[] {
  return this.times(1 / this.norm());
};

// remove Element from array :
Array.prototype.remove = function (_elt): void {
  let i = this.indexOf(_elt);
  if (i !== -1) {
    this.splice(i, 1);
  }
};

// push element only if it's not in :
Array.prototype.push_single = function (_elt): void {
  if (this.indexOf(_elt) === -1) {
    this.push(_elt);
  }
};

Number.prototype.rnd0 = function (): number {
  return Math.abs(this) < 1e-13 ? 0 : this;
};

Number.prototype.isnull = function (): boolean {
  return Math.abs(this) < 1e-13;
};

Number.prototype.equal = function (_n: number): boolean {
  return Math.abs(this - _n) < 1e-13;
};

Number.prototype.sign = function (): number {
  let s = Math.sign(this);
  return s === 0 ? 1 : s;
};

Number.prototype.sqr = function (): number {
  return this * this;
};

Number.prototype.sqrt = function (): number {
  return Math.sqrt(this);
};

Number.prototype.abs = function (): number {
  return Math.abs(this);
};

/***************************************
This file is part of DocRand.
DocRand is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
DocRand is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
You should have received a copy of the GNU General Public License along with DocRand. If not, see <https://www.gnu.org/licenses/>.
**************************************/
const RepTypes = [
    // "exp" en chantier :
    "exp",
    "int",
    "dec",
    "frac",
    "frac-simp",
    "sci",
    "puiss",
    "puiss10",
    "h-min-s",
    "h-min",
    "min-s",
];
export class LClass {
    constructor() {
        // Liste des inputs :
        this.inputs = [];
        // Nombre de questions par niveau :
        this.NB = 10;
        // Nombre de secondes par question :
        this.CHRONO = 0;
    }
    type() {
        return "int";
    }
    question() {
        return "";
    }
    prefix() {
        return "";
    }
    suffix() {
        return "";
    }
    answer() {
        return [];
    }
    comment() {
        return "";
    }
    setNB(_n) {
        this.NB = _n;
    }
    getNB() {
        return this.NB;
    }
    setCHRONO(_t) {
        this.CHRONO = _t;
    }
    getCHRONO() {
        return this.CHRONO;
    }
    tex_answer() {
        let tex;
        let a = this.answer();
        if (this.type() === "exp") {
            return `$$${a[0]}$$`;
        }
        for (let i = 0; i < a.length; i++) {
            a[i] = Math.round(a[i] * 1e8) / 1e8;
        }
        switch (this.type()) {
            case "dec":
            case "int":
                tex = `$$${a[0]}$$`;
                break;
            case "min-s":
                tex = `$$${a[0]}min${a[1]}s$$`;
                break;
            case "h-min":
                tex = `$$${a[0]}h${a[1]}min$$`;
                break;
            case "h-min-s":
                tex = `$$${a[0]}h${a[1]}min${a[2]}s$$`;
                break;
            case "frac-simp":
            case "frac":
                tex = `$$\\dfrac{${a[0]}}{${a[1]}}$$`;
                break;
            case "sci":
                tex = `$$${a[0]}\\times10^{${a[1]}}$$`;
                break;
            case "puiss":
                tex = `$$${a[0]}^{${a[1]}}$$`;
                break;
            case "puiss10":
                tex = `$$10^{${a[0]}}$$`;
                break;
        }
        return tex;
    }
    addinput(inp) {
        this.inputs.push(inp);
        return this;
    }
    check() {
        let eq = function (m, n) {
            return Math.abs(m - n) < 1e-13;
        };
        let t = this.inputs.map((x) => x.dom().value);
        let ok;
        switch (this.type()) {
            case "exp":
                // en chantier...
                let stud = t[0].replace(/\s/g, "");
                ok = false;
                for (let i = 0; i < this.answer().length; i++) {
                    ok = ok || stud === this.answer()[i];
                }
                break;
            case "min-s":
            case "h-min":
            case "h-min-s":
            case "puiss10":
            case "puiss":
            case "sci":
            case "frac-simp":
            case "dec":
            case "int":
                ok = this.answer().every((a, i) => {
                    return eq(a, parseFloat(t[i].trim().replace(",", ".")));
                });
                break;
            case "frac":
                let a = parseFloat(t[0].trim().replace(",", "."));
                let b = parseFloat(t[1].trim().replace(",", "."));
                let c = this.answer()[0];
                let d = this.answer()[1];
                ok = eq(a * d, b * c);
                break;
        }
        return ok;
    }
}
export const RD = function (x, y) {
    if (typeof y === "undefined") {
        if (typeof x === "undefined") {
            return Math.random();
        }
        return RD(0, x);
    }
    return Math.floor(Math.min(x, y) + Math.random() * (Math.abs(y - x) + 1));
};
export const CUT = function (x) {
    return Math.round(parseFloat("" + x) * Math.pow(10, 8)) / Math.pow(10, 8);
};

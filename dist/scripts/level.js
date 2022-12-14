/***************************************
This file is part of DocRand <https://docrand.dgpad.net>.
DocRand is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
DocRand is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
You should have received a copy of the GNU General Public License along with DocRand. If not, see <https://www.gnu.org/licenses/>.
**************************************/
const RepTypes = [
    // "exp" en chantier :
    "exp",
    "lst_int",
    "int",
    "dec",
    "mixed",
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
        // if (this.type() === "exp") {
        //   return `$$${a[0]}$$`;
        // }
        // if (this.type() === "lst_int") {
        //   return `$$${a[0]}$$`;
        // }
        switch (this.type()) {
            case "lst_int":
            case "exp":
                return `<br>$$${a[0]}$$`;
                break;
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
            case "mixed":
                tex = `$$${a[0]}\\dfrac{${a[1]}}{${a[2]}}$$`;
                break;
            case "frac-simp":
            case "frac":
                tex = `$$\\dfrac{${a[0]}}{${a[1]}}$$`;
                break;
            case "sci":
                tex = `$$${a[0]}\\times10^{${a[1]}}$$`;
                break;
            case "puiss":
                let nb = a[0] < 0 ? `(${a[0]})` : a[0];
                tex = `$$${nb}^{${a[1]}}$$`;
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
            return Math.abs(m - n) < 1e-8;
        };
        let t = this.inputs.map((x) => x.dom().value);
        let ok;
        let stud, teach;
        switch (this.type()) {
            case "exp":
                // en chantier...
                stud = t[0].replace(/\s/g, "");
                ok = false;
                for (let i = 0; i < this.answer().length; i++) {
                    ok = ok || stud === this.answer()[i];
                }
                break;
            case "lst_int":
                //student:
                let str = t[0].trim();
                if (str.slice(-1) === ";")
                    str = str.slice(0, -1);
                stud = str.split(";").map((a) => parseInt(a));
                stud.sort((a, b) => a - b);
                //teacher:
                teach = this.answer()[0]
                    .split(";")
                    .map((a) => parseInt(a));
                teach.sort((a, b) => a - b);
                ok = stud.join(";") === teach.join(";");
                break;
            case "min-s":
            case "h-min":
            case "h-min-s":
            case "puiss10":
            case "puiss":
            case "sci":
            case "mixed":
            case "frac-simp":
            case "dec":
            case "int":
                ok = this.answer().every((a, i) => {
                    // console.log("teach = " + a);
                    // console.log("studt = " + parseFloat(t[i].trim().replace(",", ".")));
                    // console.log("************************");
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
export const RD = function (x, y, ex) {
    if (typeof ex === "undefined") {
        if (typeof y === "undefined") {
            if (typeof x === "undefined") {
                // RD() => Al??atoire dans [0,1[
                return Math.random();
            }
            // RD(a) => Al??atoire entier dans [0,a]
            return RD(0, x, []);
        }
        if (typeof y === "object") {
            // RD(a,[e1,e2,...]) => Al??atoire entier dans [0,a] sauf e1,e2,...
            return RD(0, x, y);
        }
        // RD(a,b) => Al??atoire entier dans [a,b]
        return RD(x, y, []);
    }
    // RD(a,b,[e1,e2,...]) => Al??atoire entier dans [a,b] sauf e1,e2,...
    let k;
    do {
        k = Math.floor(Math.min(x, y) + Math.random() * (Math.abs(y - x) + 1));
    } while (ex.indexOf(k) !== -1);
    return k;
};
export const CUT = function (x, n) {
    let exp = typeof n === "undefined" ? 8 : parseFloat("" + n);
    return Math.round(parseFloat("" + x) * Math.pow(10, exp)) / Math.pow(10, exp);
};
export const GCD = function (a, b) {
    if (b) {
        return GCD(b, a % b);
    }
    else {
        return Math.abs(a);
    }
};
export const SVG = function (svg, stl) {
    // tout convertir en utf8 :
    var txt = document.createElement("textarea");
    txt.innerHTML = svg;
    // les non-ascii en html-entities :
    svg = txt.value
        .split("")
        .map((a) => (a.charCodeAt(0) > 127 ? `&#${a.charCodeAt(0)};` : a))
        .join("");
    let s = typeof stl === "undefined" ? "" : ` style="${stl}"`;
    return `<img${s} src="data:image/svg+xml;base64,${btoa(svg)}"/>`;
};

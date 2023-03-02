export class Polynomial {
  private EXP_ORIGIN: string;
  private EXP_PREFIX: string;
  private EXP_EXPAND: string;
  private VARNAME: string = "";

  constructor(_str: string) {
    this.parse(_str);
  }
  private parse(exp: string) {
    this.EXP_ORIGIN = exp;

    // Enregistrement du nom de la variable :
    exp.replace(/([a-zA-Z])/, (a, m) => {
      this.VARNAME = m;
      return "";
    });

    // Remplacement des - en début d'expression ou en
    // début de parenthèse par 0- :
    exp = exp.replace(/(^|\()-/g, "$10-");

    // Ajout du signe * lorsqu'il est sous-entendu :
    let rg = new RegExp(`([0-9a-zA-Z_\\)])([a-zA-Z\\(])`);
    while (rg.exec(exp) !== null) {
      exp = exp.replace(rg, "$1*$2");
    }

    console.log(exp);

    // Masquage des paires de parenthèses par une chaine
    // "POL_i" et enregistrement du contenu de chaque paires de
    // parenthèses dans un tableau POLS :
    let POLS: string[] = [];
    const recurs_Parenthesis = function (_e: string): void {
      if (_e.indexOf("(") !== -1) {
        recurs_Parenthesis(
          _e.replace(/\(([^\)\(]*)\)/g, function (a: string, m: string) {
            POLS.push(m);
            return `POL_${POLS.length - 1}`;
          })
        );
      } else {
        POLS.push(_e);
      }
    };
    recurs_Parenthesis(exp);

    // Passage de la notation "naturelle" à la notation préfixée :
    const prefixNotation = function () {
      const CD: AssociativeArray = {
        "^": "puiss",
        "*": "times",
        "/": "div",
        "+": "plus",
        "-": "minus",
      };
      const PR = function (txt: string, s0: string): string {
        let C =
          "(" +
          s0
            .split("|")
            .map((t) => {
              return `\\${t}`;
            })
            .join("|") +
          ")";
        const rg = new RegExp(
          `([0-9a-zA-Z_\\(\\),]*)${C}([0-9a-zA-Z_\\(\\),]*)`
        );
        while (rg.exec(txt) !== null) {
          txt = txt.replace(
            rg,
            function (a: string, m1: string, m2: string, m3: string) {
              return `${CD[m2]}(${m1},${m3})`;
            }
          );
        }
        return txt;
      };
      for (let i = 0; i < POLS.length; i++) {
        POLS[i] = PR(POLS[i], "^");
        POLS[i] = PR(POLS[i], "*|/");
        POLS[i] = PR(POLS[i], "+|-");
        POLS[i] = POLS[i].replace(/POL_([0-9]*)/g, function (a, m) {
          return POLS[parseInt(m)];
        });
      }
    };
    prefixNotation();

    // Transformation des nombres et des variables en tableaux
    // de coefficients polynomiaux : 2 devient [2] et
    // x devient [0,1]
    exp = POLS[POLS.length - 1];
    exp = exp.replace(/([0-9]+)/g, "[$1]");
    rg = new RegExp(`([^a-zA-Z])([a-zA-Z])([^a-zA-Z])`);
    while (rg.exec(exp) !== null) {
      exp = exp.replace(rg, "$1[0,1]$3");
    }
    this.EXP_PREFIX = exp;
  }

  expand(): string {
    if (this.EXP_EXPAND) return this.EXP_EXPAND;
    console.log(this.EXP_PREFIX);
    let t: number[] = this.evalPREFIX();
    let str = "";
    for (let i = t.length - 1; i >= 0; i--) {
      if (t[i] === 0) continue;
      str += `${i !== t.length - 1 && t[i] > 0 ? "+" : ""}${
        t[i] === 1 && i > 0 ? "" : t[i]
      }${i > 0 ? this.VARNAME : ""}${i > 1 ? "^" + i : ""}`;
    }
    this.EXP_EXPAND = str === "" ? "0" : str;
    return this.EXP_EXPAND;
  }
  getJSCode(exp?: string): string {
    let EX = typeof exp === "undefined" ? this.EXP_ORIGIN : exp;

    // Ajout du signe * lorsqu'il est sous-entendu :
    EX = EX.replace(/([0-9a-zA-Z_\)])([a-zA-Z\(])/g, "$1*$2");

    // Remplacement du caret (^) par le symbole puissance "**" :
    EX = EX.replace(/\^/g, "**");
    return EX;
  }

  private evalPREFIX(): number[] {
    let func = new Function(
      `${this.evalPREFIX_Procs}return ${this.EXP_PREFIX};`
    );
    return func();
  }

  private evalPREFIX_Procs = `const times = function (a, b) {
    const n = a.length - 1;
    const p = b.length - 1;
    let t = [];
    for (let k = 0; k <= n + p; k++) {
      let s = 0;
      for (let i = 0; i <= k; i++) {
        let A = a[i] ? a[i] : 0;
        let B = b[k - i] ? b[k - i] : 0;
        s += A * B;
      }
      t.push(s);
    }
    return t;
  };
  const bin = function (a, b, plus) {
    const n = a.length;
    const p = b.length;
    let t = [];
    const max = Math.max(a.length, b.length);
    for (let k = 0; k < max; k++) {
      let A = a[k] ? a[k] : 0;
      let B = b[k] ? b[k] : 0;
      t.push(plus ? A + B : A - B);
    }
    return t;
  };
  const plus = function (a, b) {
    return bin(a, b, true);
  };
  const minus = function (a, b) {
    return bin(a, b, false);
  };
  const puiss = function (a, b) {
    let t = Array(b[0]).fill(0);
    t.push(1);
    return t;
  };`;
}

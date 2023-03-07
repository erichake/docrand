/*************************************** 
This file is part of DocRand <https://docrand.dgpad.net>.
DocRand is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
DocRand is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
You should have received a copy of the GNU General Public License along with DocRand. If not, see <https://www.gnu.org/licenses/>.
**************************************/

import { $, DOMElement } from "./dom_design.js";
import { Polynomial } from "./polynomial.js";
import { $PREFS } from "./preferences.js";

const RepTypes = [
  "expand",
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
] as const;
export type RepType = typeof RepTypes[number];

export class LClass {
  // Liste des inputs :
  private inputs: DOMElement[] = [];
  // Nombre de questions par niveau :
  private NB: number = 10;
  // Nombre de secondes par question :
  private CHRONO: number = 0;
  constructor(o?: LClass) {
    if (o) this.clone(o);
  }
  clone(o: LClass) {
    this.type = () => o.type();
    this.question = () => o.question();
    this.prefix = () => o.prefix();
    this.suffix = () => o.suffix();
    this.answer = () => o.answer();
    this.comment = () => o.comment();
    this.footer = () => o.footer();
    this.customKeys = () => o.customKeys();
    this.check = o.check;
    this.tex_answer = o.tex_answer;
  }
  type(): RepType {
    return "int";
  }
  question(): string {
    return "";
  }
  prefix(): string {
    return "";
  }
  suffix(): string {
    return "";
  }
  answer(): any[] {
    return [];
  }
  comment(): string {
    return "";
  }
  customKeys(): string[] {
    return [];
  }
  vars(): string[] {
    const r = this.answer()[0];
    let t0: AssociativeArray = {};
    r.replace(/([a-zA-Z])/g, function (a: string, m: string) {
      t0[m] = "";
    });
    return Object.keys(t0).sort();
  }
  setNB(_n: number) {
    this.NB = _n;
  }
  getNB() {
    return this.NB;
  }
  setCHRONO(_t: number) {
    this.CHRONO = _t;
  }
  getCHRONO() {
    return this.CHRONO;
  }

  addinput(inp: DOMElement) {
    this.inputs.push(inp);
    return this;
  }
  footer(): string[] {
    return [this.prefix(), this.type(), this.suffix()];
  }
  check(): boolean {
    let me = this;
    let eq = function (m: number, n: number): boolean {
      return Math.abs(m - n) < 1e-8;
    };
    let t: string[] = this.inputs.map(
      (x: any) => (<HTMLInputElement>x.dom()).value
    );
    let ok: boolean;
    let stud, teach;
    switch (this.type()) {
      case "expand":
        let P = new Polynomial(this.answer()[0]);
        let ST = t[0].replace(/\s/g, "");
        const OK = function (): boolean {
          let vs = me.vars();
          let v = vs.length === 0 ? "" : vs[0];

          try {
            const f = new Function(
              `${v}`,
              `return (${P.getJSCode(ST)})-(${P.getJSCode()});`
            );
            for (let i = -20; i < 20; i++) {
              if (CUT(f(i)) !== 0) return false;
            }
          } catch (e) {
            $("#COM_FAIL").parent().stl("text-align:center");
            $("#COM_FAIL")
              .inner($PREFS.content.you_fail.comment1)
              .stl("color:#660000;font-weight:bold;font-style:italic");
            return false;
          }
          return true;
        };
        ok = OK();
        if (ok) {
          if (ST.indexOf("(") !== -1) {
            ok = false;
            $("#COM_FAIL").parent().stl("text-align:center");
            $("#COM_FAIL")
              .inner($PREFS.content.you_fail.comment2)
              .stl("color:green;font-weight:bold;font-style:italic");
          } else if (Math.abs(P.expand().length - ST.length) > 1) {
            ok = false;
            $("#COM_FAIL").parent().stl("text-align:center");
            $("#COM_FAIL")
              .inner($PREFS.content.you_fail.comment3)
              .stl("color:green;font-weight:bold;font-style:italic");
          }
        }
        if (!ok) {
          this.answer = function (): any[] {
            let rep = P.expand();
            return [rep === "" ? "0" : rep];
          };
        }

        break;
      case "lst_int":
        //student:
        let str = t[0].trim();
        if (str.slice(-1) === ";") str = str.slice(0, -1);
        stud = str.split(";").map((a: string) => parseInt(a));
        stud.sort((a: number, b: number) => a - b);
        //teacher:
        teach = this.answer()[0]
          .split(";")
          .map((a: string) => parseInt(a));
        teach.sort((a: number, b: number) => a - b);
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
        ok = this.answer().every((a: any, i: any) => {
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
  tex_answer(): string {
    let tex = [];
    let a = this.answer();
    let m = 0;
    const T = () => CUT(a[m++]);
    let foot = this.footer();
    for (let rank = 1; rank < foot.length; rank += 2) {
      let tpe = foot[rank];
      switch (tpe) {
        case "expand":
          tex.push(`$$${a[m++]}$$`);
          break;
        case "lst_int":
          tex.push(`$$${a[m++]}$$`);
          break;
        case "dec":
        case "int":
          tex.push(`$$${T()}$$`);
          break;
        case "min-s":
          tex.push(`$$${T()}min${T()}s$$`);
          break;
        case "h-min":
          tex.push(`$$${T()}h${T()}min$$`);
          break;
        case "h-min-s":
          tex.push(`$$${T()}h${T()}min${T()}s$$`);
          break;
        case "mixed":
          tex.push(`$$${T()}\\dfrac{${T()}}{${T()}}$$`);
          break;
        case "frac-simp":
        case "frac":
          tex.push(`$$\\dfrac{${T()}}{${T()}}$$`);
          break;
        case "sci":
          tex.push(`$$${T()}\\times10^{${T()}}$$`);
          break;
        case "puiss":
          let nb = a[m] < 0 ? `(${T()})` : T();
          tex.push(`$$${nb}^{${T()}}$$`);
          break;
        case "puiss10":
          tex.push(`$$10^{${T()}}$$`);
          break;
      }
    }
    let str = `<div style="margin-top:10px;padding:10px;color:#777">${foot[0]}`;
    for (let k = 0; k < tex.length; k++) {
      str += `<div style="display:inline-block;padding:10px;border-radius:3px;border: 2px solid black;margin-left:8px;margin-right:8px;border-color:#660000;color:#660000;background-color:white">${tex[
        k
      ].replace(/(-*\d+)\.(\d*)/g, `$1,$2`)}</div>`;
      str += foot[2 * k + 2];
    }
    str += `</div>`;
    return str;
  }
}

export const RD = function (x?: number, y?: number, ex?: number[]): number {
  if (typeof ex === "undefined") {
    if (typeof y === "undefined") {
      if (typeof x === "undefined") {
        // RD() => Aléatoire dans [0,1[
        return Math.random();
      }
      // RD(a) => Aléatoire entier dans [0,a]
      return RD(0, x, []);
    }
    if (typeof y === "object") {
      // RD(a,[e1,e2,...]) => Aléatoire entier dans [0,a] sauf e1,e2,...
      return RD(0, x, y);
    }
    // RD(a,b) => Aléatoire entier dans [a,b]
    return RD(x, y, []);
  }
  // RD(a,b,[e1,e2,...]) => Aléatoire entier dans [a,b] sauf e1,e2,...
  let k;
  do {
    k = Math.floor(Math.min(x, y) + Math.random() * (Math.abs(y - x) + 1));
  } while (ex.indexOf(k) !== -1);
  return k;
};

export const CUT = function (x: number | string, n?: number | string): number {
  let exp = typeof n === "undefined" ? 8 : parseFloat("" + n);
  return Math.round(parseFloat("" + x) * 10 ** exp) / 10 ** exp;
};

export const DEC = function (t: number | string): string {
  t = "" + t;
  return t.replace(/(-*\d+)\.(\d*)/g, `$1,$2`);
};

export const GCD = function (a: number, b: number): number {
  if (b) {
    return GCD(b, a % b);
  } else {
    return Math.abs(a);
  }
};

export const SVG = function (svg: string, stl?: string) {
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

// Renvoie le source HTML d'une figure DGPad
export const DGPad = function (obj: LClass, figure?: string, param?: any) {
  let P = typeof param === "undefined" ? {} : param;
  let scale = P.scale ? P.scale : 1;
  let hide_ctrl_panel = P.hide_ctrl_panel ? P.hide_ctrl_panel : true;
  let target = P.target ? P.target : null;
  let interactive = P.interactive ? P.interactive : target ? true : false;
  // Si on est en mode "target", il n'y a pas de réponse
  // numérique attentue : l'élève doit déplacer un ou plusieurs
  // objets de la figure. "target" représente le nom du point
  // ou de l'expression de cette figure dont la valeur doit être
  // égale à la réponse prof (this.answer()).
  if (target) {
    obj.footer = () => {
      return [];
    };
    obj.tex_answer = () => {
      $("#dgpad_frame_mask").stl("pointer-events:none");
      let frm = $("#doceval_iframe").dom() as any;
      let cnv = frm.contentWindow.$CANVAS;
      let src_student = cnv.getSource();
      let cst = cnv.getConstruction();
      let ans = obj.answer();
      if (ans.length === 1) ans = ans[0];
      let T = cst.findVar(target);
      let teacher = JSON.stringify(obj.answer());
      T.setExp(teacher);
      cst.computeAll();
      let src_teacher = cnv.getSource();

      // En rouge, tous les objets de
      // la figure de correction :
      src_teacher = src_teacher.replace(
        /"c:(#[0-9a-fA-F]{6});/gm,
        '"c:#c82f25;'
      );

      // En gris, tous les objets de
      // la figure de l'élève :
      src_student = src_student.replace(
        /"c:(#[0-9a-fA-F]{6});/gm,
        '"c:#888888;'
      );

      // On nettoie la figure, et y on injecte
      // les deux sources (élève et prof) :
      cst.deleteAll();
      cnv.macrosManager.clearTools();
      cnv.textManager.clear();
      cnv.trackManager.clear();
      cnv.Interpret(src_teacher);
      cnv.Interpret(src_student);
      cst.initAll();
      cst.computeAll();
      cnv.textManager.refreshInputs();
      cnv.paint();
      return "";
    };
    obj.check = () => {
      const eq = function (m: number, n: number): boolean {
        return Math.abs(m - n) < 1e-8;
      };
      let frm = $("#doceval_iframe").dom() as any;
      let teacher = obj.answer();
      let student = frm.contentWindow.$CANVAS
        .getConstruction()
        .findVar(target)
        .getValue();

      let ok = true;
      for (let i = 0; i < teacher.length; i++) {
        ok = ok && eq(teacher[i], student[i]);
      }
      return ok;
    };
  }
  let fig = figure
    ? figure
    : `SetCoords(400,285.5,40,false,411,308);SetCoordsStyle("isAxis:false;isGrid:true;isOx:true;isOy:true;isLockOx:false;isLockOy:false;centerZoom:false;onlyPositive:false;color:#111111;fontSize:18;axisWidth:1;gridWidth:0.1");SetGeneralStyle("background-color:#F8F8F8;degree:true;dragmoveable:true");`;
  // Bascule en mode consultation/déplacement (mode 0) :
  fig += `setTimeout(()=>{this.Z.setMode(0)},1);`;
  let w = 0;
  let h = 0;
  fig.replace(
    /SetCoords\([^\)]*,\s*(\d*)\s*,\s*(\d*)\s*\)/g,
    function (m: string, a: string, b: string) {
      w = parseInt(a);
      h = parseInt(b);
      return "";
    }
  );
  const d = Date.now();
  scale = (scale * (window.$SETTINGS.stage.width - 20)) / w;
  const src = `<div id="dgpad_frame_mask" style="position:relative;pointer-events: ${
    interactive ? "auto" : "none"
  };margin:0 auto;width:${scale * w}px;height:${
    scale * h
  }px;overflow:hidden;border:2px solid #3a92c8">
  <form action="/dgpad/dgpad.php" target="dgpad_frame_${d}" method="post" style="transform-origin:left top;transform:scale(${scale})"><input type="hidden" name="file_content" value="${btoa(
    fig
  )}"><input type="hidden" name="hide_ctrlpanel" value="${
    hide_ctrl_panel ? "true" : "false"
  }"><input type="hidden" name="show_tools" value="true"><iframe id="doceval_iframe"  name="dgpad_frame_${d}" style="width:${w}px;height:${h}px;" src="about:blank" scrolling="no" frameborder="no" oNlOAd="if (!this.parentNode.num) {this.parentNode.submit();this.parentNode.num=true}"></iframe></form><div id="dgpad_frame_reload" style="display:none;position:absolute;cursor:pointer;width:30px;height:30px;left:2px;top:2px;"><img src="./ressources/images/reload3.svg" style="width:100%"></div></div>`;
  if (interactive) {
    // On rajoute après coup un bouton de reload :
    setTimeout(() => {
      $("#dgpad_frame_reload")
        .show()
        .up(() => {
          let frm = $("#doceval_iframe").dom() as any;
          let cnv = frm.contentWindow.$CANVAS;
          let cst = cnv.getConstruction();
          cst.deleteAll();
          cnv.macrosManager.clearTools();
          cnv.textManager.clear();
          cnv.trackManager.clear();
          cnv.Interpret(fig);
          cst.initAll();
          cst.computeAll();
          cnv.textManager.refreshInputs();
          cnv.paint();
        });
    }, 100);
  }

  return src;
};

export const EXPAND = function (_exp: string) {
  let p = new Polynomial(_exp);
  return p.expand();
};

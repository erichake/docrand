/*************************************** 
This file is part of DocRand <https://docrand.dgpad.net>.
DocRand is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
DocRand is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
You should have received a copy of the GNU General Public License along with DocRand. If not, see <https://www.gnu.org/licenses/>.
**************************************/

import { $, DOMElement } from "../dom_design.js";
import { div } from "./div.js";
import { LClass } from "../level.js";

export class footer extends div {
  constructor() {
    super();
    const s = window.$SETTINGS.stage;
    const p = window.$SETTINGS.footer;
    this.stl(
      `position:relative;width:${s.width}px;background-color:${p.background}`
    ).att(`id:student_answer_footer`);
  }

  setLevel(o: LClass) {
    const INP = function (kbd: string[]): DOMElement {
      let inp = $.input()
        .att(
          `id:input_html_element;type:text;pattern:[0-9]*;inputmode:decimal;onclick:this.setSelectionRange(0, this.value.length);autocomplete:off;autocomplete:off;autocapitalize:off`
        )
        .stl(
          `background:#b8def6;font-size:28px;width:100px;margin-left:5px;margin-right:5px;border-radius:8px;border:0;text-align:center;outline:none;padding-left:10px;padding-right:10px`
        );
      inp.getValue().KBDS = kbd;
      return inp;
    };
    const pack = function (dm: DOMElement): DOMElement {
      return $.div()
        .stl(
          `display:table-cell;vertical-align:middle;margin-left:5px;margin-right:5px`
        )
        .add(dm);
    };
    const int_kbd = ["0 1 2 3 4 - {bksp}", "5 6 7 8 9  {enter}"];
    const dec_kbd = ["0 1 2 3 4 - {bksp}", "5 6 7 8 9 , {enter}"];
    const lst_int_kbd = ["0 1 2 3 4 - {bksp}", "5 6 7 8 9 ; {enter}"];
    const exp_kbd = [
      "+ * / x y ( )",
      "- 1 2 3 4 5 {bksp}",
      ", 6 7 8 9 0 {enter}",
    ];
    let foot = o.footer();
    let wrp = $.div()
      .att("id:student_inputs")
      .stl(
        `position:relative;padding-top:10px;padding-bottom:10px;display:${
          foot.length === 0 ? "none" : "table"
        };left:50%;transform:translate(-50%,0);font-size:28px;font-family:sans-serif;color:white`
      );
    this.dom().inner("").add(wrp);
    // En standard : foot vaut [prefix(), type(), suffix()]
    for (let rank = 1; rank < foot.length; rank += 2) {
      let p = this.dec(foot[rank - 1]);
      let s = this.dec(foot[rank + 1]);
      // Si le footer contient plus d'une zone réponse, on passe le préfixe :
      let pre =
        rank === 1
          ? $.div()
              .inner($.TeX(p))
              .stl("display:table-cell;vertical-align:middle")
          : $.div().hide();

      let suf = $.div()
        .inner($.TeX(s))
        .stl("display:table-cell;vertical-align:middle");

      let inp,
        inp1,
        inp2,
        inp3,
        inp1wrp,
        inp2wrp,
        ten,
        h,
        min,
        sec,
        sep,
        div,
        c1,
        c2,
        c3;

      switch (foot[rank]) {
        case "exp":
          inp = INP(exp_kbd)
            .att(`pattern:[\w\d]+`)
            .stl(
              `display:table-cell;margin-left:5px;margin-right:5px;width:150px`
            );
          o.addinput(inp);
          wrp.add(pre).add(inp).add(suf);
          // (inp.dom() as HTMLInputElement).focus();
          break;
        case "lst_int":
          let com = $.div()
            .stl(
              `display:table-row;font-size:14px;vertical-align:middle;margin-left:5px;margin-right:5px;margin-top:3px;width:90%`
            )
            .inner(
              `Réponse sous forme d'une liste de nombres entiers séparés par des points-virgules :`
            );
          inp = INP(lst_int_kbd).stl(
            `display:table-row;vertical-align:middle;margin-left:5px;margin-right:5px;margin-top:10px;width:90%`
          );
          o.addinput(inp);
          wrp.stl(`width:100%;text-align:center`).add(com).add(inp);
          break;
        case "int":
        case "dec":
          inp = INP(foot[rank] === "int" ? int_kbd : dec_kbd);

          // .kup((e) => {
          //   // console.log(e.currentTarget);
          //   let me = <HTMLInputElement>e.currentTarget;
          //   const fakeEle = $.div().stl(
          //     `position:absolute;width:unset;height:0;top:0;left:-9999px;overflow:hidden;visibility:hidden;whiteSpace:nowrap`
          //   );
          //   const st = window.getComputedStyle(me);
          //   fakeEle.stl(
          //     `font-family:${st.fontFamily};font-size:${st.fontSize};font-style:${st.fontStyle};font-weight:${st.fontWeight};letter-spacing:${st.letterSpacing};text-transform:${st.textTransform};border-left-width:${st.borderLeftWidth};border-right-width:${st.borderRightWidth};padding-left:${st.paddingLeft};padding-right:${st.paddingRight}`
          //   );
          //   $("body").add(fakeEle);
          //   const v = me.value || me.getAttribute("placeholder") || "";
          //   fakeEle.dom().innerHTML = v.replace(/\s/g, "&" + "nbsp;");
          //   const fakeEleStyles = window.getComputedStyle(fakeEle.dom());
          //   me.style.width = fakeEleStyles.width;
          //   fakeEle.remove();
          // });
          o.addinput(inp);
          wrp.add(pre).add(pack(inp)).add(suf);
          break;
        case "min-s":
          inp1 = INP(int_kbd);
          inp2 = INP(int_kbd);
          min = $.div()
            .stl("display:table-cell;vertical-align:middle;padding-right:10px")
            .inner($.TeX(`$$min$$`));
          sec = $.div()
            .stl("display:table-cell;vertical-align:middle;padding-right:10px")
            .inner($.TeX(`$$s$$`));
          o.addinput(inp1).addinput(inp2);
          c1 = pack(inp1.stl("width:60px"));
          c2 = pack(inp2.stl("width:60px"));
          wrp.add(pre).add(c1).add(min).add(c2).add(sec).add(suf);
          break;
        case "h-min":
          inp1 = INP(int_kbd);
          inp2 = INP(int_kbd);
          h = $.div()
            .stl("display:table-cell;vertical-align:middle;padding-right:10px")
            .inner($.TeX(`$$h$$`));
          min = $.div()
            .stl("display:table-cell;vertical-align:middle;padding-right:10px")
            .inner($.TeX(`$$min$$`));
          o.addinput(inp1).addinput(inp2);
          c1 = pack(inp1.stl("width:60px"));
          c2 = pack(inp2.stl("width:60px"));
          wrp.add(pre).add(c1).add(h).add(c2).add(min).add(suf);
          break;
        case "h-min-s":
          inp1 = INP(int_kbd);
          inp2 = INP(int_kbd);
          inp3 = INP(int_kbd);
          h = $.div()
            .stl("display:table-cell;vertical-align:middle;padding-right:10px")
            .inner($.TeX(`$$h$$`));
          min = $.div()
            .stl("display:table-cell;vertical-align:middle;padding-right:10px")
            .inner($.TeX(`$$min$$`));
          sec = $.div()
            .stl("display:table-cell;vertical-align:middle;padding-right:10px")
            .inner($.TeX(`$$s$$`));
          o.addinput(inp1).addinput(inp2).addinput(inp3);
          c1 = pack(inp1.stl("width:60px"));
          c2 = pack(inp2.stl("width:60px"));
          c3 = pack(inp3.stl("width:60px"));
          wrp
            .add(pre)
            .add(c1)
            .add(h)
            .add(c2)
            .add(min)
            .add(c3)
            .add(sec)
            .add(suf);
          break;
        case "puiss10":
          ten = $.div()
            .stl("display:table-cell;vertical-align:middle;padding-left:10px")
            .inner($.TeX(`$$10$$`));
          inp2 = INP(int_kbd).stl(
            `display:block;margin-left:5px;margin-right:5px;font-size:24px;width:60px`
          );
          inp2wrp = $.div()
            .stl(
              `display:table-cell;margin-left:5px;margin-right:5px;vertical-align:middle`
            )
            .add(inp2)
            .add($.div().stl(`display:block;height:50px`));
          o.addinput(inp2);
          wrp.add(pre).add(ten).add(inp2wrp).add(suf);
          break;
        case "puiss":
          inp1 = INP(dec_kbd).stl(
            `display:block;margin-left:5px;margin-right:5px;margin-bottom:5px;width:60px`
          );
          inp1wrp = $.div()
            .stl(
              `display:table-cell;vertical-align:middle;margin-left:5px;margin-right:5px`
            )
            .add(inp1);
          inp2 = INP(int_kbd).stl(`display:block;font-size:24px;width:40px`);
          inp2wrp = $.div()
            .stl(
              `display:table-cell;margin-left:5px;margin-right:5px;vertical-align:top;`
            )
            .add(inp2)
            .add($.div().stl(`display:block;height:50px`));
          o.addinput(inp1).addinput(inp2);
          // Traitement du cas de la puissance d'un nombre négatif.
          // On ajoute des parenthèses à l'affichage. ex : (-3)^2
          if (o.answer()[0] < 0) {
            let par1 = $.div()
              .stl(
                `display:table-cell;vertical-align:middle;margin-left:5px;margin-right:5px`
              )
              .inner($.TeX(`$$($$`));
            let par2 = $.div()
              .stl(
                `display:table-cell;vertical-align:middle;margin-left:5px;margin-right:5px`
              )
              .inner($.TeX(`$$)$$`));
            wrp
              .add(pre.stl(`vertical-align:middle`))
              .add(par1)
              .add(inp1wrp)
              .add(par2)
              .add(inp2wrp)
              .add(suf.stl(`vertical-align:middle`));
          } else {
            wrp
              .add(pre.stl(`vertical-align:middle`))
              .add(inp1wrp)
              .add(inp2wrp)
              .add(suf.stl(`vertical-align:middle`));
          }
          break;
        case "sci":
          inp1 = INP(dec_kbd).stl(`display:block;margin-bottom:5px`);
          inp1wrp = $.div()
            .stl(
              `display:table-cell;vertical-align:middle;margin-left:5px;margin-right:5px`
            )
            .add(inp1);
          inp2 = INP(int_kbd).stl(
            `display:block;margin-left:5px;margin-right:5px;margin-bottom:8px;font-size:24px;width:40px`
          );
          inp2wrp = $.div()
            .stl(`display:table-cell;margin-left:5px;margin-right:5px;`)
            .add(inp2)
            .add($.div().stl(`display:block;height:40px;`));
          ten = $.div()
            .stl("display:table-cell;vertical-align:middle")
            .inner($.TeX(`$$\\times10$$`));
          o.addinput(inp1).addinput(inp2);
          wrp.add(pre).add(inp1wrp).add(ten).add(inp2wrp).add(suf);
          break;
        case "mixed":
          inp2 = INP(int_kbd).stl(
            `display:block;margin-bottom:8px;font-size:24px;width:50px;`
          );
          inp3 = INP(int_kbd).stl(
            `display:block;margin-top:8px;font-size:24px;width:50px;`
          );
          sep = $.div().stl(
            `display:block;width:65px;height:3px;background:white;margin: 0 auto;`
          );
          div = $.div()
            .stl(
              `display:table-cell;width:50px;text-align:center;padding-left:10px;padding-right:10px`
            )
            .add(inp2)
            .add(sep)
            .add(inp3);

          inp1 = INP(int_kbd).stl(
            `display:block;width:60px;font-size:48px;height:70px`
          );
          let div2 = $.div()
            .stl(
              `display:table-cell;width:60px;text-align:center;vertical-align:middle`
            )
            .add(inp1);
          o.addinput(inp1).addinput(inp2).addinput(inp3);
          wrp.add(pre).add(div2).add(div).add(suf);
          break;
        case "frac":
        case "frac-simp":
          inp1 = INP(int_kbd).stl(
            `display:block;margin-bottom:8px;font-size:24px;width:90px;`
          );
          inp2 = INP(int_kbd).stl(
            `display:block;margin-top:8px;font-size:24px;width:90px;`
          );
          sep = $.div().stl(
            `display:block;width:110px;height:3px;background:white;margin: 0 auto;`
          );
          div = $.div()
            .stl(
              `display:table-cell;width:100px;text-align:center;padding-left:10px;padding-right:10px`
            )
            .add(inp1)
            .add(sep)
            .add(inp2);
          o.addinput(inp1).addinput(inp2);
          wrp.add(pre).add(div).add(suf);
          break;
      }
    }

    // Le focus dans le premier input ne doit pas se faire
    // au démarrage quand jeu est dans une iframe : si c'était
    // le cas, ce focus ferait dérouler la page, il faut donc
    // éviter cela pour la toute premiere passe (d'où le $FLAG_0) :
    const allINPS = wrp.dom().getElementsByTagName("input");
    if (allINPS.length > 0) {
      if (window.location === window.parent.location) {
        // Si je ne suis pas dans une iframe :
        allINPS[0].focus();
      } else {
        // Si je suis dans une iframe :
        if (window.$FLAG_0) {
          // Première fois, sans focus() :
          window.$FLAG_0 = false;
        } else {
          // Les autres fois, avec focus() :
          allINPS[0].focus();
        }
      }
    }
  }
}

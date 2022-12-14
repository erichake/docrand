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

    let p = this.dec(o.prefix());
    let s = this.dec(o.suffix());
    let wrp = $.div()
      .att("id:student_inputs")
      .stl(
        `position:relative;padding-top:10px;padding-bottom:10px;display:table;left:50%;transform:translate(-50%,0);font-size:28px;font-family:sans-serif;color:white`
      );
    let pre = $.div()
      .inner($.TeX(p))
      .stl("display:table-cell;vertical-align:middle");

    let suf = $.div()
      .inner($.TeX(s))
      .stl("display:table-cell;vertical-align:middle");
    // const int_kbd = ["- 1 2 3 4 5 {bksp}", " 6 7 8 9 0 {enter}"];
    // const dec_kbd = ["- 1 2 3 4 5 {bksp}", ", 6 7 8 9 0 {enter}"];
    const int_kbd = ["0 1 2 3 4 - {bksp}", "5 6 7 8 9  {enter}"];
    const dec_kbd = ["0 1 2 3 4 - {bksp}", "5 6 7 8 9 , {enter}"];
    const lst_int_kbd = ["0 1 2 3 4 - {bksp}", "5 6 7 8 9 ; {enter}"];
    const exp_kbd = [
      "+ * / x y ( )",
      "- 1 2 3 4 5 {bksp}",
      ", 6 7 8 9 0 {enter}",
    ];
    let inp, inp1, inp2, inp3, inp1wrp, inp2wrp, ten, h, min, sec, sep, div;
    switch (o.type()) {
      case "exp":
        inp = INP(exp_kbd)
          .att(`pattern:[\w\d]+`)
          .stl(
            `display:table-cell;margin-left:5px;margin-right:5px;width:150px`
          );
        o.addinput(inp);
        this.dom().inner("").add(wrp.add(pre).add(inp).add(suf));
        (inp.dom() as HTMLInputElement).focus();
        break;
      case "lst_int":
        let com = $.div()
          .stl(
            `display:table-row;font-size:14px;vertical-align:middle;margin-left:5px;margin-right:5px;margin-top:3px;width:90%`
          )
          .inner(
            `R??ponse sous forme d'une liste de nombres entiers s??par??s par des points-virgules :`
          );
        inp = INP(lst_int_kbd).stl(
          `display:table-row;vertical-align:middle;margin-left:5px;margin-right:5px;margin-top:10px;width:90%`
        );
        o.addinput(inp);
        this.dom()
          .inner("")
          .add(wrp.stl(`width:100%;text-align:center`).add(com).add(inp));
        (inp.dom() as HTMLInputElement).focus();
        break;
      case "int":
      case "dec":
        inp = INP(o.type() === "int" ? int_kbd : dec_kbd).stl(
          `display:table-cell;vertical-align:middle;margin-left:5px;margin-right:5px;margin-top:3px`
        );
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
        this.dom().inner("").add(wrp.add(pre).add(inp).add(suf));
        (inp.dom() as HTMLInputElement).focus();
        break;
      case "min-s":
        inp1 = INP(int_kbd).stl(
          `display:table-cell;margin-left:5px;margin-right:5px;width:60px`
        );
        inp2 = INP(int_kbd).stl(
          `display:table-cell;margin-left:5px;margin-right:5px;width:60px`
        );
        min = $.div()
          .stl("display:table-cell;vertical-align:middle;padding-right:10px")
          .inner($.TeX(`$$min$$`));
        sec = $.div()
          .stl("display:table-cell;vertical-align:middle;padding-right:10px")
          .inner($.TeX(`$$s$$`));
        o.addinput(inp1).addinput(inp2);
        this.dom()
          .inner("")
          .add(wrp.add(pre).add(inp1).add(min).add(inp2).add(sec).add(suf));
        (inp1.dom() as HTMLInputElement).focus();
        break;
      case "h-min":
        inp1 = INP(int_kbd).stl(
          `display:table-cell;margin-left:5px;margin-right:5px;width:60px`
        );
        inp2 = INP(int_kbd).stl(
          `display:table-cell;margin-left:5px;margin-right:5px;width:60px`
        );
        h = $.div()
          .stl("display:table-cell;vertical-align:middle;padding-right:10px")
          .inner($.TeX(`$$h$$`));
        min = $.div()
          .stl("display:table-cell;vertical-align:middle;padding-right:10px")
          .inner($.TeX(`$$min$$`));
        o.addinput(inp1).addinput(inp2);
        this.dom()
          .inner("")
          .add(wrp.add(pre).add(inp1).add(h).add(inp2).add(min).add(suf));
        (inp1.dom() as HTMLInputElement).focus();
        break;
      case "h-min-s":
        inp1 = INP(int_kbd).stl(
          `display:table-cell;margin-left:5px;margin-right:5px;width:60px`
        );
        inp2 = INP(int_kbd).stl(
          `display:table-cell;margin-left:5px;margin-right:5px;width:60px`
        );
        inp3 = INP(int_kbd).stl(
          `display:table-cell;margin-left:5px;margin-right:5px;width:60px`
        );
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
        this.dom()
          .inner("")
          .add(
            wrp
              .add(pre)
              .add(inp1)
              .add(h)
              .add(inp2)
              .add(min)
              .add(inp3)
              .add(sec)
              .add(suf)
          );
        (inp1.dom() as HTMLInputElement).focus();
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
        this.dom().inner("").add(wrp.add(pre).add(ten).add(inp2wrp).add(suf));
        (inp2.dom() as HTMLInputElement).focus();
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
        this.dom().inner("");
        // Traitement du cas de la puissance d'un nombre n??gatif.
        // On ajoute des parenth??ses ?? l'affichage. ex : (-3)^2
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
          this.dom().add(
            wrp
              .add(pre.stl(`vertical-align:middle`))
              .add(par1)
              .add(inp1wrp)
              .add(par2)
              .add(inp2wrp)
              .add(suf.stl(`vertical-align:middle`))
          );
        } else {
          this.dom().add(
            wrp
              .add(pre.stl(`vertical-align:middle`))
              .add(inp1wrp)
              .add(inp2wrp)
              .add(suf.stl(`vertical-align:middle`))
          );
        }
        // this.dom()
        //   .inner("")
        //   .add(
        //     wrp
        //       .add(pre.stl(`vertical-align:middle`))
        //       .add(inp1wrp)
        //       .add(inp2wrp)
        //       .add(suf.stl(`vertical-align:middle`))
        //   );
        (inp1.dom() as HTMLInputElement).focus();
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
        this.dom()
          .inner("")
          .add(wrp.add(pre).add(inp1wrp).add(ten).add(inp2wrp).add(suf));
        (inp1.dom() as HTMLInputElement).focus();
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
        this.dom().inner("").add(wrp.add(pre).add(div2).add(div).add(suf));
        (inp1.dom() as HTMLInputElement).focus();
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
        this.dom().inner("").add(wrp.add(pre).add(div).add(suf));
        (inp1.dom() as HTMLInputElement).focus();
        break;
    }
  }
}

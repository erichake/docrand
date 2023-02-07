/***************************************
This file is part of DocRand <https://docrand.dgpad.net>.
DocRand is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
DocRand is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
You should have received a copy of the GNU General Public License along with DocRand. If not, see <https://www.gnu.org/licenses/>.
**************************************/
import { $ } from "../dom_design.js";
import { div } from "./div.js";
export class content extends div {
    constructor() {
        super();
        let prefs = window.$SETTINGS;
        const s = prefs.stage;
        const h = prefs.header;
        const f = prefs.footer;
        const c = prefs.content;
        this.stl(`position:relative;width:${s.width}px;min-height:${c.min_height}px;background-color:${c.background};user-select:none;-webkit-user-select:none;`);
        this.Qdiv = $.div().stl(`position:relative;padding:10px;padding-top:20px;padding-bottom:20px;bottom:${c.question.bottom}px;color:${c.question.color};font-size:${c.question.fontsize}px;font-family:sans-serif`);
        this.dom()
            .add((this.FAIL = $.div().stl(`width:100%;text-align:center;color:${c.you_fail.color};font-family:sans-serif;overflow:hidden;line-height:0;font-size:0px;padding-top:0px;padding-bottom:0px;background:${c.you_fail.background};height:0px`))
            .add($.div()
            .stl(`font-weight:bold;font-size:120%`)
            .inner(c.you_fail.text1))
            .add($.div()
            .stl(`font-size:100%`)
            .add($.span().inner(c.you_fail.text2))
            .add((this.ANS = $.span())))
            .add($.div()
            .stl(`font-size:80%;text-align:justify;padding-left:10px;padding-right:10px;padding-top:10px;color:${c.comment.color}`)
            .add($.span().inner(""))
            .add((this.COM_FAIL = $.span()))))
            .add((this.WIN = $.div()
            .stl(`width:100%;text-align:center;color:${c.you_win.color};font-family:sans-serif;overflow:hidden;line-height:0;font-size:0px;font-weight:bold;padding-top:0px;padding-bottom:0px;background:${c.you_win.background};height:0px`)
            .inner(c.you_win.text)).add($.div()
            .stl(`font-weight:normal;font-size:60%;text-align:justify;padding-left:10px;padding-right:10px;padding-top:10px;color:${c.comment.color}`)
            .add($.span().inner(""))
            .add((this.COM_WIN = $.span()))))
            .add(this.Qdiv);
    }
    hide_messages() {
        this.FAIL.stl(`height:0px;transition:unset;line-height:0;font-size:0px;padding-top:0px;padding-bottom:0px`);
        this.WIN.stl(`height:0px;transition:unset;line-height:0;font-size:0px;padding-top:0px;padding-bottom:0px`);
    }
    show_youfail(o) {
        const c = window.$SETTINGS.content;
        this.ANS.inner($.TeX(o.tex_answer()));
        this.FAIL.stl(`height:unset;transition: all ${c.you_fail.transition_time}s;line-height:1;font-size:${c.you_fail.fontsize}px;padding-top:20px;padding-bottom:20px`);
    }
    show_youwin() {
        const c = window.$SETTINGS.content;
        this.WIN.stl(`height:unset;transition: all ${c.you_win.transition_time}s;line-height:1;font-size:${c.you_win.fontsize}px;padding-top:20px;padding-bottom:20px`);
    }
    setLevel(o) {
        // Remplacement du point décimal par une virgule, sauf pour
        // tout ce qui est à l'intérieur de balises html :
        let q = o.question().replace(/(\d+)\.(\d*)(?![^<]*>)/g, "$1,$2");
        const c = window.$SETTINGS.content;
        this.hide_messages();
        if (q === "") {
            this.Qdiv.stl(`position:relative;padding:0px;padding-top:0px;padding-bottom:0px;bottom:0px;color:#FFF;font-size:0px`);
        }
        else {
            this.Qdiv.stl(`position:relative;padding:10px;padding-top:20px;padding-bottom:20px;bottom:${c.question.bottom}px;color:${c.question.color};font-size:${c.question.fontsize}px;font-family:sans-serif`);
        }
        this.Qdiv.inner($.TeX(q));
        this.COM_FAIL.inner(o.comment());
        // this.COM_WIN.inner(o.comment());
        this.stl(`min-height:${q === "" ? 0 : c.min_height}px`);
    }
}

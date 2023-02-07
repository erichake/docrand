/***************************************
This file is part of DocRand <https://docrand.dgpad.net>.
DocRand is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
DocRand is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
You should have received a copy of the GNU General Public License along with DocRand. If not, see <https://www.gnu.org/licenses/>.
**************************************/
import { $ } from "../dom_design.js";
import { div } from "./div.js";
export class header extends div {
    constructor(_cb_valid, _cb_setlevel) {
        super();
        this.score = $.span().inner("0");
        this.level = $.span().inner("1");
        this.btn_left = $.div().inner("&#x25c0;&#xfe0e;");
        this.btn_right = $.div().inner("&#x25b6;&#xfe0e;");
        this.dots = $.div().stl(`display:inline-block;vertical-align:middle`);
        this.prefix = $.div().stl(`display:inline-block;vertical-align:middle;text-align:right`);
        this.suffix = $.div().stl(`display:inline-block;vertical-align:middle;text-align:left`);
        this.nbQuestions = $.span();
        this.nbLevels = window.$LEVELS.length;
        this.no_more_dots = function () {
            let dots = this.dots.findAll("#virgin_dot");
            return dots.length === 0;
        };
        this.cb_valid = _cb_valid;
        this.cb_setlevel = _cb_setlevel;
        const t = window.$SETTINGS.title;
        const h = window.$SETTINGS.header;
        const s = window.$SETTINGS.stage;
        const isMB = "ontouchstart" in window;
        // Place réservée au dessus de la scène (recouvrement par la zone fixed) :
        this.stl(`display:block;position:relative;width:${s.width}px;height:${h.height + t.height}px;color:${h.color};background-color:${h.background};user-select:none;-webkit-user-select:none`);
        // On ajoute au body une zone fixed dans laquelle se trouve tout le header :
        $("body").add((this.fx_banner = $.div()
            .att("id:top_banner")
            .stl(`position:fixed;z-index:1;left:0px;top:0px;width:${s.width}px;height:${h.height + t.height}px;text-align:center;visibility:hidden`)
            .add($.div()
            // *** Bandeau de titre ***
            .stl(`display:table;width:${s.width}px;background:${t.background}`)
            .add(
        // Nom de l'activité :
        $.div()
            .stl(`display:table-cell;max-width:${s.width - (isMB ? t.height : 2 * t.height)}px;height:${t.height}px;vertical-align:middle;font-family:sans-serif;font-size:${t.fontsize}px;color:${t.color};font-weight:bold;text-align:left;padding-left:10px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;`)
            .inner(t.text))
            .add(
        // Bouton de reload :
        $.div()
            .stl(`display:table-cell;width:${t.height}px;height:${t.height}px;vertical-align:middle;cursor: pointer`)
            .add($.create("img")
            .att(`src:./ressources/images/reload2.svg`)
            .stl(`width:75%`))
            .up(() => {
            this.cb_setlevel();
        }))
            .add(
        // Bouton QRCode (uniquement sur ordi) :
        isMB
            ? $.div()
            : $.div()
                .stl(`display:table-cell;width:${t.height}px;height:${t.height}px;vertical-align:middle;cursor: pointer`)
                .add($.create("a")
                .att(`href:https://files.dgpad.net/qrcode/?url=${location.href};target:_blank`)
                .add($.create("img")
                .att(`src:./ressources/images/qrcode.svg`)
                .stl(`width:75%`))))
            .add(
        // Bouton Next pour questions sans input (uniquement sur ordi) :
        isMB
            ? $.div()
            : $.div()
                .stl(`display:table-cell;width:${t.height}px;height:${t.height}px;vertical-align:middle;cursor: pointer`)
                .add($.create("img")
                .att(`src:./ressources/images/next.svg`)
                .stl(`width:75%`))
                .up(() => {
                this.cb_valid();
            })))
            .add((this.table = $.div()
            .stl(`display:table;width:${s.width}px;height:${h.height}px;color:${h.color};background-color:${h.background};user-select:none;-webkit-user-select:none`)
            .add($.div()
            .stl(`display:table-row;height:${h.height}px`)
            .add($.div()
            .stl(`display:table-cell;vertical-align:middle;text-align:center;font-family:sans-serif;`)
            .add($.div()
            .add(this.prefix
            .inner(h.prefix.text)
            .stl(`font-size:${h.prefix.fontsize}px;width:${h.prefix.width}px;padding-right:${h.prefix.padding}px`))
            .add(this.dots)
            .add(this.suffix.stl(`padding-left:${h.suffix.padding}px;width:${h.suffix.width}px;font-family:sans-serif;font-size:${h.suffix.fontsize}px`)))))))));
        if (this.nbLevels > 1) {
            const l = window.$SETTINGS.header.levels;
            const b = l.button;
            this.stl(`height:${h.height + t.height + l.height}px`);
            this.fx_banner.stl(`height:${h.height + t.height + l.height}px`);
            this.table.add($.div()
                .stl(`display:table-row;height:${l.height}px`)
                .add((this.row2 = $.div().stl(`display:table-cell;height:${l.height}px;vertical-align:top`))));
            for (var i = 0; i < this.nbLevels; i++) {
                this.row2.add($.div()
                    .att(`id:level_block`)
                    .stl(`position: relative;display:inline-block;margin-left:5px;margin-right:5px;margin-top:10px;vertical-align:top`)
                    .add($.div()
                    .att("id:level_button")
                    .stl(`display:block;font-size:${b.fontsize}px;font-family:sans-serif;background:${b.background};color:${b.color};border-radius: 8px;border: 2px solid ${b.border_color};box-sizing: border-box;cursor: pointer;font-weight: 400;outline: none;padding: 5px 12px;user-select: none;-webkit-user-select: none`)
                    .inner(b.text + (i + 1))
                    .hover(`background:${b.hover_background};color:${b.hover_color}`)
                    .setValue({ rank: i, selected: false })
                    .up(this.change_level.bind(this)))
                    .add($.div()
                    .att(`id:level_score`)
                    .stl(`display:block;font-size:20px`)
                    .inner(``)));
            }
            this.row2
                .find("#level_button")
                .stl(`background:${b.select_background};color:${b.select_color}`);
            this.row2.find("#level_button").getValue().selected = true;
        }
        // Transition de l'en-tête :
        setTimeout(() => {
            $("#top_banner").stl(`top:${-$("#top_banner").height()}px;visibility:visible;`);
            setTimeout(() => {
                $("#top_banner").stl(`transition:all 0.5s ease-in-out;top:0px;`);
                setTimeout(() => {
                    $("#top_banner").stl(`transition:unset`);
                }, 500);
            }, 400);
        }, 1);
    }
    display_score(rk) {
        const ls = this.row2.findAll("#level_block")[rk].find("#level_score");
        const t_str = ls.dom().innerHTML === "" ? "0/0" : ls.dom().innerHTML;
        const t = t_str.split("/");
        const newsc = parseInt(this.score.dom().innerHTML);
        const oldsc = parseInt(t[0]);
        if (newsc > oldsc) {
            ls.inner(`${newsc}/${this.nbQuestions.dom().innerHTML}`);
        }
    }
    change_level(e) {
        const l = window.$SETTINGS.header.levels;
        const b = l.button;
        const rank = e.currentTarget.dom_element.getValue().rank;
        const btns = this.row2.findAll("#level_button");
        if (!btns[rank].getValue().selected) {
            let old_rank;
            for (let k = 0; k < btns.length; k++) {
                btns[k].stl(`background:${b.background};color:${b.color}`);
                if (btns[k].getValue().selected)
                    old_rank = k;
                btns[k].getValue().selected = false;
            }
            this.display_score(old_rank);
            btns[rank].stl(`background:${b.select_background};color:${b.select_color}`);
            btns[rank].getValue().selected = true;
            btns[rank].updateHover();
            this.cb_setlevel(rank + 1);
        }
    }
    get_score() {
        return this.score.dom().innerHTML;
    }
    get_level() {
        return parseInt(this.level.dom().innerHTML);
    }
    setLevel(QUE) {
        const s = window.$SETTINGS.stage;
        const h = window.$SETTINGS.header;
        const n = QUE.getNB();
        this.nbQuestions.inner("" + n);
        this.score.inner("0");
        const w = Math.min(h.height - 8, (s.width -
            h.prefix.width -
            h.suffix.width -
            h.prefix.padding -
            h.suffix.padding -
            n * h.dots.gap) /
            n) - 1;
        this.dots.inner("");
        for (var i = 0; i < n; i++) {
            this.dots.add($.div()
                .att(`id:virgin_dot`)
                .stl(`box-sizing: border-box;display:inline-block;margin-left:${h.dots.gap / 2}px;margin-right:${h.dots.gap / 2}px;background:${h.dots.virgin_background};vertical-align:middle;border-radius:100%;width:${w}px;height:${w}px;border:2px solid ${h.dots.virgin_color}`));
        }
        this.suffix
            .inner("")
            .add(this.score)
            .add($.span().inner("/"))
            .add(this.nbQuestions);
    }
    mark_dot(b) {
        const h = window.$SETTINGS.header;
        if (b) {
            const score = parseInt(this.score.dom().innerHTML);
            this.score.inner(`${score + 1}`);
        }
        let dots = this.dots.findAll("#virgin_dot");
        dots[0]
            .att("id:marked_dots")
            .stl(`background:${b ? h.dots.win_background : h.dots.fail_background};border:2px solid ${b ? h.dots.win_color : h.dots.fail_color}`);
        return dots.length === 1;
    }
}

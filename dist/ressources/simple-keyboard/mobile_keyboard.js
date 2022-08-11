import { $ } from "../../scripts/dom_design.js";
export class MOBILE_KEYBOARD {
    constructor() {
        if (this.isMobileDevice()) {
            var me = this;
            me.dom = $.div()
                .att("id:simple-keyboard-wrapper")
                .stl("display:block")
                .cls("simple-keyboard");
            $("body").add(me.dom);
            this.keyboard = new window.SimpleKeyboard.default({
                onChange: (input) => me.onChange(input),
                onKeyPress: (button) => me.onKeyPress(button),
                layout: {
                    default: ["- 1 2 3 4 5 {bksp}", ", 6 7 8 9 0 {enter}"],
                },
                display: {
                    "{bksp}": "<img style='width:48px;margin-top:10px' src='./ressources/images/bksp.svg'/>",
                    "{enter}": "<span style='color:#2096F3'>&#x23CE;&#xfe0e;</span>",
                    "{next}": "<span style='color:#2096F3'>&#x21E8;&#xfe0e;</span>",
                },
                inputPattern: {
                    default: /.*/,
                },
                theme: "hg-theme-default hg-layout-numeric numeric-theme",
            });
        }
    }
    isMobileDevice() {
        return "ontouchstart" in window;
    }
    show() {
        this.dom.show();
    }
    hide() {
        this.dom.hide();
    }
    setWidth(_w) {
        if (this.isMobileDevice()) {
            this.dom.stl(`width:${_w}px`);
        }
    }
    setDefault(_t) {
        if (this.isMobileDevice()) {
            this.keyboard.setOptions({
                layout: {
                    default: _t,
                },
            });
        }
    }
    actualise(infos) {
        if (this.isMobileDevice()) {
            var me = this;
            me.show();
            me.keyboard.setOptions(infos.options);
            me.exit_proc = infos.exit_proc ? infos.exit_proc : function () { };
            me.INPS = $(infos.elt).findAll("#input_html_element");
            me.DIVS = [];
            me.div = null;
            for (var i = 0; i < me.INPS.length; i++) {
                if (me.INPS[i].wrapper().id() !== "mobile_keyboard_input") {
                    let display = (me.INPS[i].dom()).style.getPropertyValue("display");
                    me.INPS[i].stl("pointer-events:none");
                    me.INPS[i].getValue().focus = function () { };
                    var div = $.create("div")
                        .att("id:mobile_keyboard_input")
                        .stl(`display:${display === "" ? "block" : display}`);
                    me.INPS[i].wrapper().dom().insertBefore(div.dom(), me.INPS[i].dom());
                    div.add(me.INPS[i]);
                    div.getValue().rank = i;
                    div.down(function (e) {
                        me.select(e.target.dom_element.getValue().rank);
                        // me.select(e.target.rank);
                    });
                }
                me.DIVS.push(me.INPS[i].wrapper());
            }
            me.select(0);
        }
    }
    select(rank) {
        var me = this;
        for (var i = 0; i < me.INPS.length; i++) {
            var inp = me.INPS[i];
            if (i === rank) {
                inp.stl("border:4px solid #FF9901");
            }
            else {
                inp.stl("border:4px solid rgba(0,0,0,0)");
            }
        }
        me.selection = rank;
        me.firstTime = true;
        me.keyboard.setInput(me.INPS[rank].dom().value);
        if (me.INPS[rank].getValue().REGS)
            me.keyboard.setOptions({
                inputPattern: {
                    default: me.INPS[rank].getValue().REGS[0],
                },
            });
        if (me.INPS[rank].getValue().KBDS) {
            me.keyboard.setOptions({
                layout: {
                    default: me.INPS[rank].getValue().KBDS,
                },
            });
        }
    }
    onChange(input) {
        var me = this;
        if (me.firstTime) {
            me.INPS[me.selection].val(input.slice(-1));
            me.keyboard.setInput(input.slice(-1));
            me.firstTime = false;
        }
        else {
            me.INPS[me.selection].val(input);
        }
        me.INPS[me.selection].kup(() => { });
        // me.INPS[me.selection].onkeyup();
    }
    onKeyPress(button) {
        var me = this;
        switch (button) {
            case "{next}":
                me.selection = 0;
                me.exit_proc();
                break;
            case "{enter}":
                if (me.selection < me.DIVS.length - 1)
                    me.select(me.selection + 1);
                else {
                    me.selection = 0;
                    me.exit_proc();
                }
                break;
            case "{bksp}":
                break;
            default:
        }
    }
}

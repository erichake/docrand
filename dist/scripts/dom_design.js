/*
This file is part of DocRand.
DocRand is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
DocRand is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
You should have received a copy of the GNU General Public License along with DocRand. If not, see <https://www.gnu.org/licenses/>.
*/
Element.prototype.dom_element = null;
export function $(_elt) {
    if (typeof _elt === "string")
        return new DOMElement(_elt);
    if (_elt.dom_element)
        return _elt.dom_element;
    _elt.dom_element = new DOMElement(_elt);
    return _elt.dom_element;
}
$.create = function (tagName) {
    return $(document.createElement(tagName));
};
$.div = function () {
    return $.create("div");
};
$.span = function () {
    return $.create("span");
};
$.p = function () {
    return $.create("p");
};
$.input = function () {
    return $.create("input");
};
$.files = new Array();
$.getScript = function (url, callback = function () { }) {
    if ($.files.indexOf(url) === -1) {
        $.files.push(url);
        var head = document.getElementsByTagName("head")[0];
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        script.onload = callback;
        head.appendChild(script);
    }
    else {
        callback();
    }
};
$.getCSS = function (url, callback = function () { }) {
    if ($.files.indexOf(url) === -1) {
        $.files.push(url);
        var head = document.getElementsByTagName("head")[0];
        var cssnode = document.createElement("link");
        cssnode.type = "text/css";
        cssnode.rel = "stylesheet";
        cssnode.href = url;
        cssnode.onload = callback;
        head.appendChild(cssnode);
    }
    else {
        callback();
    }
};
$.getKaTeX = function (callback = function () { }) {
    $.getCSS("./ressources/katex/katex.css", function () {
        $.getScript("./ressources/katex/katex.js", function () {
            callback();
        });
    });
};
$.TeX = function (_str) {
    var s = _str.split("$$");
    for (var j = 1; j < s.length; j = j + 2) {
        try {
            s[j] = window.katex.renderToString(s[j]);
        }
        catch (e) { }
    }
    return s.join("");
};
// ************************************
// ********** TRANSLATIONS ************
// ************************************
const trans_dir_types = ["left", "top", "right", "bottom"];
const trans_type_types = ["out", "in"];
$.translate_busy = { out: false, in: false };
$.isTranslateBusy = function () {
    return $.translate_busy["out"] || $.translate_busy["in"];
};
$.translate = function (_elt, _type, _d, _t) {
    let trans = function () {
        let _e = _elt.dom();
        $.translate_busy[_type] = true;
        let r = _e.getBoundingClientRect();
        let p = _e.style["position"];
        let l = _e.style["left"];
        let t = _e.style["top"];
        let w = _e.style["width"];
        let ww = window.innerWidth;
        let wh = window.innerHeight;
        let dx = _d === "left" ? -ww : _d === "right" ? ww : 0;
        let dy = _d === "top" ? -wh : _d === "bottom" ? wh : 0;
        _elt.stl(`position:fixed;left:${_type === "out" ? r.left : r.left - dx}px;top:${_type === "out" ? r.top : r.top - dy}px;width:${r.width}px;transition:${_t}s ease-in-out;transform:translate(${dx}px,${dy}px)`);
        setTimeout(function () {
            _e.style["position"] = p;
            _e.style["left"] = l;
            _e.style["top"] = t;
            _e.style["width"] = w;
            _elt.stl("transition:unset;transform:unset");
            if (_type === "out")
                _elt.hide();
            $.translate_busy[_type] = false;
        }, _t * 1000);
    };
    switch (_type) {
        case "out":
            if (!_d) {
                if (!_elt.isHidden())
                    _elt.hide();
                return;
            }
            if (!_elt.isHidden())
                trans();
            break;
        case "in":
            if (!_d) {
                if (_elt.isHidden())
                    _elt.show();
                return;
            }
            _elt.show();
            trans();
            break;
    }
};
export class DOMElement {
    constructor(_e) {
        this.value = {};
        this.hover_on = function () {
            let _stl = this.hover_stl_on;
            let e = this.elt;
            let _stlOffArray = [];
            let t = _stl.split(";");
            for (let i = 0, len = t.length; i < len; i++) {
                let a = t[i].split(":");
                let pty = a[0].trim();
                let s = e.style[pty] ? e.style[pty] : "unset";
                _stlOffArray.push(`${pty}:${s}`);
            }
            this.hover_stl_off = _stlOffArray.join(";");
            this.stl(_stl);
        };
        this.hover_off = function () {
            this.stl(this.hover_stl_off);
        };
        if (typeof _e === "string") {
            this.elt = document.getElementById(_e);
            if (!this.elt) {
                this.elt = document.querySelector(_e);
                if (!this.elt) {
                    this.elt = document.getElementById("#" + _e);
                }
            }
        }
        else {
            this.elt = _e;
        }
        if (!this.elt)
            throw `error : DOMElement not found`;
    }
    dom() {
        return this.elt;
    }
    width() {
        return this.elt.getBoundingClientRect().width;
    }
    height() {
        return this.elt.getBoundingClientRect().height;
    }
    setValue(v) {
        this.value = v;
        return this;
    }
    getValue() {
        return this.value;
    }
    find(query) {
        let rep = null;
        try {
            let q = this.elt.querySelector(query);
            if (!q)
                q = this.elt.querySelector("#" + query);
            // rep = new DOMElement(q);
            rep = $(q);
        }
        catch (e) { }
        return rep;
    }
    findAll(query) {
        let e = this.elt;
        let res = e.querySelectorAll(query);
        let t = [];
        for (let i = 0; i < res.length; i++) {
            try {
                t.push($(res[i]));
                // t.push(new DOMElement(res[i]));
            }
            catch (e) { }
        }
        return t;
    }
    val(v) {
        let e = this.elt;
        if (typeof v === "undefined")
            return e.value;
        e.value = v;
        return this;
    }
    id(s) {
        if (typeof s === "undefined")
            return this.elt.getAttribute("id");
        this.elt.setAttribute("id", s);
        return this;
    }
    remove() {
        let e = this.elt;
        if (e.parentNode)
            e.parentNode.removeChild(e);
        return this;
    }
    wrapper() {
        let e = this.elt;
        return $(e.parentNode);
    }
    stl(_a0, _a1) {
        let e = this.elt;
        if (_a1) {
            e.style[_a0] = _a1;
        }
        else {
            let t = _a0.split(";");
            for (var i = 0, len = t.length; i < len; i++) {
                // Si l'argument du style contient des ":"
                // il ne faut pas qu'il soit tronqué par
                // le split :
                var a = t[i].split(":");
                var pty = a[0];
                a.shift();
                var arg = a.join(":");
                e.style[pty.trim()] = arg.trim();
            }
        }
        return this;
    }
    att(_pty, _val) {
        if (_val) {
            this.elt.setAttribute(_pty, _val);
        }
        else {
            let t = _pty.split(";");
            for (let i = 0, len = t.length; i < len; i++) {
                // Si l'attribut contient des ":"
                // il ne faut pas qu'il soit tronqué par
                // le split :
                let a = t[i].split(":");
                let pty = a[0];
                a.shift();
                let arg = a.join(":");
                if (this.elt instanceof SVGElement) {
                    this.elt.setAttributeNS(null, pty.trim(), arg.trim());
                }
                else {
                    this.elt.setAttribute(pty.trim(), arg.trim());
                }
            }
        }
        return this;
    }
    cls(_cls) {
        this.elt.className = _cls;
        return this;
    }
    inner(_html) {
        this.elt.innerHTML = _html;
        return this;
    }
    show() {
        this.stl("display", "block");
        return this;
    }
    hide() {
        this.stl("display", "none");
        return this;
    }
    isHidden() {
        return this.dom().style["display"] === "none";
    }
    add(obj) {
        let _o = obj instanceof DOMElement ? obj.elt : obj;
        this.elt.appendChild(_o);
        return this;
    }
    append(_str) {
        this.elt.innerHTML += _str;
        return this;
    }
    // Only for svg elements :
    shape(_tpe) {
        $(document.createElementNS(this.elt.namespaceURI, _tpe));
    }
    // _d : "left", "top", "right" or "bottom"
    // _t : time in seconds
    translateOut(_d, _t) {
        $.translate(this, "out", _d, _t);
    }
    translateIn(_d, _t) {
        $.translate(this, "in", _d, _t);
    }
    // ***************************************
    // ***************************************
    // *********** EVENTS PART ***************
    // ***************************************
    // ***************************************
    on(type, _cbk) {
        let pon = function (e) {
            e.preventDefault();
            _cbk(e);
        };
        this.elt.addEventListener(type, pon);
        return this;
    }
    down(_cbk) {
        this.on("pointerdown", _cbk);
        return this;
    }
    kdown(_cbk) {
        this.on("keydown", _cbk);
        return this;
    }
    up(_cbk) {
        this.on("pointerup", _cbk);
        return this;
    }
    kup(_cbk) {
        this.on("keyup", _cbk);
        return this;
    }
    move(_cbk) {
        this.on("pointermove", _cbk);
        return this;
    }
    over(_cbk) {
        this.on("pointerover", _cbk);
        return this;
    }
    enter(_cbk) {
        this.on("pointerenter", _cbk);
        return this;
    }
    out(_cbk) {
        this.on("pointerout", _cbk);
        return this;
    }
    updateHover() {
        this.hover_on();
    }
    hover(_stl) {
        this.elt.removeEventListener("pointerover", this.hover_on);
        this.elt.removeEventListener("pointerout", this.hover_off);
        this.hover_stl_on = _stl;
        this.over(this.hover_on.bind(this));
        this.out(this.hover_off.bind(this));
        return this;
    }
    drag(_cbk, _beforecbk, _aftercbk) {
        let oldX, oldY, dX, dY;
        // let pmove = _cbk;
        let pmove = function (e) {
            dX = e.pageX - oldX;
            dY = e.pageY - oldY;
            oldX = e.pageX;
            oldY = e.pageY;
            _cbk(e, [dX, dY]);
        };
        let pdown = function (e) {
            // stopPropagation Important pour éviter que
            // plusieurs évenements drag ne se produisent :
            if (_beforecbk)
                _beforecbk();
            e.stopPropagation();
            window.addEventListener("pointermove", pmove);
            window.addEventListener("pointerup", pup);
            oldX = e.pageX;
            oldY = e.pageY;
            dX = dY = 0;
        };
        let pup = function () {
            window.removeEventListener("pointermove", pmove);
            window.removeEventListener("pointerup", pup);
            if (_aftercbk)
                _aftercbk();
        };
        this.on("pointerdown", pdown);
        return this;
    }
}

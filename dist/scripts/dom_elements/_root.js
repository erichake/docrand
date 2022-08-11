import { $ } from "../dom_design.js";
export class root {
    constructor(type) {
        this.elt = $.create(type);
    }
    dom() {
        return this.elt;
    }
    stl(stls) {
        return this.elt.stl(stls);
    }
    add(son) {
        this.elt.add(son.dom());
    }
    inner(t) {
        this.elt.inner(t);
    }
    dec(t) {
        return t.replace(/(-*\d+)\.(\d*)/g, `$1,$2`);
    }
}

import { $, DOMElement } from "../dom_design.js";

export class root {
  private elt: DOMElement;
  constructor(type: keyof HTMLElementTagNameMap) {
    this.elt = $.create(type);
  }
  dom(): DOMElement {
    return this.elt;
  }
  stl(stls: string): DOMElement {
    return this.elt.stl(stls);
  }
  add(son: root) {
    this.elt.add(son.dom());
  }
  inner(t: string) {
    this.elt.inner(t);
  }
  dec(t: string): string {
    return t.replace(/(-*\d+)\.(\d*)/g, `$1,$2`);
  }
}

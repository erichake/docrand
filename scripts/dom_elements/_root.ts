/*************************************** 
This file is part of DocRand <https://docrand.dgpad.net>.
DocRand is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
DocRand is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
You should have received a copy of the GNU General Public License along with DocRand. If not, see <https://www.gnu.org/licenses/>.
**************************************/
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

import {
  LClass,
  RAND,
} from "https://localhost/ts_jeux_maths/dist/scripts/level.js";
export const general_settings = {
  welcome: "Bienvenue dans ce jeu !",
  title: { text: "Addition de nombres relatifs", height: 50 },
};
export class L1 extends LClass {
  constructor() {
    super();
    this.NB = 4;
    this.a = RAND(1, 10);
  }
  type() {
    return "int";
  }
  question() {
    return `L1 Entrer le nombre $$${this.a}$$`;
  }
  prefix() {
    return "$$a=$$";
  }
  suffix() {
    return "$$cm^2$$";
  }
  answer() {
    return [this.a];
  }
  comment() {
    return "";
  }
}
export class L2 extends LClass {
  constructor() {
    super();
    this.NB = 4;
    this.a = RAND(1, 10);
  }
  type() {
    return "int";
  }
  question() {
    return `L1 Entrer le nombre $$${this.a}$$`;
  }
  prefix() {
    return "$$a=$$";
  }
  suffix() {
    return "$$cm^2$$";
  }
  answer() {
    return [this.a];
  }
  comment() {
    return "";
  }
}

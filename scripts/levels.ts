import { LClass, LInterface, RepType, RD } from "./level.js";

export const general_settings = {
  welcome: "Bienvenue dans ce jeu !",
  title: { text: "Addition de nombres relatifs", height: 50 },
};

export class L1 extends LClass implements LInterface {
  NB: number = 4;
  private a: number = RD(1, 10);
  constructor() {
    super();
  }
  type(): RepType {
    return "int";
  }
  question(): string {
    return `L1 Entrer le nombre $$${this.a}$$`;
  }
  prefix(): string {
    return "$$a=$$";
  }
  suffix(): string {
    return "$$cm^2$$";
  }
  answer(): any[] {
    return [this.a];
  }
  comment(): string {
    return "";
  }
}

export class L2 extends LClass implements LInterface {
  NB: number = 4;
  private a: number = RD(1, 10);
  constructor() {
    super();
  }
  type(): RepType {
    return "int";
  }
  question(): string {
    return `L1 Entrer le nombre $$${this.a}$$`;
  }
  prefix(): string {
    return "$$a=$$";
  }
  suffix(): string {
    return "$$cm^2$$";
  }
  answer(): any[] {
    return [this.a];
  }
  comment(): string {
    return "";
  }
}

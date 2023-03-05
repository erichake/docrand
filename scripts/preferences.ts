/*************************************** 
This file is part of DocRand <https://docrand.dgpad.net>.
DocRand is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
DocRand is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
You should have received a copy of the GNU General Public License along with DocRand. If not, see <https://www.gnu.org/licenses/>.
**************************************/

export const $PREFS = {
  welcome: "Bienvenue dans ce jeu !",
  title: {
    text: "Activité sans titre",
    height: 50,
    fontsize: 28,
    background: "#607d8b",
    color: "#FFFFFF",
  },
  stage: {
    width: 650,
    // height: 500,
    background: "#ffffff",
    dialog: {
      fontsize1: 24,
      color1: "#797979",
      text1: "La partie est terminée !",
      fontsize2: 20,
      color2: "#797979",
      text2: "Score : ",
    },
    button: {
      valid_text: "Valider",
      valid_color: "#780013",
      valid_background: "#f1e5e7",
      next_text: "Suite",
      next_color: "#065979",
      next_background: "#e6eef1",
      width: 30,
      height: 20,
      fontsize: 20,
    },
    chrono: {
      cache: { fontsize1: 24, fontsize2: 20, background: "#eeeeee" },
    },
  },
  header: {
    height: 55,
    background: "#eeeeee",
    color: "#256ea3",
    prefix: { text: "Score :", fontsize: 28, width: 110, padding: 5 },
    dots: {
      gap: 4,
      virgin_color: "#afafaf",
      virgin_background: "#e0e0e0",
      win_color: "#10af10",
      win_background: "#bee0be",
      fail_color: "#ac0808",
      fail_background: "#e0bebe",
    },
    suffix: {
      width: 100,
      fontsize: 32,
      padding: 5,
    },
    levels: {
      height: 80,
      button: {
        max_width: 200,
        text: "N",
        fontsize: 24,
        color: "#39739d",
        background: "#e1ecf4",
        border_color: "#7aa7c7",
        hover_background: "#b3d3ea",
        hover_color: "#2c5777",
        select_background: "#3a92c8",
        select_color: "#FFFFFF",
      },
    },
  },
  content: {
    background: "#ffffff",
    min_height: 300,
    question: { color: "#256ea3", fontsize: 30, bottom: 5 },
    you_fail: {
      color: "#660000",
      background: "#e0d2be",
      fontsize: 28,
      top: 10,
      text1: "Faux !",
      text2: "La réponse attendue était : ",
      transition_time: 0.2,
      comment1:
        "Votre expression est mal écrite :<br>il y a des erreurs de syntaxe !",
      comment2:
        "Votre expression est correcte, mais elle n'est pas réduite : elle devrait être sans parenthèse !",
      comment3: "Votre expression est correcte, mais il fallait réduire plus !",
    },
    you_win: {
      color: "#006600",
      background: "#bee0be",
      fontsize: 36,
      top: 10,
      text: "Bonne réponse !",
      transition_time: 0.1,
    },
    comment: {
      color: "#000000",
    },
  },
  footer: {
    height: 140,
    background: "#3a92c8",
    comment1: "Entrer une expression complètement développée et réduite :",
    comment2:
      "Réponse sous forme d'une liste de nombres entiers séparés par des points-virgules :",
  },
};

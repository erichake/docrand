/*************************************** 
This file is part of DocRand <https://docrand.dgpad.net>.
DocRand is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
DocRand is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
You should have received a copy of the GNU General Public License along with DocRand. If not, see <https://www.gnu.org/licenses/>.
**************************************/

import { $, DOMElement } from "../dom_design.js";
import { div } from "./div.js";
import { header } from "./header.js";
import { footer } from "./footer.js";
import { content } from "./content.js";
import { LClass } from "../level.js";
import { MOBILE_KEYBOARD } from "../../ressources/simple-keyboard/mobile_keyboard.js";

export class stage extends div {
  private $h: header = new header(
    this.valid.bind(this),
    this.setLevel.bind(this)
  );
  private $c: content = new content();
  private $f: footer = new footer();
  private QUE: LClass;
  private current_level: number = -1;
  private KBD: MOBILE_KEYBOARD = new MOBILE_KEYBOARD();
  private scale: number;
  private LBL: DOMElement;
  private BTN: DOMElement;
  private is_valid_step: boolean;
  private is_cache: boolean = false;
  private time: number = 0;
  private interval: number = 0;

  constructor() {
    super();
    const s = window.$SETTINGS.stage;
    this.KBD.setWidth(s.width);
    this.stl(`position:absolute;width:${s.width}px;`);
    $("body").add(this.dom());
    this.add(this.$h);
    let d = $.div()
      .att(`id:content_footer_wrapper`)
      .stl(`position:absolute;left:0px;top:0px`)
      .add(this.$c.dom())
      .add(this.$f.dom())
      .add(
        $.div()
          .att(`id:chrono_countdown`)
          .stl(
            `position:absolute;display:none;left:0px;top:0px;width:100%;height:100%;min-height:300px`
          )
      )
      .add(
        $.div()
          .att(`id:chrono_progress_bar`)
          .stl(
            `position:absolute;left:0px;top:0px;height:5px;width:0px;background:#ff8c1a`
          )
      )
      .add(
        $.div()
          .att(`id:chrono_start_cache`)
          .stl(
            `position:absolute;display:none;left:0px;top:0px;width:100%;height:100%;min-height:300px;background:${s.chrono.cache.background}`
          )
          .add(
            $.create("a")
              .att(`id:chrono_start_btn`)
              .stl(
                `position:absolute;font-family:sans-serif;font-size:${s.chrono.cache.fontsize2}px;padding:8px 25px;border-radius:5px;border:0;cursor:pointer;text-align:center;background:#1eaad0;color:white;font-weight:bold;bottom:30px;left:50%;transform:translate(-50%,0)`
              )
              .inner("Démarrer !")
              .enter(() => $("#chrono_start_btn").stl(`background:#8cd4f5`))
              .out(() => $("#chrono_start_btn").stl(`background:#1eaad0`))
              .up(this.startChrono.bind(this))
          )
          .add(
            $.div()
              .att(`id:chrono_start_txt`)
              .stl(
                `position:absolute;left:50%;top:0px;width:90%;margin-top:40px;transform:translate(-50%,0);text-align:justify;font-family:sans-serif;font-size:${s.chrono.cache.fontsize1}px;`
              )
          )
      );
    let snp = $.div()
      .att(`id:snapshot_wrapper`)
      .stl(`position:absolute;left:0px;top:0px`);
    this.dom().add(
      $.div()
        .att(`id:swipe_wrapper`)
        .stl(`position:relative;display:block;width:${s.width}px`)
        .add(d)
        .add(snp)
    );
    document.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        this.valid();
      }
      if (!this.is_valid_step) {
        e.preventDefault();
        e.stopPropagation();
      }
    });

    // window.$START_LEVEL correspond au paramètre "level" passé éventuellement
    // à index.php. Si le paramètre "level" n'est pas passé au php,
    // window.$START_LEVEL vaut 1 :
    const btns = $("#top_banner").findAll("#level_button");
    if (window.$START_LEVEL > 0 && window.$START_LEVEL <= btns.length) {
      this.setLevel(window.$START_LEVEL);
      const L = window.$START_LEVEL - 1;
      if (L !== 0) {
        const prf = window.$SETTINGS.header.levels.button;
        btns[0].getValue().selected = false;
        btns[0].stl(`background:${prf.background};color:${prf.color}`);
        btns[L].getValue().selected = true;
        btns[L].stl(
          `background:${prf.select_background};color:${prf.select_color}`
        );
      }
    } else {
      this.setLevel(1);
    }

    if (this.KBD.isMobileDevice())
      document.addEventListener("swiped-left", this.valid.bind(this));
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
  }

  private makeSnapshot() {
    let bnd = $("#content_footer_wrapper").dom().getBoundingClientRect();
    $("#snapshot_wrapper").inner($("#content_footer_wrapper").dom().innerHTML);
    let inps_dest = $("#snapshot_wrapper").findAll("#input_html_element");
    let inps_srce = $("#content_footer_wrapper").findAll("#input_html_element");
    for (var i = 0; i < inps_dest.length; i++) {
      let i_dest = inps_dest[i].dom() as HTMLInputElement;
      let i_srce = inps_srce[i].dom() as HTMLInputElement;
      i_dest.value = i_srce.value;
    }
  }

  private swipeLeft() {
    let t = 0.4;
    let ww = window.innerWidth / this.scale;
    $("#content_footer_wrapper").stl(`left:${ww}px`);
    $("#swipe_wrapper").stl(`left:50%`);
    $("#swipe_wrapper").stl(
      `left:0px;transition:${t}s ease-in-out;transform:translate(${-ww}px,${0}px)`
    );
    setTimeout(() => {
      $("#swipe_wrapper").stl(`transition:unset;transform:unset;left:0px`);
      $("#content_footer_wrapper").stl(`left:0px`);
      $("#snapshot_wrapper").inner("");
    }, t * 1000);
  }

  private landscape_message() {
    if (this.KBD.isMobileDevice()) {
      const ttime = 0.3;
      if ($("body").findAll("landscape_message_cache").length === 0) {
        $("body").add(
          $.div()
            .att("id", "landscape_message_cache")
            .stl(
              `position:fixed;z-index:1000;left:0px;top:0px;width:0;height:0;background-color:#00000000;display:none;transition:all ${ttime}s ease-in-out`
            )
            .down(function (e) {
              e.preventDefault();
              e.stopPropagation();
            })
            .inner(``)
            .add(
              $.div()
                .stl(
                  `position:absolute;width:80%;display:block;left:50%;top:50%;transform:translate(-50%,-50%)`
                )
                .add(
                  $.create("img")
                    .att(`src:./ressources/images/lanscape_message.svg`)
                    .stl(`display:block;max-width:40%;margin:0 auto`)
                )
                .add(
                  $.div()
                    .stl(
                      `display:block;color:#AAA;margin:0 auto;margin-top:20px;font-family:sans-serif;font-size:28px;font-weight:lighter;text-align:center`
                    )
                    .inner("Veuillez mettre votre appareil<br>en mode portrait")
                )
            )
        );
      }
      this.is_cache = window.innerWidth > window.innerHeight;
      if (this.is_cache) {
        const ww = window.innerWidth;
        const wh = window.innerHeight;
        $("#landscape_message_cache").stl(
          `display:block;width:${ww}px;height:${wh}px`
        );
        $("body").stl(`overflow-y:hidden`);
        setTimeout(() => {
          $("#landscape_message_cache").stl(`background-color:#000000EE;`);
        }, 1);
      } else {
        $("#landscape_message_cache").hide().stl(`background-color:#00000000;`);
        $("body").stl(`overflow-y:auto`);
      }
    }
  }

  private resize() {
    this.landscape_message();
    const s = window.$SETTINGS.stage;
    // const dw = window.innerWidth;
    const dw = document.body.clientWidth;
    const ww = Math.min(dw, 900);
    this.scale = ww / s.width;
    let stls = `left:${
      (dw - ww) / 2
    }px;top:0px;transform-origin:top left;transform:scale(${this.scale})`;
    this.stl(stls);
    $(`#top_banner`).stl(stls);
    if (this.KBD.isMobileDevice()) {
      this.KBD.dom.stl(
        `left:${(dw - ww) / 2}px;transform-origin:bottom left;transform:scale(${
          this.scale
        })`
      );
      $(`#student_answer_footer`).stl(
        `margin-bottom:${this.KBD.dom.height() / this.scale}px`
      );
    }
  }

  private getQUE(_m: number) {
    return new window.$PLUGIN[window.$LEVELS[_m]]();
  }

  private setLevel(_n?: number) {
    let new_level: boolean = this.current_level !== _n;
    if (typeof _n === "undefined") _n = this.current_level;
    this.current_level = _n;

    this.makeSnapshot();

    this.QUE = this.getQUE(_n - 1);

    this.is_valid_step = true;
    this.$c.setLevel(this.QUE);
    this.$f.setLevel(this.QUE);

    this.KBD.actualise({
      elt: $("#student_inputs").dom(),
      options: {},
      exit_proc: this.valid.bind(this),
    });
    if (new_level) {
      clearInterval(this.interval);
      $("#chrono_progress_bar").hide().stl(`width:0px`);
      $("#chrono_countdown").hide();
      $("#chrono_start_cache").hide();
      this.$h.setLevel(this.QUE);
      if (this.QUE.getCHRONO() > 0) {
        $(`#chrono_start_txt`).inner(
          `<img src="./ressources/images/chrono.png" style="max-width:120px;float:right;padding-left:10px"/>Ce niveau de jeu est chronométré. Tu as ${this.QUE.getCHRONO()} secondes pour répondre à chacune des ${this.QUE.getNB()} questions de ce niveau.<br><br>Clique sur le bouton ci-dessous pour commencer :`
        );
        $(`#chrono_start_cache`).show();
        this.KBD.hide();
      }
    }
    setTimeout(this.swipeLeft.bind(this), 1);
  }

  private valid() {
    if (this.is_cache) return;
    clearInterval(this.interval);
    $("#chrono_progress_bar").hide().stl(`width:0px`);
    $("#chrono_countdown").hide();
    $("#chrono_start_cache").hide();
    window.scrollTo(0, 0);
    this.is_valid_step = !this.is_valid_step;
    if (this.is_valid_step) {
      // On a cliqué sur "Suite"
      if (this.QUE.getCHRONO() > 0) {
        this.start_progress_bar();
      }
      if (this.$h.no_more_dots()) this.$h.setLevel(this.QUE);
      this.setLevel(this.current_level);
    } else {
      // On a cliqué sur "Valid"
      this.KBD.setDefault(["      ", "      {next}"]);
      let chk = this.QUE.check();
      if (chk) {
        this.$c.show_youwin();
      } else {
        this.$c.show_youfail(this.QUE);
      }
      if (this.$h.mark_dot(chk)) {
        this.endLevel();
      }
      if (this.QUE.getCHRONO() > 0)
        this.interval = setInterval(this.valid.bind(this), 1500);
    }
  }

  private startChrono() {
    $(`#chrono_start_cache`).hide();
    this.countdown();
  }

  private progress_bar() {
    let d = Date.now();
    let pc = (0.1 * (d - this.time)) / this.QUE.getCHRONO();
    $("#chrono_progress_bar").stl(`width:${pc}%`);
    if (pc > 100) this.valid();
  }

  private start_progress_bar() {
    clearInterval(this.interval);
    $("#chrono_progress_bar").show();
    this.time = Date.now();
    this.interval = setInterval(this.progress_bar.bind(this), 5);
  }

  private countdown() {
    let $COUNTDOWN_START = 3;
    let $COUNTDOWN_SIZE =
      this.QUE.question() === ""
        ? 220
        : (Math.min(
            $(`#content_footer_wrapper`).width(),
            $(`#content_footer_wrapper`).height()
          ) -
            80) /
          this.scale;
    let $COUNTDOWN_FONTSIZE = (3 * $COUNTDOWN_SIZE) / 4;
    let $INTERVAL = 0;
    let $TIME = 0;
    let getRandomLightColor = function () {
      let color = "#";
      for (let i = 0; i < 3; i++)
        color += (
          "0" +
          Math.floor(((1 + Math.random()) * Math.pow(16, 2)) / 2).toString(16)
        ).slice(-2);
      return color;
    };
    let interval = function () {
      let t = (Date.now() - $TIME) / 1000;
      let count = $COUNTDOWN_START - Math.ceil(t) + 1;
      if (t < $COUNTDOWN_START) {
        $("#countdown_cache").stl(
          `top:${$COUNTDOWN_SIZE * (t / $COUNTDOWN_START)}px`
        );
        if (
          (<HTMLElement>$("#countdown_circle").dom()).innerText !==
          "" + count
        ) {
          $("#chrono_countdown").stl(
            `background-color:${getRandomLightColor()}`
          );
          $("#countdown_circle").inner("" + count);
        }
      } else {
        // ON QUITTE LE COUNTDOWN :
        this.KBD.show();
        clearInterval($INTERVAL);
        $("#countdown_back").remove();
        $("#countdown_circle").remove();
        $("#chrono_countdown").stl(`background-color:#fafafa`).inner("").hide();
        this.start_progress_bar();
        const inps = this.$f.dom().findAll("#input_html_element");
        if (inps.length > 0) inps[0].dom().focus();
      }
    };
    let s = document.documentElement.style;
    s.setProperty("--circle", `${$COUNTDOWN_SIZE}px`);
    s.setProperty("--count-fontsize", `${$COUNTDOWN_FONTSIZE}px`);
    $("#chrono_countdown").add(
      $.div().att("id:countdown_back").add($.div().att("id:countdown_cache"))
    );
    $("#chrono_countdown").add(
      $.div()
        .att("id:countdown_circle")
        .inner("" + $COUNTDOWN_START)
    );
    $TIME = Date.now();
    $INTERVAL = setInterval(interval.bind(this), 5);
    $("#chrono_countdown")
      .stl(`background-color:${getRandomLightColor()}`)
      .show();
  }

  private endLevel() {
    const ttime = 0.3;
    const p = window.$SETTINGS.stage;
    if ($("body").findAll("dom_design_dialog_cache").length === 0) {
      $("body").add(
        $.div()
          .stl(
            `position:absolute;z-index:1000;left:0px;top:0px;width:100%;height:100%;background-color:#00000000;display:none;transition:all ${ttime}s ease-in-out`
          )
          .att("id", "dom_design_dialog_cache")
          .down(function (e) {
            e.preventDefault();
            e.stopPropagation();
          })
      );
    }
    this.is_cache = true;
    $("#dom_design_dialog_cache")
      .inner("")
      .show()
      .add(
        $.create("div")
          .stl(
            `position:absolute;z-index:1001;left:0%;top:0%;background-color:#F0F0F0;width:0px;height:0px;border-radius:0px;display:inline-block;transform:translate(-50%,-50%);font-family: sans-serif;font-size:0px;color:black;padding:0px;pointer-events:all;overflow:hidden;transition:all ${ttime}s ease-in-out`
          )
          .att("id", "dom_design_dialog_box")
          .add(
            $.div()
              .stl(
                `position:absolute;left:0px;top:10px;width:100%;text-align:center;font-size:${p.dialog.fontsize1}px;font-weight:bold;color:${p.dialog.color1}`
              )
              .inner(p.dialog.text1)
          )
          .add(
            $.div()
              .stl(
                `position:absolute;left:0px;top:60px;width:100%;text-align:center;font-size:${p.dialog.fontsize2}px;color:${p.dialog.color2}`
              )
              .inner(
                `${p.dialog.text2}${this.$h.get_score()} / ${this.QUE.getNB()}`
              )
          )
          .add(
            $.create("a")
              .att(`id:dom_design_dialog_btn`)
              .stl(
                `position:absolute;width:80px;height:30px;right:10px;bottom:10px;line-height:30px;border-radius:5px;border:0;cursor:pointer;font-size:16px;text-align:center;background:#8cd4f5;color:white;font-weight:bold`
              )
              .inner("Ok")
              .up(() => {
                clearInterval(this.interval);
                $("#dom_design_dialog_box").stl(
                  `width:0px;height:0px;border-radius:0px;padding:0px;font-size:0px;top:0%;left:100%`
                );
                $("#dom_design_dialog_cache").stl(`background-color:#00000000`);
                setTimeout(() => {
                  $("#dom_design_dialog_cache").hide();
                  this.is_cache = false;
                }, ttime * 1000);
                this.$h.display_score(this.current_level - 1);
              })
              .enter(() =>
                $("#dom_design_dialog_btn").stl(`background:#1eaad0`)
              )
              .out(() => $("#dom_design_dialog_btn").stl(`background:#8cd4f5`))
          )
      );
    setTimeout(() => {
      $("#dom_design_dialog_cache").stl(`background-color:#000000AA`);
      $("#dom_design_dialog_box").stl(
        `width:300px;height:120px;border-radius:8px;padding:20px;font-size:20px;top:50%;left:50%`
      );
    }, 1);
  }
}

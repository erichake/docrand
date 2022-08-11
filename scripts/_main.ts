import "./prototypes.js";
import { $ } from "./dom_design.js";
import { stage } from "./dom_elements/stage.js";
import { $PREFS } from "./preferences.js";

export class main {
  constructor() {
    new stage();
  }

  static start() {
    $.getScript("./ressources/swiped-events/swiped-events.js", () => {
      $.getCSS("./ressources/simple-keyboard/simple-keyboard.css", () => {
        $.getCSS("./ressources/simple-keyboard/mobile_keyboard.css", () => {
          $.getScript("./ressources/simple-keyboard/simple-keyboard.js", () => {
            $.getKaTeX(function () {
              const path = location.href.split("/index.php?")[0];
              window.$PLUGIN =
                `import {LClass,RD} from "${path}/scripts/level.js";` +
                window.$PLUGIN;
              const enc_plugin = encodeURIComponent(window.$PLUGIN);
              const dataUri =
                "data:text/javascript;charset=utf-8," + enc_plugin;
              // console.log(window.$PLUGIN);
              let aa = import(dataUri)
                .then((obj) => {
                  window.$PLUGIN.replace(
                    /export\s*class\s*(\w+)\s*extends\s/gm,
                    function (a: any, m: string) {
                      window.$LEVELS.push(m);
                      return "";
                    }
                  );
                  window.$PLUGIN = obj;

                  const isObject = (item: any) => {
                    return (
                      item && typeof item === "object" && !Array.isArray(item)
                    );
                  };

                  const mergeDeep = function (
                    target: any,
                    ...sources: any
                  ): any {
                    if (!sources.length) return target;
                    const source = sources.shift();
                    if (isObject(target) && isObject(source)) {
                      for (const key in source) {
                        if (isObject(source[key])) {
                          if (!target[key])
                            Object.assign(target, {
                              [key]: {},
                            });
                          mergeDeep(target[key], source[key]);
                        } else {
                          Object.assign(target, {
                            [key]: source[key],
                          });
                        }
                      }
                    }
                    return mergeDeep(target, ...sources);
                  };

                  window.$SETTINGS = mergeDeep(
                    $PREFS,
                    window.$PLUGIN.general_settings
                  );

                  new main();
                  document.title = (<HTMLDivElement>(
                    $.div().inner(window.$SETTINGS.title.text).dom()
                  )).innerText;
                })
                .catch((e) => {
                  // top.location.href = `${path}/error.html?wrongFILE`;
                  console.log("*** ERREUR DANS LE MODULE ***");
                  console.log(e);
                });
            });
          });
        });
      });
    });
  }
}

main.start();

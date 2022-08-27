/***************************************
This file is part of DocRand <https://docrand.dgpad.net>.
DocRand is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
DocRand is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
You should have received a copy of the GNU General Public License along with DocRand. If not, see <https://www.gnu.org/licenses/>.
**************************************/
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
                                `import {LClass,RD,CUT,GCD,SVG} from "${path}/scripts/level.js";` +
                                    window.$PLUGIN;
                            const enc_plugin = encodeURIComponent(window.$PLUGIN);
                            const dataUri = "data:text/javascript;charset=utf-8," + enc_plugin;
                            // const dataUri =
                            //   "data:text/javascript;base64," + btoa(window.$PLUGIN);
                            // console.log(window.$PLUGIN);
                            let aa = import(dataUri)
                                .then((obj) => {
                                window.$PLUGIN.replace(/export\s*class\s*(\w+)\s*extends\s/gm, function (a, m) {
                                    window.$LEVELS.push(m);
                                    return "";
                                });
                                window.$PLUGIN = obj;
                                const isObject = (item) => {
                                    return (item && typeof item === "object" && !Array.isArray(item));
                                };
                                const mergeDeep = function (target, ...sources) {
                                    if (!sources.length)
                                        return target;
                                    const source = sources.shift();
                                    if (isObject(target) && isObject(source)) {
                                        for (const key in source) {
                                            if (isObject(source[key])) {
                                                if (!target[key])
                                                    Object.assign(target, {
                                                        [key]: {},
                                                    });
                                                mergeDeep(target[key], source[key]);
                                            }
                                            else {
                                                Object.assign(target, {
                                                    [key]: source[key],
                                                });
                                            }
                                        }
                                    }
                                    return mergeDeep(target, ...sources);
                                };
                                window.$SETTINGS = mergeDeep($PREFS, window.$PLUGIN.general_settings);
                                new main();
                                document.title = ($.div().inner(window.$SETTINGS.title.text).dom()).innerText;
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

/**
 * Created by nachasic on 04.08.2016.
 */

/* eslint no-sync: 0,
          no-prototype-builtins: 0 */
"use strict";

var yml = require("js-yaml"),
    fs = require("fs");

var cfg = ( function () {
    var confFile = "",
        defaultConfig = {
            name: "Mah fukked up blogh",
            description: "Prescription for mah fukked up blogh",
            author: "Sick bastard",
            excerptLength: 50
        },

        entries = function *(obj) {
            for (const key of Object.keys(obj)) {
                yield [key, obj[key]];
            }
        },

        override = (object, overrider) => {
            var result = {};

            for (const [key, value] of entries(object)) {
                if (overrider.hasOwnProperty(key)) {
                    console.log(key);
                    result[key] = overrider[key];
                } else {
                    result[key] = value;
                }
            }

            return result;
        };

    try {
        confFile = yml.load( fs.readFileSync("config.yml", "UTF-8") );

        return override(defaultConfig, confFile);
    } catch (err) {
        console.log(err);

        return defaultConfig;
    }
}() );

module.exports = cfg;
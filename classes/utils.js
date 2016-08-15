/**
 * Created by nachasic on 15.08.16.
 */
"use strict";

const config = require("./load-config");

const utils = (function () {
    var Utils = {},

        entries = function *(obj) {
            for (const key of Object.keys(obj)) {
                yield [key, obj[key]];
            }
        },
        dropKeys = (object) => {
            const result = [];

            for (const [key, entry] of Utils.entries(object)) {
                if (typeof entry === "object") {
                    result.push(Object.assign(entry, {number: key}));
                } else {
                    result.push(entry, {number: key});
                }
            }
        };

    // Iterate through object properties
    Utils.entries = entries;

    Utils.getCalendarSorting = (collection) => {
        const years = {};

        for (const [stub, entry] of entries(collection)) {
            const date = new Date(entry.date),
                year = date.getFullYear(),
                month = date.getMonth(),
                day = date.getDate(),
                meta = Object.assign(entry, { stub: stub });

            if (meta.markup) {
                delete meta.markup;
            }

            if (!years[year]) {
                years[year] = {};
            }

            if (!years[year][month]) {
                years[year][month] = {};
            }

            if (!years[year][month][day]) {
                years[year][month][day] = [];
            }

            years[year][month][day].push(meta);
        }

        return years;
    };

    Utils.excerpt = (text) => `${text.split(" ").slice(0, config.excerptLength).join(" ")}...`;

    return Utils;
}());

module.exports = utils;


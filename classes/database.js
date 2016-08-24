/**
 * Created by nachasic on 23.08.16.
 */
/* eslint no-sync: 0 */

"use strict";

const Datastore = require("nedb"),
    config = require("./load-config"),
    fs = require("fs");

class DBCollection {
    constructor (name) {
        this.name = name;
        this.filepath = `./${config.dataBasePath}/${name}.db`;
        this.store = new Datastore({
            filename: this.filepath
        });
        this.collection = [];
    }

    get filePath () {
        return this.filepath;
    }

    get byDate () {
        return this.sortByDate();
    }

    get byTitle () {
        return this.sortByTitle();
    }

    get collect () {
        return this.collection;
    }

    load () {
        return new Promise( (resolve, reject) => {
            this.store.loadDatabase( (err) => {
                if (err) {
                    reject(err);
                }

                resolve(this);
            } );
        } );
    }

    check (catalog) {
        return new Promise( (resolve, reject) => {
            this.find({})
                .then( (collection) => {
                    if (collection.collect.length > 0) {
                        for (const item of collection.collect) {
                            try {
                                fs.accessSync(`${catalog}/${item.stub}/config.yml`, fs.f_OK);
                            } catch (err) {
                                // there is no file for the item
                                collection.removeOne(item)
                                    .then(console.log)
                                    .catch(reject);
                            }
                        }
                    }

                    resolve(this);
                } );
        } );
    }

    find (query) {
        return new Promise( (resolve, reject) => {
            this.store.find(query, (err, docs) => {
                if (err) {
                    reject(err);
                }
                this.collection = docs;

                resolve(this);
            });
        } );
    }

    findOne (query) {
        return new Promise( (resolve, reject) => {
            this.store.findOne(query, (err, doc) => {
                if (err) {
                    reject(err);
                }
                this.collection = [doc];

                resolve(this);
            });
        } );
    }

    removeOne (query) {
        return new Promise( (resolve, reject) => {
            this.store.remove(query, {}, (err, numRemoved) => {
                if (err) {
                    reject(err);
                }

                resolve(numRemoved);
            });
        } );
    }

    update (query, update, options) {
        return new Promise( (resolve, reject) => {
            this.updateTimeStamp();

            this.store.update(query, update, options, (err, numAffected, affectedDocs, upsert) => {
                if (err) {
                    reject(err);
                }

                resolve({
                    numAffected,
                    affectedDocs,
                    upsert
                });
            });
        } );
    }

    sortByDate () {
        this.collection.sort( (one, other) => one.date - other.date );

        return this;
    }

    sortByTitle () {
        this.collection.sort( (one, other) => one.title - other.title );

        return this;
    }

    // A timestamp file that is used to determine newly-changed posts or stories
    updateTimeStamp () {
        fs.writeFileSync(`./${config.timestampsPath}/${this.name}.txt`, new Date(), config.encoding);
    }
}

const DB = function (collections) {
    const db = {};

    for (const collection of collections) {
        db[collection] = new DBCollection(collection);
    }

    db.check = (collection) => new Promise( (resolve, reject) => {
        collection.check()
            .then(resolve)
            .catch(reject);
    } );

    return db;
};

module.exports = DB;
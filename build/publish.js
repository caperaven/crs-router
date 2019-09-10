const fs = require("fs");
const mkdirp = require("mkdirp");
const glob = require("glob");
const path = require("path");
const babel = require('@babel/core');
const minifyPreset = require('babel-preset-minify');

class Publish {
    static async distribute() {
        const instance = new Publish();
        instance.copyFiles("./src/**/*.*");
        instance.bumpVersion();
    }
    
    constructor() {
        mkdirp.sync(path.resolve("./publish"));
    }

    async copyFiles(query) {
        const files = await this.getFiles(query);
        for (let file of files) {
            const target = path.dirname(file).split("./").join("./publish/");
            const fileName = path.basename(file);
            this.initFolder(target);
            //fs.copyFileSync(file, `${target}/${fileName}`);
            const code = fs.readFileSync(file);

            const result = babel.transformSync(code, {
                minified: true,
                sourceType: "module",
                configFile: false,
                presets: [[minifyPreset]],
                plugins: ["@babel/plugin-syntax-dynamic-import"]
            });

            fs.writeFileSync(`${target}/${fileName}`, result.code);
        }
    }

    initFolder(folder) {
        mkdirp.sync(path.resolve(folder));
    }

    getFiles(query) {
        return new Promise((resolve, reject) => {
            const o = {};

            glob(query, o, (error, files) => {
                if (error) {
                    console.error(error);
                    reject(error);
                }

                resolve(files);
            });
        });
    }

    bumpVersion() {
        const sourcePackage = `${path.resolve(".")}/package.json`;
        const targetPackage = `${path.resolve(".")}/publish/package.json`;

        const content = fs.readFileSync(sourcePackage, "utf8");
        const pkg = JSON.parse(content);
        const version = pkg.version;
        const isPre = version.indexOf("-pre") > -1;
        const preConstants = ["", "-pre"];

        const versions = version.split(".");
        versions[2] = versions[2].replace("-pre", "");
        versions[2] = Number(versions[2]) + 1;
        pkg.version = `${versions.join(".")}${preConstants[+ isPre]}`;

        fs.writeFileSync(sourcePackage, JSON.stringify(pkg, null, 4), "utf8");
        fs.copyFileSync(sourcePackage, targetPackage);
    }
}

Publish.distribute();
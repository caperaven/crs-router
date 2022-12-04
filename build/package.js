/**
 * Build script using deno
 * https://droces.github.io/Deno-Cheat-Sheet/
 */

import { copy, emptyDir, ensureDir } from "https://deno.land/std@0.149.0/fs/mod.ts";
import * as esbuild from 'https://deno.land/x/esbuild@v0.14.50/mod.js'
import init, {minify} from "https://wilsonl.in/minify-html/deno/0.9.2/index.js";

const encoder = new TextEncoder();
const decoder = new TextDecoder();
await init();

async function createFolderStructure() {
    await ensureDir("./dist");
    await emptyDir("./dist");
}

async function packageDirectory(def, loader, format, minified) {
    for (const dir of def.dir) {
        for await (const dirEntry of Deno.readDir(dir)) {
            if (dirEntry.isDirectory) {
                continue;
            }

            const sourceFile = `${dir}/${dirEntry.name}`;

            let targetFile = `${def.target}${dir}/${dirEntry.name}`;
            let keys = Object.keys(def.replace || {});
            for (const key of keys) {
                targetFile = targetFile.replace(key, def.replace[key]);
            }

            await packageFile(sourceFile, targetFile, loader, format, minified);
        }
    }
}

async function packageFiles(def, loader, format, minified) {
    for (const file of def.files) {
        const target = file.replace("./src", "./dist");
        await packageFile(file, target, loader, format, minified);
    }
}

async function packageFile(sourceFile, targetFile, loader, format, minified) {
    const src = await Deno.readTextFile(sourceFile);
    const result = await esbuild.transform(src, { loader: loader, minify: minified, format: format });
    await Deno.writeTextFile(targetFile, result.code);
}

async function packageMarkup(sourceFile, targetFile, minified) {
    let src = await Deno.readTextFile(sourceFile);

    if (minified == true) {
        src = src
            .split("\t").join("")
            .split("\r").join("")
            .split("\n").join("")
            .split(" ").join("");
    }

    await Deno.writeTextFile(targetFile, src);
}

async function packageHTML(sourceFile, targetFile, minified) {
    let src = await Deno.readTextFile(sourceFile);

    if (minified == true) {
        src = decoder.decode(minify(encoder.encode(src), { minify_css: true, minify_js: true, do_not_minify_doctype: true, keep_closing_tags: true }));
    }

    await Deno.writeTextFile(targetFile, src);
}

async function bundleJs(file, output, minified) {
    const result = await esbuild.build({
        entryPoints: [file],
        bundle: true,
        outfile: output,
        format: "esm",
        minify: minified
    })

    console.log(result);
}

async function bundleCss(file, output, minified) {
    const result = await esbuild.build({
        entryPoints: [file],
        bundle: true,
        loader: {".css": "css"},
        outfile: output,
        minify: minified
    })

    console.log(result);
}
await createFolderStructure();

const minimize = false;

await packageHTML("./src/crs-loader.html", "./dist/crs-loader.html", minimize);
await packageFile("./src/crs-loader.js", "./dist/crs-loader.js", "js", "esm", minimize);
await packageFile("./src/crs-router.js", "./dist/crs-router.js", "js", "esm", minimize);
await packageFile("./src/crs-static-provider.js", "./dist/crs-static-provider.js", "js", "esm", minimize);
await packageFile("./src/crs-url-provider.js", "./dist/crs-url-provider.js", "js", "esm", minimize);
await packageFile("./src/crs-utils.js", "./dist/crs-utils.js", "js", "esm", minimize);

Deno.exit(0);

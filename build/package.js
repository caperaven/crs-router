import { emptyDir, ensureDir } from "https://deno.land/std@0.149.0/fs/mod.ts";
import * as esbuild from 'https://deno.land/x/esbuild@v0.14.50/mod.js'

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

/**
 * Save the html/css/json file to the target and minify it if required
 * @param sourceFile
 * @param targetFile
 * @param minified
 * @returns {Promise<void>}
 */
async function packageMarkup(sourceFile, targetFile, minified) {
    let src = await Deno.readTextFile(sourceFile);

    if (minified == true) {
        src = src
            .split(" ").join("")
            .split("\t").join("")
            .split("\r").join("")
            .split("\n").join("");
    }

    await Deno.writeTextFile(targetFile, src);
}

async function bundle(file, output) {
    const result = await esbuild.build({
        entryPoints: [file],
        bundle: true,
        outfile: output,
        format: "esm",
        minify: true
    })

    console.log(result);
}


await createFolderStructure();

await packageMarkup("./src/crs-loader.html", "./dist/crs-loader.html", true);
await packageFile("./src/crs-loader.js", "./dist/crs-loader.js", "js", "esm", true);
await packageFile("./src/crs-router.js", "./dist/crs-router.js", "js", "esm", true);
await packageFile("./src/crs-static-provider.js", "./dist/crs-static-provider.js", "js", "esm", true);
await packageFile("./src/crs-url-provider.js", "./dist/crs-url-provider.js", "js", "esm", true);
await packageFile("./src/crs-utils.js", "./dist/crs-utils.js", "js", "esm", true);

Deno.exit(0);

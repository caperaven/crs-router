import { assert, assertEquals } from "https://deno.land/std@0.168.0/testing/asserts.ts";
import { loadHTML, loadViewModel } from "./../src/loaders.js";

globalThis.fetch = async (url) => {
    let result = "";
    if (url === "/root/view/view.html") {
        result = "<h2>Hello World</h2>"
    }
    else {
        result = "h2 { background: blue }"
    }

    return {
        text: () => result
    }
}

Deno.test("loadHTML", async () => {
    const html = await loadHTML("view", "root", true);
    assertEquals(typeof html, "string");
    assert(html.includes('<style>'));
    assert(html.includes('</style>'));
    assert(html.includes('h2 { background: blue }'));
    assert(html.includes('<h2>Hello World</h2>'));

    const htmlWithoutStyle = await loadHTML("view", "root", false);
    assertEquals(typeof htmlWithoutStyle, "string");
    assert(!htmlWithoutStyle.includes('<style>'));
    assert(!htmlWithoutStyle.includes('</style>'));
    assert(!htmlWithoutStyle.includes('h2 { background: blue }'));
    assert(htmlWithoutStyle.includes('<h2>Hello World</h2>'));
});
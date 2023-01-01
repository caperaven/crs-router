import { assertEquals } from "https://deno.land/std@0.168.0/testing/asserts.ts";
import { getParameters } from "./../src/parameters.js";

Deno.test("getParameters with query parameters", async () => {
    window.location = { hash: "#foo?param1=value1&param2=value2" };
    const result = await getParameters();
    assertEquals(result, {
        hash: "#foo",
        parameters: {
            param1: "value1",
            param2: "value2",
        },
    });
});

Deno.test("getParameters with slash parameters", async () => {
    window.location = { hash: "#foo/param1/value1/param2/value2" };
    const result = await getParameters();
    assertEquals(result, {
        hash: "#foo",
        parameters: {
            param1: "value1",
            param2: "value2",
        },
    });
});

Deno.test("getParameters with no parameters", async () => {
    window.location = { hash: "#foo" };
    const result = await getParameters();
    assertEquals(result, {
        hash: "#foo",
        parameters: {},
    });
});

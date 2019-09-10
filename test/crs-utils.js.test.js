import {getHashParameters} from "./../src/crs-utils.js";

test('getHashParameters hash only', async () => {
    const result = await getHashParameters("#about");
    assertBasics(result, "#about", "#about");
});

test('getHashParameters with parameters', async () => {
    const result = await getHashParameters("#about?p1=v1&p2=v2");
    assertBasics(result, "#about?p1=v1&p2=v2", "#about");

    expect(result.parameters).not.toBe(null);
    expect(result.parameters.p1).toBe("v1");
    expect(result.parameters.p2).toBe("v2");
});

function assertBasics(result, url, hash) {
    expect(result).not.toBe(null);
    expect(result.url).toBe(url);
    expect(result.hash).toBe(hash);
}
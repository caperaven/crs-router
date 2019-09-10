export async function getHashParameters(hash) {
    const parts = hash.split("?");
    const result = {
        url: hash,
        hash: parts[0]
    };

    if (parts.length == 1) return result;

    const parameters = {};
    const props = parts[1].split("&");
    for (let prop of props) {
        const p = prop.split("=");
        parameters[p[0]] = p[1];
    }

    result.parameters = parameters;
    return result;
}

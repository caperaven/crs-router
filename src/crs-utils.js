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

export function getRouteParameters(hash, def) {
    const parts = hash.split("/");
    const result = {
        url: hash,
        hash: parts[0]
    };

    const parameters = {};
    for (let i = 1; i < parts.length; i++) {
        const name = i <= def.routeParameters.length ? def.routeParameters[i - 1] : `param${i}`;
        const value = parts[i];
        parameters[name] = value;
    }

    result.parameters = parameters;
    return result;
}
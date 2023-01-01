export async function getParameters() {
    if (window.location.hash.indexOf("?") !== -1) {
        return getQueriedParameters();
    }

    if (window.location.hash.indexOf("/") !== -1) {
        return getSlashedParameters();
    }

    return {
        hash: window.location.hash,
        parameters: {}
    }
}

function getQueriedParameters() {
    const parts = window.location.hash.split("?");

    const result = {
        hash: parts[0],
        parameters: {}
    }

    if (parts.length > 1) {
        parseParameters(result, parts[1]);
    }

    return result;
}

function parseParameters(result, url) {
    const parts = url.split("&");
    for (const part of parts) {
        if (part.indexOf("=") === -1) {
            result.parameters[part] = "";
            continue;
        }

        const property = part.split("=");
        result.parameters[property[0]] = property[1];
    }
}

function getSlashedParameters() {
    const parts = window.location.hash.split("/");

    const result = {
        hash: parts[0],
        parameters: {}
    }

    for (let i = 1; i < parts.length -1; i += 2) {
        result.parameters[parts[i]] = parts[i + 1];
    }

    return result;
}
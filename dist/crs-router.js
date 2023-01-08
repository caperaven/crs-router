// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

async function getParameters() {
    if (window.location.hash.indexOf("?") !== -1) {
        return getQueriedParameters();
    }
    if (window.location.hash.indexOf("/") !== -1) {
        return getSlashedParameters();
    }
    return {
        hash: window.location.hash,
        parameters: {}
    };
}
function getQueriedParameters() {
    const parts = window.location.hash.split("?");
    const result = {
        hash: parts[0],
        parameters: {}
    };
    if (parts.length > 1) {
        parseParameters(result, parts[1]);
    }
    return result;
}
function parseParameters(result, url) {
    const parts = url.split("&");
    for (const part of parts){
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
    };
    for(let i = 1; i < parts.length - 1; i += 2){
        result.parameters[parts[i]] = parts[i + 1];
    }
    return result;
}
async function findRoute(data, hash) {
    return data.routes.find((item)=>item.hash === hash);
}
async function loadHTML(view, root, hasStyle) {
    const path = `/${root}/${view}/${view}.html`;
    const stylePath = `/styles/views/${view}.css`;
    const html = await fetch(path).then((result)=>result.text());
    const css = hasStyle === false ? "" : `<style>${await fetch(stylePath).then((result)=>result.text())}</style>`;
    return `${css}${html}`;
}
async function loadViewModel(view, root, element) {
    const path = `/${root}/${view}/${view}.js`;
    const instance = new (await import(path)).default();
    instance.element = element;
    return instance;
}
class Router extends HTMLElement {
    #data;
    #viewModel;
    #hashChangedHandler = this.#hashChanged.bind(this);
    async connectedCallback() {
        await this.#loadRoutes();
        window.addEventListener("hashchange", this.#hashChangedHandler);
        if (window.location.href.indexOf("#") === -1) {
            window.location.href = `#${this.#data.default}`;
        } else {
            await this.#hashChanged();
        }
    }
    async disconnectedCallback() {
        window.removeEventListener("hashchange", this.#hashChangedHandler);
        this.#data = null;
    }
    async #loadRoutes() {
        const path = this.getAttribute("routes") || "/app/routes.json";
        this.#data = await fetch(path).then((result)=>result.json());
    }
    async #hashChanged() {
        if (this.#data["auto-hide"] == true) {
            this.style.visibility = "hidden";
        }
        await this.#disposeViewModel();
        const parameters = await getParameters();
        const route = await findRoute(this.#data, parameters.hash);
        const html = await loadHTML(route?.view || "404", this.#data.root, route?.["hasStyle"] === true);
        this.innerHTML = html;
        if (route == null) return;
        for (const jsPath of route?.["js"] || []){
            await import(jsPath);
        }
        if (route?.["htmlOnly"] === true) {
            this.style.visibility = "";
            return;
        }
        this.#viewModel = await loadViewModel(route?.view, this.#data.root, this);
        this.#viewModel.title = route.title;
        requestAnimationFrame(async ()=>{
            this.#viewModel.resources = parameters;
            await this.#viewModel?.connectedCallback?.();
            this.style.visibility = "";
        });
    }
    async #disposeViewModel() {
        if (this.#viewModel != null) {
            delete this.#viewModel.element;
            await this.#viewModel.disconnectedCallback?.();
            this.#viewModel = null;
        }
    }
}
customElements.define("crs-router", Router);

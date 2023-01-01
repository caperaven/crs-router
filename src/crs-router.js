import {getParameters} from "./parameters.js";
import {findRoute} from "./routes.js";
import {loadHTML, loadViewModel} from "./loaders.js";

class Router extends HTMLElement {
    #data;
    #viewModel;
    #hashChangedHandler = this.#hashChanged.bind(this);

    async connectedCallback() {
        await this.#loadRoutes();
        window.addEventListener("hashchange", this.#hashChangedHandler);

        if (window.location.href.indexOf("#") === -1) {
            window.location.href = `#${this.#data.default}`;
        }
        else {
            await this.#hashChanged();
        }
    }

    async disconnectedCallback() {
        window.removeEventListener("hashchange", this.#hashChangedHandler);
        this.#data = null;
    }

    async #loadRoutes() {
        const path = this.getAttribute("routes") || "/app/routes.json";
        this.#data = await fetch(path).then(result => result.json());
    }

    async #hashChanged() {
        if (this.#data["auto-hide"] == true) {
            this.style.visibility = "hidden";
        }

        await this.#disposeViewModel();

        const parameters = await getParameters();
        const route = await findRoute(this.#data, parameters.hash);
        const html = await loadHTML(route?.view || "404", this.#data.root, route["hasStyle"] === true);

        for (const jsPath of route["js"] || []) {
            await import(jsPath);
        }

        this.innerHTML = html;

        if (route["htmlOnly"] === true) {
            this.style.visibility = "";
            return;
        }

        this.#viewModel = await loadViewModel(route?.view, this.#data.root, this);

        requestAnimationFrame(async () => {
            this.#viewModel.resources = parameters;
            await this.#viewModel?.connectedCallback?.();
            this.style.visibility = "";
        })
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
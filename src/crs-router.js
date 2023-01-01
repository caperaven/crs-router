import {getParameters} from "./parameters.js";
import {findRoute} from "./routes.js";
import {getHTML} from "./html.js";

class Router extends HTMLElement {
    #data;
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
        const parameters = await getParameters();
        const route = await findRoute(this.#data, parameters.hash);
        const html = await getHTML(route?.view || "404", this.#data.root);

        this.innerHTML = html;
    }
}


customElements.define("crs-router", Router);
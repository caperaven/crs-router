import {getHashParameters} from "./crs-utils.js";

export class Router extends HTMLElement {
    async connectedCallback() {
        await this._loadRoutes();

        const providerModule = this.routesDef["auto-nav"] == true ? "./crs-url-provider.js" : "./crs-static-provider.js";
        const module = await import(providerModule);
        this._provider = new module.NavigationProvider(this);
    }

    disconnectedCallback() {
        this.routesDef = null;
        this._provider.dispose();
        this._provider = null;
    }

    async goto(view, parameters, prop = "view") {
        const def = this.routesDef.routes.find(item => item[prop] === view);

        if (def == null) {
            return this._loadView({
                "title": "404",
                "hash": "#404",
                "view": "404",
                "html-only": true
            });
        }

        await this._loadView(def);

        if (this.viewModel != null) {
            this.viewModel["element"] = this;

            this.viewModel.parameters = parameters || await getHashParameters(window.location.hash).parameters;
            this.viewModel.connectedCallback && this.viewModel.connectedCallback();

            if (this.viewModel.parameters != null) {
                this.viewModel.parametersChanged && this.viewModel.parametersChanged(this.viewModel.parameters);
            }
        }
    }

    async _loadRoutes() {
        const path = this.getAttribute("routes") || "/app/routes.json";
        return fetch(path).then(result => result.text()).then(text => this.routesDef = JSON.parse(text));
    }


    async _loadView(def) {
        if (this.viewModel != null) {
            this.viewModel.disconnectedCallback && this.viewModel.disconnectedCallback();
            this.viewModel.element = null;
            this.viewModel = null;
        }

        const root = this.routesDef.root || "app";
        const html = await fetch(`/${root}/${def.view}/${def.view}.html`).then(result => result.text());
        this.innerHTML = html;

        if (def["html-only"] != true) {
            const module = await import(`/${root}/${def.view}/${def.view}.js`);
            this.viewModel = new module.default();
        }
    }
}

customElements.define("crs-router", Router);
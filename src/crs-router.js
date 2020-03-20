import {getHashParameters, getRouteParameters} from "./crs-utils.js";

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
        const fn = view.indexOf("/") == -1 ? getHashParameters : getRouteParameters;

        if (view.indexOf("/") != -1) {
            view = view.split("/")[0];
        }
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

            this.viewModel.parameters = parameters || await fn(window.location.hash, def).parameters;
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
        if (this.routesDef["auto-hide"] == true) {
            this.style.visibility = "hidden";
        }

        if (this.viewModel != null) {
            this.viewModel.disconnectedCallback && this.viewModel.disconnectedCallback();

            this.viewDisposedCallback && this.viewDisposedCallback(this.viewModel);

            delete this.viewModel.element;
            delete this.viewModel;
        }

        const root = this.routesDef.root || "app";

        let html;
        let style = "";

        const promises = [];
        promises.push(fetch(`/${root}/${def.view}/${def.view}.html`).then(result => result.text()).then(text => html = text));

        if (def.hasStyle === true) {
            promises.push(fetch(`/styles/views/${def.view}.css`).then(result => result.text()).then(text => style = `<style>${text}</style>`));
        }

        await Promise.all(promises).then(async () => {
            this.innerHTML = `${style}\n${html}`;

            if (def["html-only"] != true) {
                const module = await import(`/${root}/${def.view}/${def.view}.js`);
                const instance = new module.default();
                this.viewModel = this.viewCreatedCallback != null ? this.viewCreatedCallback(instance) : instance;
                this.viewModel.element = this;
                this.viewModel.title = def.title;
            }
            else {
                this.style.visibility = "";
            }
        });
    }
}

customElements.define("crs-router", Router);
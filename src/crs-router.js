import {getHashParameters, getRouteParameters} from "./crs-utils.js";
import "./crs-loader.js";

export class Router extends HTMLElement {
    async connectedCallback() {
        this._loader = document.createElement("crs-loader");

        this.showLoader(false);
        document.documentElement.appendChild(this._loader);

        await this._loadRoutes();

        const providerModule = this.routesDef["auto-nav"] == true ? "./crs-url-provider.js" : "./crs-static-provider.js";
        const module = await import(providerModule);
        this._provider = new module.NavigationProvider(this);

        requestAnimationFrame(() => {
            this._rect = this.getBoundingClientRect();
            this._loader.style.left = `${(this._rect.width / 2) - 30}px`;
            this._loader.style.top = `${this._rect.top + 100}px`;
        })

        this.dispatchEvent(new CustomEvent("ready"));
    }

    disconnectedCallback() {
        this.routesDef = null;
        this._provider.dispose();
        this._provider = null;
        this._loader = null;
        this._rect = null;
    }

    showLoader(visible) {
        this._loader.style.display = visible == true ? "" : "none";
    }

    async goto(view, parameters, prop = "view") {
        let loading = true;

        const timeout = setTimeout(() => {
            clearTimeout(timeout);
            if (loading == true) {
                this.showLoader(true);
            }
        }, 200)


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
            this.viewModel.connectedCallback && await this.viewModel.connectedCallback();

            if (this.viewModel.parameters != null) {
                this.viewModel.parametersChanged && this.viewModel.parametersChanged(this.viewModel.parameters);
            }

            this.viewModel.showScreen && this.viewModel.showScreen();
        }

        loading = false;
        this.showLoader(false);
    }

    async _loadRoutes() {
        const path = this.getAttribute("routes") || "/app/routes.json";
        return fetch(path).then(result => result.text()).then(text => this.routesDef = JSON.parse(text));
    }

    async _loadView(def) {
        const prefix = document.body.dataset.appPath || "";

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

        let resObj = null;
        if (def.resources != null) {
            resObj = {};
            for (let resource of def.resources) {
                promises.push(fetch(`${prefix}/${root}/${def.view}/${resource.path}`).then(result => result[resource.type || "text"]()).then(bytes => resObj[resource.name] = bytes));
            }
        }

        if (def.js != null) {
            promises.push(this._loadTempJS(def.js));
        }

        promises.push(fetch(`${prefix}/${root}/${def.view}/${def.view}.html`).then(result => result.text()).then(text => html = text));

        if (def.hasStyle === true) {
            promises.push(fetch(`${prefix}/styles/views/${def.view}.css`).then(result => result.text()).then(text => style = `<style>${text}</style>`));
        }

        await Promise.all(promises).then(async () => {
            this.innerHTML = `${style}\n${html}`;

            if (def["html-only"] != true) {
                const module = await import(`${prefix}/${root}/${def.view}/${def.view}.js`);
                const instance = new module.default();
                this.viewModel = this.viewCreatedCallback != null ? this.viewCreatedCallback(instance) : instance;
                this.viewModel.element = this;
                this.viewModel.title = def.title;
            }
            else {
                this.style.visibility = "";
            }

            if (resObj != null) {
                this.viewModel.resources = resObj;
            }
        });
    }

    async _loadTempJS(urlCollection) {
        for (let url of urlCollection) {
            if (document.head.querySelector(`script[src="${url}"]`)) {
                continue;
            }

            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;
            script.type = "module";
            document.head.appendChild(script);
        }
    }
}

customElements.define("crs-router", Router);
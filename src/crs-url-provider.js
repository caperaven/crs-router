import {getHashParameters} from "./crs-utils.js";

export class NavigationProvider {
    constructor(router) {
        this._router = router;
        this._hashChangedHandler = this._hashChanged.bind(this);
        window.addEventListener("hashchange", this._hashChangedHandler, false);

        const hash = window.location.hash.trim();
        if (hash == "#" || hash == "") {
            this._setUrl(this._router.routesDef.default).then(() => this._router.goto(this._router.routesDef.default));
        }
        else {
            this._hashChanged({
                oldURL: "",
                newURL: window.location.href
            })
        }
    }

    dispose() {
        delete this._router;
    }

    async _hashChanged(event) {
        if (this.mute == true) return delete this.mute;

        const oldHashParts = await getHashParameters(this._getHashFromString(event.oldURL));
        const newHashParts = await getHashParameters(this._getHashFromString(event.newURL));

        if (this._router.viewModel && this._router.viewModel.canLeave && this._router.viewModel.canLeave(newHashParts.hash, newHashParts.parameters) == false) {
            this.mute = true;
            return window.location.hash = oldHashParts.url;
        }

        if (this._router.viewModel && oldHashParts.hash == newHashParts.hash) {
            this._router.viewModel.parameters = newHashParts.parameters;
            this._router.viewModel.parametersChanged && this._router.viewModel.parametersChanged(this._router.viewModel.parameters);
        }
        else {
            this._router.goto(newHashParts.hash, newHashParts.parameters, "hash");
        }
    }

    async _setUrl(view) {
        const def = this._router.routesDef.routes.find(item => item.view === view);

        let hash = [def.hash];
        if (def.parameters) {
            hash.push("?");

            for (let [key, value] of Object.entries(def.parameters)) {
                hash.push(`${key}=${value}`);
            }
        }

        window.location.hash = hash.join("");
    }

    _getHashFromString(url) {
        return url.substr(url.indexOf("#"), url.length)
    }
}
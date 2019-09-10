export class NavigationProvider {
    constructor(router) {
        this._router = router;
        this._mutationHandler = this._mutation.bind(this);
        this._observer = new MutationObserver(this._mutationHandler);
        this._observer.observe(this._router, {attributes: true});
        this._router.setAttribute("view", this._router.routesDef.default);
    }

    dispose() {
        delete this._router;
        this._observer.disconnect();
        this._observer = null;
        this._mutationHandler = null;
    }

    async _mutation(mutationsList) {
        for (let mutation of mutationsList) {
            if (mutation.attributeName === "view") {
                const view = this._router.getAttribute("view");
                await this._router.goto(view);
            }
        }
    }
}
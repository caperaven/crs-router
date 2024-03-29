export default class SubRoute {
    connectedCallback() {
        this.select = this.element.querySelector("select");

        this.navHandler = this.nav.bind(this);
        this.select.addEventListener("change", this.navHandler);
        this.router = this.element.querySelector("crs-router");
    }

    disconnectedCallback() {
        this.select.removeEventListener("change", this.navHandler);
        this.select = null;
        this.router = null;
    }

    nav(event) {
        this.router.goto(event.target.value);
    }

    showScreen() {
        this.element.style.visibility = ""
    }
}
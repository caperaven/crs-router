export class Loader extends HTMLElement {
    connectedCallback() {
        fetch(import.meta.url.replace(".js", ".html")).then(result => result.text()).then(html => this.innerHTML = html);
    }
}

customElements.define("crs-loader", Loader);
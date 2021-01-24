class TestComponent extends HTMLElement {
    connectedCallback() {
        this.innerText = "Custom Test Component loaded via routes.json"
    }
}
customElements.define("test-component", TestComponent);


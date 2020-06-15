export default class Welcome {
    connectedCallback() {
        console.log(this.resources);
    }

    parametersChanged(params) {
        console.log(params);
    }

    showScreen() {
        this.element.style.visibility = ""
    }
}
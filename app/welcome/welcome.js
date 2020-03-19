export default class Welcome {
    connectedCallback() {
        this.element.style.visibility = ""
    }

    disconnectedCallback() {
        console.log("disconnected");
    }

    parametersChanged(params) {
        console.log(params);
    }
}
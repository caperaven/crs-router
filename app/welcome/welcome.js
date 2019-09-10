export default class Welcome {
    connectedCallback() {
    }

    disconnectedCallback() {
        console.log("disconnected");
    }

    parametersChanged(params) {
        console.log(params);
    }
}
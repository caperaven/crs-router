export default class Welcome {
    parametersChanged(params) {
        console.log(params);
    }

    showScreen() {
        this.element.style.visibility = ""
    }
}
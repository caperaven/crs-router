export default class About {
    connectedCallback() {
        this.element.style.visibility = ""
    }

    canLeave(hash, parameters) {
        return hash === "#wel";
    }
}
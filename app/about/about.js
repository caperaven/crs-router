export default class About {
    canLeave(hash, parameters) {
        return hash === "#wel";
    }

    showScreen() {
        this.element.style.visibility = ""
    }
}
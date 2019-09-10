export default class About {
    connectedCallback() {
        console.log("connected")
    }

    disconnectedCallback() {
        console.log("disconnected");
    }

    canLeave(hash, parameters) {
        return hash === "#wel";
    }
}
export class MutationObserverMock {
    observe(element, options) {
        return true;
    }

    disconnect() {
        return true;
    }
}

export class ElementMock {
    setAttribute(attr, value) {
        return true;
    }

    getAttribute(attr) {
        return "welcome";
    }
}

export function fetchMock() {

}
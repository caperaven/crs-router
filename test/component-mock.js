import {ElementMock} from "./dom-mocks.js";

export class RouterMock extends ElementMock {
    constructor() {
        super();
        this.goto = jest.fn();
        this.viewModel = {
            parametersChanged: jest.fn()
        }
    }

    async _loadView(def) {
        return true;
    }

    async _loadRoutes() {
        this.routesDef = {
            "default": "welcome",
            "root": "app",
            "auto-nav": true,
            "routes": [
                {
                    "title": "Welcome",
                    "hash": "#welcome",
                    "view": "welcome",
                    "parameters": {
                        "id": 100,
                        "test": "test-value"
                    }
                },
                {
                    "title": "About",
                    "hash": "#about",
                    "view": "about",
                    "parameters": {
                        "id": 100
                    }
                }]
        }
    }
};
const jsonResult = `
{
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
}`;


global.customElements = {
    define() {
        return true;
    }
};

let instance;

beforeEach(async () => {
    global.HTMLElement = class {
    };

    global.window = {
        addEventListener: () => true,
        location: {
            hash: "#welcome"
        }
    };

    const module = await import("./../src/crs-router.js");
    instance = new module.Router();
});

test("crs-router lifecycle", async () => {
    await basicSetup();

    expect(instance._provider).not.toBeNull();
    expect(instance.routesDef).not.toBeNull();

    instance.disconnectedCallback();
    expect(instance.routesDef).toBeNull();
    expect(instance._provider).toBeNull();
});

test("crs-router goto 404", async () => {
   await basicSetup();
   const result = await instance.goto("notthere", {p1: "v1"});
});

async function basicSetup() {
    global.HTMLElement.prototype.getAttribute = (attrName) => {
        if (attrName == "routes") {
            return "./routes.json";
        }
    };

    global.fetch = () => new Promise((resolve) => {
        resolve({
            text: () => jsonResult
        });
    });

    jest.mock('/app/welcome/welcome.js', () => {
        return class {
        }
    });

    instance.viewModel = {
        element: {},
        disconnectedCallback: () => null,
        parametersChanged: () => true
    };

    await instance.connectedCallback().catch(error => throw new Error(error));
}
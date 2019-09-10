import {MutationObserverMock} from "./dom-mocks.js";
import {RouterMock} from "./component-mock.js";
import {NavigationProvider} from "../src/crs-url-provider.js";

let instance;
let router;

beforeEach(async () => {
    global.window = {
        addEventListener: jest.fn(),
        location: {
            hash: "#welcome"
        }
    };

    router = new RouterMock();
    await router._loadRoutes();
    instance = new NavigationProvider(router)
});

afterEach(() => {
    jest.clearAllMocks();
    instance.dispose();
    instance = null;
});

test("crs-url-provider constructor", () => {
    expect(window.addEventListener).toBeCalled();
    expect(true).toBe(true);
});

test("crs-url-provider _getHashFromString", () => {
    const result = instance._getHashFromString("http://127.0.0.1/#about");
    expect(result).toBe("#about");
});

test("crs-url-provider _setUrl", () => {
    instance._setUrl("welcome").catch(error => throw new Error(error));
    expect(window.location.hash).toBe("#welcome?id=100test=test-value");
});

test("crs-url-provider _hashChanged mute should exit", () => {
    instance.mute = true;
    instance._hashChanged(null).catch(error => throw new Error(error));
});

test("crs-url-provider _hashChanged new url", async () => {
    const event = {
        oldURL: "http://127.0.0.1/#about",
        newURL: "http://127.0.0.1/#welcome?p1=v1"
    };

    await instance._hashChanged(event).catch(error => throw new Error(error));
    expect(router.goto).toBeCalled();
    router.goto.mockClear();
});

test("crs-url-provider _hashChanged same url", async () => {
    const event = {
        oldURL: "http://127.0.0.1/#about",
        newURL: "http://127.0.0.1/#about?p1=v1"
    };

    router.viewModel.parameters = null;

    await instance._hashChanged(event).catch(error => throw new Error(error));
    expect(router.viewModel.parameters).not.toBeNull();

    router.goto.mockClear();
    router.viewModel.parametersChanged.mockClear();
});

test("crs-url-provider _hasChanged canLeave is true", async () => {
    const event = {
        oldURL: "http://127.0.0.1/#about",
        newURL: "http://127.0.0.1/#about?p1=v1"
    };
    router.viewModel.canLeave = () => false;
    await instance._hashChanged(event).catch(error => throw new Error(error));

    expect(window.location.hash).toBe("#about");
});
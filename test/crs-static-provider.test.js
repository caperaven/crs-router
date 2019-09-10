import {NavigationProvider} from "./../src/crs-static-provider.js"
import {MutationObserverMock} from "./dom-mocks.js";
import {RouterMock} from "./component-mock.js";

let instance;
let router;

beforeEach(async () => {
    global.MutationObserver = MutationObserverMock;
    router = new RouterMock();
    await router._loadRoutes();
    instance = new NavigationProvider(router)
});

afterEach(() => {
    instance.dispose();
    instance = null;
});

test("Static NavigationProvider _mutation", () => {
    const mutationList = [{
        attributeName: "view"
    }];

    instance._mutation(mutationList);
    expect(router.goto).toBeCalled();
});
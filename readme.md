# CRS router
This is a vanilla web component quickly enabling loading of views in SPA applications.

## Install

```
npm install --save crs-router
```

## Usage
Since this is a web component, add html markup in the location your require the routing to take place.

```html
<crs-router routes="app/routes.json"></crs-router>
```

The routes parameter is optional.  
If you leave it out, it defaults to "/app/routes.json".

Load the web component script to ensure the custom element is registered.

```html
<script type="module">
    import "/path-to-component/crs-router.esm.js";
</script> 
```

The app folder is a default convention on where to locate view files.   
This can however be overwritten in the routes.json file using the root property.

## Setting up navigation

You need the following for the routing to work.

1. A router json file that defines that routes are available.
1. Views following the view convention to navigate too.

## Views

Views are made up from:

1. view-name.html
1. view-name.js

In the route json file you defined the root folder.
In that route folder create a directory with the same name as the view-name.
In that folder place your view js and html files.

For example:   
/app/welcome/welcome.js  
/app/welcome/welcome.html  

You need to have a 404 view in your app folder that contains the 404.js and 404.html file.

Not all views have view models.  
If you have a static html file that you just want to render, you can mark the view as "html-only".
There are some examples in the sub routes section showing this.

### View javascript
```js
export default class Welcome {
    connectedCallback() {
        console.log("connected");
    }

    disconnectedCallback() {
        console.log("disconnected");
    }

    parametersChanged(params) {
        console.log(params);
    }
}
```

As you can see from the code above, the view javasript looks very much like that of a custom web component.  
You have some basic lifecycle events:

1. connectedCallback
1. disconnectedCallback

If you want be notified when url parameters change, add the parametersChanged function.
The params parameter is a object literal where the property name is the parameter and the property value is the parameter value.

This for a url like this:
```
http://127.0.0.1:8000/#wel?id=100&name=me
```

the params object will be.

```Javascript
{
    id: "100",
    name: "me"
}
```

Please note that the class is exported as default.

There are some cases when you want access to the HTML element that is the view of the given view model.
Each view model has a element property that you can query the view's content on.

```js
    this.element.querySelector(...);
```

### View html
There is nothing special about the view HTML, just add the HTML you want to display.

```html
<h2>Welcome</h2>

<p>
    This is a welcome page that displays welcome information
</p>
```

## Routes.json

Here is a example of a routes json file

```json
{
  "default": "welcome",
  "root": "app",
  "auto-nav": true,
  "auto-hide": true,
  "routes": [
    {
      "title": "Welcome",
      "hash": "#wel",
      "view": "welcome",
      "hasStyle": true,
      "parameters": {
        "id": 100
      }
    },
    {
      "title": "About",
      "hash": "#about",
      "view": "about"
    }
  ]
}
```

1. default - what is the default view to load when the router is initialized
1. root - what is the folder path where the views in this configuration's routes can be found
1. auto-nav - auto navigate on url change
1. auto-hide - if you want to process the view before displaying it, set auto hide to true. this sets visibility to hidden when routes change and you must set it to visible manually. This only applies if the view is NOT html only.
1. routes - definition of what routes are available

## Auto nav

When the auto-nav property is set to true, it will monitor the url of the browser and automatically perform navigation when the url changes.
If it is false it will no, and you need to perform navigation in one of two ways.

1. Set the view attribute on the component to the view name
1. Use the goto function on the component passing on the new name as a parameter.

In most cases you want to set auto-nave to true. 

## Sub routes

Let say I want to define a sub route. 
My main view is a view called subroute in the app folder.  
This subroute folder contains the following file structure.

```
/app/
/app/subroute/
/app/subroute/subroute.js
/app/subroute/subroute.html
/app/subroute/routes.json
/app/sburoute/views/
/app/subroute/views/sr1/
/app/subroute/views/sr1/sr1.js
/app/subroute/views/sr1/sr1.html
```

The routes.json for in the subroute folder looks like this:

```json
{
  "default": "sr1",
  "root": "app/subroute/views",
  "routes": [
    {
      "title": "Sub Route 1",
      "view": "sr1",
      "parameters": {
        "id": 100
      }
    },
    {
      "title": "Sub Route 2",
      "view": "sr2",
      "html-only": true
    },
    {
      "title": "Sub Route 3",
      "view": "sr3",
      "html-only": true
    }
  ]
}
```

A HTML example for subroute.html 

```html
<h2>Main subroute view</h2>
<select>
    <option value="sr1">Sub route 1</option>
    <option value="sr2">Sub route 2</option>
    <option value="sr3">Sub route 3</option>
</select>

<crs-router routes="/app/subroute/routes.json"></crs-router>
```

Making a selection in the select:

```js
nav(event) {
    this.element.querySelector("crs-router").goto(event.target.value);
}
```

So the values of the select match the route's view property.

### Route parameters

The parameters property defined in the route defines default parameters for the route.
This is not required in the routes.json file.

if you implement the "parametersChanged" function as shown above, this will be called when the navigation occurs and pass the URL parameters to the view.

### Html only

Not all views need logic, static html pages are also supported in the navigation.
Since this router is convention driven it will ask for a javascript file unless you tell it explicitly that this is html only.

See the "Sub Route 2" and "Sub Route 3" routes as examples of this.

## Prevent route change
There are cases when you don't want to navigate away from your current view or you only allow navigating back to a expected route.
To do this you can add a function to your view model.

```js
export default class About {
    canLeave(hash, parameters) {
        return hash === "#wel";
    }
}
```

If "canLeave" returns false navigation will not happen.
So if your data is in a dirty state and you want the user to first save before they leave the view, this is how you would do that.
 
## Example
You can find a example application on github.  
https://github.com/caperaven/crs-router-example

If you have any feature requests or bug reports you are welcome to post them there.

## Styles
If you have a style for the view you can set the `hasStyle` property on the route to true.  
This will look for a style sheet at "/styles/views/[viewname].css".  
For example, a view of "details" should have a style at "/styles/views/details.css".
This css is loaded and added to the HTML before it is loaded.
This allows you to have granular control over styles while preventing any style popping that may happen during style loading delays. 

## Route parameters
So up to this point we have been looking at features using a standard parameterised url using `?`.
You can also use route definitions using `/`;

```
http://127.0.0.1:8000/#myView/myresource/100
```

To make this work you will need to define routeParameters in the json definition of the route.json file.

```json
{
  "title": "Details",
  "hash": "#details",
  "view": "details",
  "routeParameters": ["resourceName", "resourceId"]
}
```

The parametersChanged function still functions as expected where you will get the following object back

```json
{
  "resourceName": "myresource",
  "resourceId": "100"
}
```

if you add additional parameters in the url that is not defined in the json file it will also be added in the parameterised changed but as `parameter`;
So if you use this url
```
http://127.0.0.1:8000/#myView/myresource/100/a
```
you will be given
```json
{
  "resourceName": "myresource",
  "resourceId": "100",
  "parameter3": "a"
}
```

## Loading resources

You can load additional resources during the view load process.
This can be anything and is often used for resources required for the view to properly operate.  
Such an example is contextual menu's that you want to display on a global toolbar apart from the main view.  

To load these additional resources, add a resource object to the route definition, same as you would do with the parameters.

```js
"resources": [
    {
      "name": "menu",
      "path": "menu.html",
      "type": "text"
    }
]
```

The properties of the definition are:

1. name - name of the property on the resource object
1. path - relative to the view folder what file should be loaded. Note that this is only forwards so the "./../" syntax will not work.
1. type - this is the "fetch" api function that is used during the loading process. `text()`, `blob()` ... see fetch api for details.

The loading process waits for all the resources to be done before it will uses the connectedCallback.
This means that you can access the resources object of the view model at connectedCallback.

```js
connectedCallback() {
    console.log(this.resources);
}
```

## Loading js files

If you have a static html only page and it contains web components you can either load them at startup or define them in the route def.  
Adding it to the route def loads it only when you move that that route.  

Add the following to the root def.
```js
"js": [
    "/components/test-component.js"
]
```

If this has been loaded before it will not be loaded again.  
The browser retains the definition in memory anyway, so we keep the script reference in the header as removing it will not help much.
Once the page is refreshed using the browser's refresh button the context will be removed.  
In that case when you navigate back to the page that requires the component, it will be loaded again.

It does not have to be a component, it can also be a library file you require.
#Bare metal web router
This is a vanilla web component quickly enabling loading of views in SPA applications.

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

The last but important part to note about the view javascript is that the class is expoted as default.

```js
{
    id: "100",
    name: "me"
}
```

### View html
There is nothing special about the view HTML, just add the HTML you want to display.

```html
<h2>Welcome</h2>

<p>
    This is a welcome page that displays welcome information
</p>
```

## routes.json

Here is a example of a routes json file

```json
{
  "default": "welcome",
  "root": "app",
  "auto-nav": true,
  "routes": [
    {
      "title": "Welcome",
      "hash": "#wel",
      "view": "welcome",
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
1. auto-nav - when navigating too this view should the parameters be populated in the url as defined in te configuration
1. routes - definition of what routes are available

## sub routes

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

### route parameters

The parameters property defined in the route defines default parameters for the route.
This is not required in the routes.json file.

if you implement the "parametersChanged" function as shown above, this will be called when the navigation occurs and pass the URL parameters to the view.

### html-only

Not all views need logic, static html pages are also supported in the navigation.
Since this router is convention driven it will ask for a javascript file unless you tell it explicitly that this is html only.

See the "Sub Route 2" and "Sub Route 3" routes as examples of this.

 
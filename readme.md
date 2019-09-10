#Bare metal web router

Please note that this component is free for non commercial use.

This is a vanilla web component quickly enabling loading of views in SPA applications.

## Usage

Since this is a web component, add html markup in the location your require the routing to take place.

```html
<bmc-router routes="app/routes.json"></bmc-router>
```

The routes parameter is optional.  
If you leave it out, it defaults to "app/routes.json".

Load the web component script to ensure the custom element is registered.

```html
<script type="module">
    import "/path-to-component/crs-router.js";
</script> 
```

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

 
react-es6-isomorphic
====================

![image](http://dev.topheman.com/wp-content/uploads/2015/04/logo-reactjs.png)

*UPDATE :* Facebook released [react@0.14.0](https://facebook.github.io/react/blog/2015/10/07/react-v0.14.html), so I upgraded [topheman/react-es6](https://github.com/topheman/react-es6) and this project with the latest version (also upgraded react-router - which was the most of the work).

This project is the isomorphic version of [topheman/react-es6](https://github.com/topheman/react-es6), which contains all the front-end part (UI in React ...) and was coded so that it could be executed in both client and server side (shared components, routes, services ...)

The backend is based on [topheman/topheman-apis-proxy](https://github.com/topheman/topheman-apis-proxy) which provides the github API.

Techs involved :

* React (client and server side rendering)
* ES6 (using Webpack for bundling)
* ExpressJS as node server framework

If you want to go further, read the [blog post](http://dev.topheman.com/react-es6-isomorphic/) about this project.

### Setup

#### Install

```shell
git clone https://github.com/topheman/react-es6-isomorphic.git
cd react-es6-isomorphic
npm install
```

You'll have to install the [topheman-apis-proxy](https://github.com/topheman/topheman-apis-proxy) backend, follow the [installation steps](https://github.com/topheman/topheman-apis-proxy#installation) README section.

#### Run

A set of npm tasks are configured in the package.json to help you.

I'll try to automate even more, but with that, you'll be able to have your API server (topheman-apis-proxy), your expressJS server AND the webpack dev server managing client side assets (js, css) with sourceMaps.

Those npm task are based on the env var `NODE_ENV` which accepts `PROD`/`MOCK`/`DEV`, but this var is abstracted by the tasks.

##### Dev mode

Open three terminal tabs : two in the react-es6-isomorphic project folder, one in the topheman-apis-proxy project folder.

* Tab 1 react-es6-isomorphic : `npm run webpack-dev` (will launch the webpack dev server, serving the front assets in live reloading)
* Tab 2 react-es6-isomorphic : `npm run server-dev` (will launch the express server on port 9000, monitored by nodemon which will restart the server on pretty much any file changes - since there is server side rendering)
* Tab 3 topheman-apis-proxy : `grunt serve` (see more in the [run in local](https://github.com/topheman/topheman-apis-proxy#run-in-local) README section)

#####Mock mode

You can run the project offline (without topheman-apis-proxy), a set of requests are mocked (not all of them, still wip), it will also be usefull for unit tests in continuous integration :

* Tab 1 react-es6-isomorphic : `npm run webpack-mock` (will launch webpack dev server, serving the front assets in live reloading)
* Tab 2 react-es6-isomorphic : `npm run server-mock` (will launch the express server on port 9000, monitored by nodemon)

##### Prod mode

`npm run server-prod` will build the assets via webpack in production mode and then launch the express server in production mode.

Use it to check if the project behaves OK in production mode before delivering (note that my production server of topheman-apis-proxy won't accept xhr because of cors constraints in this case).

##### Finally

Open [http://localhost:9000](http://localhost:9000/)


#### Build

The client-side code is written in ES6 with modules that work as well on the client as on the server (like React, superagent ...).

* client-side : a bundle is made with webpack and accessible either via the webpack dev server, or written inside `/build` folder
* server-side : `require('babel/register')` lets me use those es6 modules without any transpiling step (babel does it itself on the fly, I don't have to worry about it)

I also made a set of npm tasks for the build step, that creates a bundle inside the `/build` folder (including js, sass to css, images ...)

`npm run webpack-build` will build the assets to `/build` (with sourcemaps and all), you can `npm start` after if you want, to check the project without webpack involved.

This task is triggered at `npm postinstall`, since it's based on the `NODE_ENV` variable, it will create the bundle in the correct mode.

### Deploy

I deploy on heroku, if you don't, you shouldn't have to tweak a lot my routine.

Assuming you've logged in to heroku on the command line and have setup your heroku remote repo :

* Since I make the client-side bundle (js, css builds) at deploy time, the hosting platform will also need the devDependencies (such as webpack) : `heroku config:set NPM_CONFIG_PRODUCTION=false`
* Configure your app in production mode : `heroku config:set NODE_ENV=PROD`
* Then : `git push heroku master`

A tricks I discovered : if you're on a branch and want to deploy to heroku (which ignores anything which is not the master branch) : `git push -f heroku name-of-your-branch:master`

### Contributing

As I stated before, [topheman/react-es6](https://github.com/topheman/react-es6), is the original project, where I'll continue to implement the client-side features - which I will merge into [topheman/react-es6-isomorphic](https://github.com/topheman/react-es6-isomorphic), which is [only about server-side rendering](#contributing).

So, any **client-side related pull-requests** should be done against [topheman/react-es6](https://github.com/topheman/react-es6).

**This repo is only about server-side rendering.** I won't accept pull-requests about client-side features.

### FAQ

This project is still a work in progress, I'm documenting as I'm moving forward.

### License

This software is distributed under an MIT licence.

Copyright 2015 © Christophe Rosset

> Permission is hereby granted, free of charge, to any person obtaining a copy of this software
> and associated documentation files (the "Software"), to deal in the Software without
> restriction, including without limitation the rights to use, copy, modify, merge, publish,
> distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the
> Software is furnished to do so, subject to the following conditions:
> The above copyright notice and this permission notice shall be included in all copies or
> substantial portions of the Software.
> The Software is provided "as is", without warranty of any kind, express or implied, including
> but not limited to the warranties of merchantability, fitness for a particular purpose and
> noninfringement. In no event shall the authors or copyright holders be liable for any claim,
> damages or other liability, whether in an action of contract, tort or otherwise, arising from,
> out of or in connection with the software or the use or other dealings in the Software.
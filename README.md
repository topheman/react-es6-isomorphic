react-es6-isomorphic
====================

![image](http://dev.topheman.com/wp-content/uploads/2015/04/logo-reactjs.png)

*UPDATE :* I made a [blog post](http://dev.topheman.com/react-es6-isomorphic/) if you want to have my feedbacks (this readme is still relevant for the evolution of the project and all the specifics about setup, deployment ...).

This project endgoal is to make an **isomorphic app** (same code for both client and server side). It was built using the following :

* React (client and server side rendering)
* ES6 (using Webpack for bundling)
* ExpressJS as node server framework

###Previous Steps

1. Backend : [topheman/topheman-apis-proxy](https://github.com/topheman/topheman-apis-proxy) : An ExpressJS based server that manages public APIs (and more)
2. Frontend : [topheman/react-es6](https://github.com/topheman/react-es6) : All the frontend part of the app (UI in React ...) was first coded on that repo (and any modifications on the UI part will still be made there - see [contributing section](#contributing))

This previous work has allowed me to achieve my end goal : **create an isomorphic app**. This is what [topheman/react-es6-isomorphic](https://github.com/topheman/react-es6-isomorphic) is about :

* Do an isomorphic app
* Same router on frontend and backend with multiple routes

###Steps :

The frontend code of the app (React components, common services ...), should be reusable, so this project is not about UI development.

Here are the following steps I intend to follow (may change) - should be tagged when stable to keep track of evolution :

- [x] Setup environment - make the following modules / techs work together [v1.0.0](https://github.com/topheman/react-es6-isomorphic/tree/v1.0.0) :
	- [x] Setup express
		- [x] Should serve webpack assets in dev mode / prod mode
		- [x] Should be able to run some ES6 code
		- [x] Make sure the httpService based on superagent works server-side
	- [x] Webpack
		- [x] Ensure build routines
	- [x] npm tasks to launch the server
	- [x] setup deploy routines
- [x] First iteration of server-side rendering [v1.1.0](https://github.com/topheman/react-es6-isomorphic/tree/v1.1.0)
	- [x] Express Router with React Router
	- [x] Server-side render static components based pages
	- [x] Server-side render dynamic components based pages
		- [x] Using the same ES6 service code on server as on client
		- [x] Server-side request to backend to retrieve data
		- [x] Inject data to component state (github user profile page)
- [x] Sync React nodes (not to have re-render) [v1.2.0](https://github.com/topheman/react-es6-isomorphic/tree/v1.2.0)
	- [x] Passing serialized state to the front router
	- [x] Fixed `Warning: render(): Target node has markup rendered by React, but there are unrelated nodes as well. This is most commonly caused by white-space inserted around server-rendered markup.` [by wrapping markup with divs](https://github.com/cvan/taro/issues/28#issuecomment-95694552).
- [x] Update frontend pages [v1.3.0](https://github.com/topheman/react-es6-isomorphic/tree/v1.3.0)
	- [x] correct google analytics
	- [x] changed twitter button message
	- [x] changed some content on frontend component (added about page)
- [ ] Find more elegant way to inject data (maybe [use flux](https://github.com/topheman/react-es6-isomorphic/issues/1) ?)
- [ ] ...

###Setup

####Install

```shell
git clone https://github.com/topheman/react-es6-isomorphic.git
cd react-es6-isomorphic
npm install
```

You'll have to install the [topheman-apis-proxy](https://github.com/topheman/topheman-apis-proxy) backend, follow the [installation steps](https://github.com/topheman/topheman-apis-proxy#installation) README section.

####Run

A set of npm tasks are configured in the package.json to help you.

I'll try to automate even more, but with that, you'll be able to have your API server (topheman-apis-proxy), your expressJS server AND the webpack dev server managing client side assets (js, css) with sourceMaps.

Those npm task are based on the env var `NODE_ENV` which accepts `PROD`/`MOCK`/`DEV`, but this var is abstracted by the tasks.

#####Dev mode

Open three terminal tabs : two in the react-es6-isomorphic project folder, one in the topheman-apis-proxy project folder.

* Tab 1 react-es6-isomorphic : `npm run webpack-dev` (will launch the webpack dev server, serving the front assets in live reloading)
* Tab 2 react-es6-isomorphic : `npm run server-dev` (will launch the express server on port 9000, monitored by nodemon which will restart the server on pretty much any file changes - since there is server side rendering)
* Tab 3 topheman-apis-proxy : `grunt serve` (see more in the [run in local](https://github.com/topheman/topheman-apis-proxy#run-in-local) README section)

#####Mock mode

You can run the project offline (without topheman-apis-proxy), a set of requests are mocked (not all of them, still wip), it will also be usefull for unit tests in continuous integration :

* Tab 1 react-es6-isomorphic : `npm run webpack-mock` (will launch webpack dev server, serving the front assets in live reloading)
* Tab 2 react-es6-isomorphic : `npm run server-mock` (will launch the express server on port 9000, monitored by nodemon)

#####Prod mode

`npm run server-prod` will build the assets via webpack in production mode and then launch the express server in production mode.

Use it to check if the project behaves OK in production mode before delivering (note that my production server of topheman-apis-proxy won't accept xhr because of cors constraints in this case).

#####Finally

Open [http://localhost:9000](http://localhost:9000/)


####Build

The client-side code is written in ES6 with modules that work as well on the client as on the server (like React, superagent ...).

* client-side : a bundle is made with webpack and accessible either via the webpack dev server, or written inside `/build` folder
* server-side : `require('babel/register')` lets me use those es6 modules without any transpiling step (babel does it itself on the fly, I don't have to worry about it)

I also made a set of npm tasks for the build step, that creates a bundle inside the `/build` folder (including js, sass to css, images ...)

`npm run webpack-build` will build the assets to `/build` (with sourcemaps and all), you can `npm start` after if you want, to check the project without webpack involved.

This task is triggered at post-install, since it's based on the `NODE_ENV` variable, it will create the bundle in the correct mode.

###Deploy

I deploy on heroku, if you don't, you shouldn't have to tweak a lot my routine.

Assuming you've logged in to heroku on the command line and have setup your heroku remote repo :

* Since I make the client-side bundle (js, css builds) at deploy time, the hosting platform will also need the devDependencies (such as webpack, grunt ...) : `heroku config:set NPM_CONFIG_PRODUCTION=false`
* Configure your app in production mode : `heroku config:set NODE_ENV=PROD`
* Then : `git push heroku master`

A tricks I discovered : if you're on a branch and want to deploy to heroku (which ignores anything which is not the master branch) : `git push -f heroku name-of-your-branch:master`

###Versionning

As I stated before, [topheman/react-es6](https://github.com/topheman/react-es6), is the original project, where I'll continue to implement the client-side features - which I will re-integrate to [topheman/react-es6-isomorphic](https://github.com/topheman/react-es6-isomorphic), which is [only about server-side rendering](#contributing).

So they'll both produce new versions, new tags.

I decided to tweak a little [semver](http://semver.org/) (forgive me for that) :

* [topheman/react-es6-isomorphic](https://github.com/topheman/react-es6-isomorphic) (this project) will start at version [v1.0.0](https://github.com/topheman/react-es6-isomorphic/tree/v1.0.0) (to keep the previous tags of the history)
* [topheman/react-es6](https://github.com/topheman/react-es6) will continue to live on with its own versionning

###Contributing

For any front-end related questions/infos (about the implementation of the React components, the webpack config ...), please refer to the previous project [topheman/react-es6](https://github.com/topheman/react-es6) which contains a README about it and everything you'll need if you want to run the app in a non-isomorphic way.

**This repo is only about server-side rendering. Any new client-side feature will be develop on [topheman/react-es6](https://github.com/topheman/react-es6) and merged back into.** I won't accept pull-request about client-side features.

For specific customization of client-side code (`/src` folder) or `webbpack.config.js` file, atomic commit will be used and tagged as `[client]` or `[webpack]`, to ease modification identification and merge from [topheman/react-es6](https://github.com/topheman/react-es6).

###FAQ

This project is still a work in progress, I'm documenting as I'm moving forward.

###License

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
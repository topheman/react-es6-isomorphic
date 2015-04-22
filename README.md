react-es6-isomorphic
====================
This project endgoal is to make an **isomorphic app** (same code for both client and server side). It was built using the following :

* React (client and server side rendering)
* ES6 (using Webpack for bundling)
* ExpressJS as node server framework

###Previous Steps

1. Backend : [topheman/topheman-apis-proxy](https://github.com/topheman/topheman-apis-proxy) : An ExpressJS based server that manages public APIs (and more)
2. Frontend : [topheman/react-es6](https://github.com/topheman/react-es6) : All the frontend part of the app (UI in React ...) was first coded on that repo (and any modifications on the UI part will still be made there - see [contributing section](#contributing))

This previous work will allow me to achieve my end goal : **create an isomorphic app**. This is what [topheman/react-es6-isomorphic](https://github.com/topheman/react-es6-isomorphic) is about :

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
- [ ] Sync React nodes (not to have re-render)
- [ ] Find more elegant way to inject data (maybe use flux ?)
- [ ] ...

###Setup

####Install

`npm install grunt-cli -g` (if you don't have it)

```shell
git clone https://github.com/topheman/react-es6-isomorphic.git
cd react-es6-isomorphic
npm install
```

You'll have to install the [topheman-apis-proxy](https://github.com/topheman/topheman-apis-proxy) backend, follow the [installation steps](https://github.com/topheman/topheman-apis-proxy#installation) README section.

####Run

A set of npm tasks are configured in the package.json to help you.

I'll try to automate even more, but with that, you'll be able to have your API server (topheman-apis-proxy), your expressJS server AND the webpack hot reload of the client side assets (js, css) with sourceMaps.

#####Dev mode

Open three terminal tabs : two in the react-es6-isomorphic project folder, one in the topheman-apis-proxy project folder.

* Tab 1 react-es6-isomorphic : `npm run webpack-dev` (will launch webpack in hot reload)
* Tab 2 react-es6-isomorphic : `npm run server-dev` (will launch the express server on port 9000)
* Tab 3 topheman-apis-proxy : `grunt serve` (see more in the [run in local](https://github.com/topheman/topheman-apis-proxy#run-in-local) README section)

#####Mock mode

You can run the project offline (without topheman-apis-proxy), a set of requests are mocked (not all of them, still wip), it will also be usefull for unit tests in continuous integration :

* Tab 1 react-es6-isomorphic : `npm run webpack-mock` (will launch webpack in hot reload)
* Tab 2 react-es6-isomorphic : `npm run server-mock` (will launch the express server on port 9000)

#####Prod mode

To check the behavior in prod mode, you'll have to make the build (more in build section), since it won't be relying on webpack hotreload but on static built assets in the `/build` folder.

1. Tab 1 react-es6-isomorphic : `npm run webpack-build` (will contains sourceMaps, etc ...)
2. Tab 1 react-es6-isomorphic : `npm run server-prod` (will launch the express server on port 9000)
3. Tab 2 `grunt serve` (see more in the [run in local](https://github.com/topheman/topheman-apis-proxy#run-in-local) README section

#####Finally

Open [http://localhost:9000](http://localhost:9000/)


####Build

The client-side code is written in ES6 with modules that work as well on the client as on the server (like React, superagent ...).

* client-side : a bundle is made with webpack and accessible either via its hot-reload dev server, or written inside `/build` folder
* server-side : `require('babel/register')` lets me use those es6 modules without any transpiling step (babel does it itself on the fly, I don't have to worry about it)

I also made a set of npm tasks for the build step, that creates a bundle inside the `/build` folder (including js, sass to css, images ...)

* `npm run webpack-build` : build for dev with sourceMaps
* `npm run webpack-build-prod` : build for the prod (minified, optimized and also, the url of the topheman-apis-proxy instance server is changed, injected directly into the build - [todo write a section here or on the other repo])
* `npm run webpack-build-heroku` : same as above, though, it's using the local grunt-cli (because it's this task which is used on `postinstall` when delivering on heroku, so that the client-side bundle is built when pushing on heroku)

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
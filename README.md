react-es6-isomorphic
=========
This project is a clone of [topheman/react-es6](https://github.com/topheman/react-es6), which was the necessary previous step to this one : create a POC with the following constraints :

* Use React
* Use ES6

This previous work will allow me to achieve my end goal : **create an isomorphic app**. This is what [topheman/react-es6-isomorphic](https://github.com/topheman/react-es6) is about :

* Do an isomorphic app
* Same router on frontend and backend with multiple routes

For any front-end related questions/infos (about the implementation of the React components, the webpack config ...), please refer to the previous project [topheman/react-es6](https://github.com/topheman/react-es6) which contains a README about it and everything you'll need if you want to run the app in a non-isomorphic way.


###Steps :

The frontend code of the app (React components, common services ...), should be reusable, so this project is not about UI development.

Here are the following steps I intend to follow (may change) - should be tagged when stable to keep track of evolution :

- [] Setup environment - make the following modules / techs work together :
	- [] Setup express
		- [] Should serve webpack assets in dev mode / prod mode
		- [] Should be able to run some ES6 code (use node harmony or iojs ?)
		- [] Make sure the httpService based on superagent works server-side
	- [] Webpack
		- [] Ensure build routines
	- [] npm tasks to launch the server
- [] Express Router
	- [] Main view
	- [] Dev / Prod mode (add the webpack reload ?)
	- [] Extract routes from the React router
- [] Inject data into states, prerender
- [] ...

###Setup

####Install

This section will be updated after the first sprints, when the express environment will be setup.

The react-es6-isomorphic part :

`npm install grunt-cli -g` (if you don't have it)

```shell
git clone https://github.com/topheman/react-es6-isomorphic.git
cd react-es6
npm install
```

You'll have to install the [topheman-apis-proxy](https://github.com/topheman/topheman-apis-proxy) backend, follow the [installation steps](https://github.com/topheman/topheman-apis-proxy#installation) README section.

####Run

Section to be filled (will differ from [topheman/react-es6](https://github.com/topheman/react-es6))

####Build

Section to be filled (will differ from [topheman/react-es6](https://github.com/topheman/react-es6))

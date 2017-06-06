# Recruitment Web Application

[![N|Solid](https://www.op.ac.nz/themes/op/images/225x105-op-logo.png)](https://nodesource.com/products/nsolid)
# About
## Technology
This recruitment app uses a number of open source projects to work properly:

* ReactJS
* React-router-dom (React routing v4)
* Babel (for ES6 and JSX)
* Webpack
* Webpack-dev-server
* React-toastify (for toasts)
* PubSub.js (for events)
* Moment (for dates)
* Underscore (for escaping and unescaping HTML Entities)
* Validator (for form validation)


# Development
### Installation

This app requires [Node.js](https://nodejs.org/) to run.

Install the dependencies and dev-dependencies.

```sh
$ yarn install
```

Run webpack to compile and bundle our javascript, compile sass, copy images etc.
The `package.json` has a script `yarn run build`.

```sh
$ yarn run build
```

The app will be available on `localhost:8080`

# Production

### Installation
This app requires [Node.js](https://nodejs.org/) to run.

Install the dependencies and dev-dependencies.

```sh
$ yarn install
```

Run webpack to compile and bundle our javascript, compile sass, copy images etc.
The `package.json` has a script `yarn run build:prod`.

```sh
$ yarn run build:prod
```

The app will be generated under `/dist` folder. The contents of this app can be copied to a server (don't copy `/src` folder). 
Install all the normal dependencies (not dev) on your server using the `package.json` and the command

```sh
$ yarn install --production
`````

To test out the production build you could navigate into the `/dist` folder
```sh
$ cd dist
`````
Here you can run the app. You can choose the port by adding the `-p` flag. 
You will have to have `http-server` globally installed`
```sh
$ http-server -p 3000
`````




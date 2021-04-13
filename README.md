# Betro Web Application

[![Build Status](https://github.com/prijindal/betro-web/actions/workflows/nodejs-test.yml/badge.svg)](https://github.com/prijindal/betro-web/actions/workflows/nodejs-test.yml)
[![Maintainability](https://api.codeclimate.com/v1/badges/aad3cf7fc8d25d7024a3/maintainability)](https://codeclimate.com/github/prijindal/betro-web/maintainability)
[![Known Vulnerabilities](https://snyk.io/test/github/prijindal/betro-web/badge.svg)](https://snyk.io/test/github/prijindal/betro-web)
[![CircleCI](https://circleci.com/gh/prijindal/betro-web/tree/master.svg?style=svg)](https://circleci.com/gh/prijindal/betro-web/tree/master)
[![codecov](https://codecov.io/gh/prijindal/betro-web/branch/master/graph/badge.svg)](https://codecov.io/gh/prijindal/betro-web)
[![CodeQL Analysis](https://github.com/prijindal/betro-web/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/prijindal/betro-web/actions/workflows/codeql-analysis.yml)

## Usage

There are npm scripts for all the relevant things. The server will always be started on port 8500 unless otherwise specified in `process.env.PORT`. You can use a `.env` file to specify env vars. If you want to use them in your client side code, don't forget to add them in [config/env.js](config/env.js#L37).

### Noteworthy scripts:

#### `yarn start`

Starts the app in development mode: creates a new client and server dev build using webpack, starts the Express server build (for both file serving and server side pre-rendering) and keeps webpack open in watchmode. Updates the app (if possible) on change using HMR.

#### `yarn build`

Creates a new build, optimized for production. Does **not** start a dev server or anything else.

#### `yarn test`

Run all tests using jest.

#### `yarn test:update`

Update all Jest snapshots (if there are any)

#### `yarn lint:js`

Run ESLint for all JavaScript and TypeScript files

#### `yarn lint:css`

Run Stylelint for all CSS files

#### `yarn lint`

Run lint:js and lint:css in parallel

#### `yarn analyze`

Starts `webpack-bundle-analyzer` to give you the opportunity to analyze your bundle(s)

#### `yarn depgraph`

Creates an image of your dependency graph. Requires [GraphVIZ](https://www.graphviz.org/) to be in your system's `PATH`

#### `yarn plop`

Run plop to create new React components or Redux reducers via CLI

## Environment Variables

There are a few environment variables you can set to adjust the setup to your needs

| Variable         | Default            | Description                                                                                                                                                                                                                                                                                      |
| ---------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `PORT`           | `8500`             | Port number your application will be served on.                                                                                                                                                                                                                                                  |
| `HOST`           | `http://localhost` | Host (including protocol!) your application will be served on. This is usually neglectable as most of the time your application will be served via remote proxy (e.g. Nginx) on localhost. **Note:** this is only for convenience. The server itself will not be bound exclusively to that host. |
| `DEVSERVER_HOST` | `http://localhost` | Optional. Different host for the Webpack Dev Server to be served on.                                                                                                                                                                                                                             |

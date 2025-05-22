This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Overview

This app was created for fox-hunt event

## Local Development

#### Install dependencies

Move to directory `cd fox-hunt-front`
Required installations run `npm install`
If you face `npm ERR! Unexpected end of JSON input while parsing near`
apply `npm cache clean --force` in your PowerShell running as Administrator
Optional installations (if json server is required) run `npm install -g json-server`

#### Launch project

At `fox-hunt-front` directory run `npm start`
Run `foxhunt-admin-backend` at port `8080`. Follow the instructions in the readme file.

## Available Scripts

In the project directory, you can run:

### `npm run lint:fix`

Clean your code according to rules described in the file (resolve such problems as : double quotes, indents ) <br />
But it doesn't solve excesses of line length, symmetric spaces in curly braces and console.log(). They should be fixed manually

Will move you to package with json data and then run the server (Endpoints will be offered after launch)

### `Set-ExecutionPolicy RemoteSigned/Unrestricted`

To solve errors which may cause problem while launching json server (during the first launch (Run it in the powershell))

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify

## Contributors

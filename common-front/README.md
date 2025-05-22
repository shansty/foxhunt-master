## Description

This local npm package was build to contain realizations of common modules of the application.

/bin - directory for development, containts ts/tsx files, node_modules and package.json with all dependencies and scripts

/bin/dist - directory for compiled files and package.json with npm package description

### Scripts

/bin - npm run build - for compilation ts/tsx into lib/dist using tsc

### Usage

Instalation: In module, that need to use the following package: npm install (..)/common-front/lib
Usage: import { component } from 'common-front';
All changes will be automatically imported into node_modules after compilation

### How it works

Package based on npm links, but it is hard to maintain (dependency resolution, symlink interoperability between file systems, etc.).
That's why yalc was added - it works like local repository for packages.
yalc publish - add package in global store
yalc update - grab from store.
https://www.npmjs.com/package/yalc

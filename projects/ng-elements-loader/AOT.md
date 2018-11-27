<img src="http://bit.ly/2mxmKKI" width="500" alt="Hapiness" />

<div style="margin-bottom:20px;">
<div style="line-height:60px">
    <a href="https://travis-ci.org/hapinessjs/ng-elements-loader.svg?branch=master">
        <img src="https://travis-ci.org/hapinessjs/ng-elements-loader.svg?branch=master" alt="build" />
    </a>
    <a href="https://david-dm.org/hapinessjs/ng-elements-loader">
        <img src="https://david-dm.org/hapinessjs/ng-elements-loader.svg" alt="dependencies" />
    </a>
    <a href="https://david-dm.org/hapinessjs/ng-elements-loader?type=dev">
        <img src="https://david-dm.org/hapinessjs/ng-elements-loader/dev-status.svg" alt="devDependencies" />
    </a>
</div>
<div>
    <a href="https://www.typescriptlang.org/docs/tutorial.html">
        <img src="https://cdn-images-1.medium.com/max/800/1*8lKzkDJVWuVbqumysxMRYw.png"
             align="right" alt="Typescript logo" width="50" height="50" style="border:none;" />
    </a>
    <a href="http://reactivex.io/rxjs">
        <img src="http://reactivex.io/assets/Rx_Logo_S.png"
             align="right" alt="ReactiveX logo" width="50" height="50" style="border:none;" />
    </a>
    <a href="https://www.angular.io">
            <img src="https://angular.io/assets/images/logos/angular/angular.svg"
                 align="right" alt="Angular logo" width="75" style="border:none; margin-top:-5px;" />
        </a>
</div>
</div>

# NG-ELEMENTS-LOADER with Ahead-of-Time compiler

This tutorial explains how to create a `custom element` with an `Angular` application to compile with `Ahead-of-Time` and to have **lightweight packaging**.

We support `Angular` version `7.1.0+` and `Angular-CLI` version `v7.0.6+`.

The bundled script will be used inside JavaScript's applications like `React.js`, `Vue.js` or just `standalone`.

## Installation

Create a new `Angular` application with `Angular-CLI`:

```bash
$ cd path/to/your/workspace
$ ng new webcomponents
```

*NOTICE: When the `CLI` asks you to add `routing` answer `NO` and for styling it doesn't matter because you'll not create a component here.*

After created your application, you have to add `@hapiness/ng-elements-loader`, `@angular/elements` and `document-register-element`:

```bash
$ yarn add @hapiness/ng-elements-loader @angular/elements document-register-element

or

$ npm install --save @hapiness/ng-elements-loader @angular/elements document-register-element
```

Before using your application to build your **optimized `webcomponent` bundle**, you have to create your `custom element` module like explain [here](https://github.com/hapinessjs/ng-elements-loader/blob/master/projects/ng-elements-loader/README.md#1-made-with-love-custom-element). 

## Application structure

In the first step we've created an `Angular-CLI` application with all elements required to build and run a full web application but to build a `webcomponent`, **we don't need all elements** and the following tree show the only structure required:

<pre><code>
├── src
|  ├── app
|  |  └── app.module.ts
|  ├── environments
|  |  ├── environment.prod.ts
|  |  └── environment.ts
|  ├── main.ts
|  ├── polyfills.ts
|  ├── tsconfig.app.json
|  └── tslint.json
├── angular.json
├── package.json
├── README.md
├── tsconfig.json
├── tslint.json
└── yarn.lock
</code></pre>

Now, you can see the content of each **modified** file to create your **optimized `webcomponent` bundle**:

**angular.json**:

```json
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "webcomponents": {
      "root": "",
      "sourceRoot": "src",
      "projectType": "application",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "outputPath": "dist",
            "index": "",
            "main": "src/main.ts",
            "polyfills": "src/polyfills.ts",
            "tsConfig": "src/tsconfig.app.json",
            "assets": [],
            "styles": [],
            "scripts": []
          },
          "configurations": {
            "production": {
              "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.prod.ts"
                }
              ],
              "optimization": true,
              "outputHashing": "none",
              "sourceMap": false,
              "extractCss": true,
              "namedChunks": false,
              "aot": true,
              "extractLicenses": true,
              "vendorChunk": false,
              "buildOptimizer": true,
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "2mb",
                  "maximumError": "5mb"
                }
              ]
            }
          }
        }
      }
    }
  },
  "defaultProject": "webcomponents"
}
```

**package.json**:

```json
{
  "name": "webcomponents",
  "version": "0.0.0",
  "scripts": {
    "build": "ng build --prod",
    "package": "cat ./dist/{runtime,polyfills,main}.js > ./dist/webcomponents.js",
    "compact": "gzip -k ./dist/webcomponents.js"
  },
  "private": true,
  "dependencies": {
    "@angular/animations": "^7.1.0",
    "@angular/elements": "^7.1.0",
    "@angular/common": "^7.1.0",
    "@angular/compiler": "^7.1.0",
    "@angular/core": "^7.1.0",
    "@angular/forms": "^7.1.0",
    "@angular/http": "^7.1.0",
    "@angular/platform-browser": "^7.1.0",
    "@angular/platform-browser-dynamic": "^7.1.0",
    "@angular/router": "^7.1.0",
    "core-js": "^2.5.4",
    "document-register-element": "^1.13.1",
    "made-with-love": "^1.0.0",
    "rxjs": "^6.3.3",
    "zone.js": "^0.8.26"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "^0.10.6",
    "@angular/cli": "^7.0.6",
    "@angular/compiler-cli": "^7.1.0",
    "@angular/language-service": "^7.1.0",
    "@types/jasmine": "^2.8.8",
    "@types/jasminewd2": "^2.0.3",
    "@types/node": "^8.9.4",
    "codelyzer": "^4.5.0",
    "jasmine-core": "^2.99.1",
    "jasmine-spec-reporter": "^4.2.1",
    "karma": "^3.0.0",
    "karma-chrome-launcher": "^2.2.0",
    "karma-coverage-istanbul-reporter": "^2.0.1",
    "karma-jasmine": "^1.1.2",
    "karma-jasmine-html-reporter": "^0.2.2",
    "protractor": "^5.4.0",
    "ts-node": "^7.0.1",
    "tslint": "^5.11.0",
    "typescript": "^3.1.6"
  }
}
```

**tsconfig.json**:

```json
{
  "compileOnSave": false,
  "compilerOptions": {
    "baseUrl": "./",
    "outDir": "./dist/out-tsc",
    "sourceMap": true,
    "declaration": false,
    "module": "es2015",
    "moduleResolution": "node",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "target": "es2015",
    "typeRoots": [
      "node_modules/@types"
    ],
    "lib": [
      "es2018",
      "dom"
    ]
  }
}
```

**src/polyfills.ts**:

```typescript
/**
 * This file includes polyfills needed by Angular and is loaded before the app.
 * You can add your own extra polyfills to this file.
 *
 * This file is divided into 2 sections:
 *   1. Browser polyfills. These are applied before loading ZoneJS and are sorted by browsers.
 *   2. Application imports. Files imported after ZoneJS that should be loaded before your main
 *      file.
 *
 * The current setup is for so-called "evergreen" browsers; the last versions of browsers that
 * automatically update themselves. This includes Safari >= 10, Chrome >= 55 (including Opera),
 * Edge >= 13 on the desktop, and iOS 10 and Chrome on mobile.
 *
 * Learn more in https://angular.io/guide/browser-support
 */

/***************************************************************************************************
 * BROWSER POLYFILLS
 */

/** IE9, IE10 and IE11 requires all of the following polyfills. **/
// import 'core-js/es6/symbol';
// import 'core-js/es6/object';
// import 'core-js/es6/function';
// import 'core-js/es6/parse-int';
// import 'core-js/es6/parse-float';
// import 'core-js/es6/number';
// import 'core-js/es6/math';
// import 'core-js/es6/string';
// import 'core-js/es6/date';
// import 'core-js/es6/array';
// import 'core-js/es6/regexp';
// import 'core-js/es6/map';
// import 'core-js/es6/weak-map';
// import 'core-js/es6/set';

/**
 * If the application will be indexed by Google Search, the following is required.
 * Googlebot uses a renderer based on Chrome 41.
 * https://developers.google.com/search/docs/guides/rendering
 **/
// import 'core-js/es6/array';

/** IE10 and IE11 requires the following for NgClass support on SVG elements */
// import 'classlist.js';  // Run `npm install --save classlist.js`.

/** IE10 and IE11 requires the following for the Reflect API. */
// import 'core-js/es6/reflect';

/**
 * Web Animations `@angular/platform-browser/animations`
 * Only required if AnimationBuilder is used within the application and using IE/Edge or Safari.
 * Standard animation support in Angular DOES NOT require any polyfills (as of Angular 6.0).
 **/
// import 'web-animations-js';  // Run `npm install --save web-animations-js`.

/**
 * By default, zone.js will patch all possible macroTask and DomEvents
 * user can disable parts of macroTask/DomEvents patch by setting following flags
 */

 // (window as any).__Zone_disable_requestAnimationFrame = true; // disable patch requestAnimationFrame
 // (window as any).__Zone_disable_on_property = true; // disable patch onProperty such as onclick
 // (window as any).__zone_symbol__BLACK_LISTED_EVENTS = ['scroll', 'mousemove']; // disable patch specified eventNames

 /*
 * in IE/Edge developer tools, the addEventListener will also be wrapped by zone.js
 * with the following flag, it will bypass `zone.js` patch for IE/Edge
 */
// (window as any).__Zone_enable_cross_context_check = true;

/***************************************************************************************************
 * Zone JS is required by default for Angular itself.
 */
import 'zone.js/dist/zone';  // Included with Angular CLI.


/***************************************************************************************************
 * APPLICATION IMPORTS
 */
import 'document-register-element';
```

**src/app/app.module.ts**:

```typescript
import { ApplicationRef, DoBootstrap, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ElementsLoaderService } from '@hapiness/ng-elements-loader';
import { MadeWithLoveComponent, MadeWithLoveModule } from 'made-with-love';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    MadeWithLoveModule
  ]
})
export class AppModule implements DoBootstrap {
  constructor(private _elementsLoaderService: ElementsLoaderService) {
    this._elementsLoaderService.registerContainingCustomElements({
      selector: 'made-with-love',
      component: MadeWithLoveComponent
    }).subscribe(undefined, e => console.error(e));
  }

  ngDoBootstrap(appRef: ApplicationRef): void {
  }
}
```

## Build, optimize and run the code

To build our `webcomponent` we will use a standard `ng build` command, but since it outputs 3 files (runtime.js ,polyfills.js and main.js) and we’d like to distribute our component as a **single js file**, we had turned hashing file names off in `angular.json` to know what are the names of files to manually concatenate them.

We have modified the `build` script in `package.json` and add `package` and `compact` entries:

<pre><code>
"build": "ng build --prod",
"package": "cat ./dist/{runtime,polyfills,main}.js > ./dist/webcomponents.js",
"compact": "gzip -k ./dist/webcomponents.js",
</code></pre>

`compact` entry will produce a `gzip` file of our `webcomponents.js` to have a **lightweight** version of it.

When you execute all the scripts:

```bash
$ yarn run build && yarn run package && yarn run compact
```

you will have a `dist` folder like this:

<pre><code>
├── dist
|  ├── 3rdpartylicenses.txt
|  ├── main.js
|  ├── polyfills.js
|  ├── runtime.js
|  ├── webcomponents.js
|  └── webcomponents.js.gz
</code></pre>

Now, your **optimized `webcomponent` bundle** is ready to be used inside others applications.

Create a `sample project` with an `index.html` file and `webcomponents.js` inside and add `http-server` to it:

```bash
$ yarn add http-server
```

In `package.json`, create a `server` entry to run `http-server`:

<pre><code>
"server": "http-server -p 8000 -g"
</code></pre>

**index.html**:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <title>Web Component</title>
</head>
<body>
<div id="container">
    <made-with-love name="Hapiness Framework" url="https://github.com/hapinessjs/" size="2"></made-with-love>
</div>
<script src="./webcomponents.js" type="text/javascript"></script>
</body>
</html>
```

Run the server:

```bash
$ yarn run server
```

Open your browser and go to `localhost:8000` to see the result:

Made with ♥ by [Hapiness Framework](https://github.com/hapinessjs/)

Now, you can use the **lightweight** version of your `webcomponent` by replacing inside your project `webcomponents.js` with the `gzip` version `webcomponents.js.gz`.

Restart the server and all will work again with the optimized version of your bundle.

## Conclusion

Oh, and btw. the resulting `webcomponents.js.gz` weights **87kB**, which, considering that we have the full power of Angular framework inside it, is a pretty remarkable result!

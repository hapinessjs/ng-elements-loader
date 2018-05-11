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

# CUSTOM-ELEMENTS-LOADER

This module exposes a factory to use [ElementsLoaderService](https://github.com/hapinessjs/ng-elements-loader/blob/master/projects/ng-elements-loader) inside JavaScript's applications like `React.js`, `Vue.js` or just `standalone`.

**DON'T USE THIS MODULE FOR ANGULAR APPLICATION**

## Installation

```bash
$ yarn add @hapiness/custom-elements-loader

or

$ npm install --save @hapiness/custom-elements-loader
```

**All required dependencies will be automatically installed** : `@angular/common`, `@angular/core`, `@angular/compiler`, `@angular/elements`, `@angular/platform-browser`, `@angular/platform-browser-dynamic`, `@hapiness/ng-elements-loader`, `core-js`, `document-register-element`, `rxjs` and `zone.js`.

**If your custom element module must have more dependencies, you must install them by yourself**

## Usage

Before to use `ElementsLoader` exposed by `@hapiness/custom-elements-loader`, you must create your own `custom-elements` modules.

To create a new **library** with `Angular-CLI`, follow this [guide](https://github.com/angular/angular-cli/wiki/stories-create-library).

### 1) *made-with-love* custom element

#### - Component

This component will be the final `custom-element` interpreted in your browser.

**projects/made-with-love/src/lib/made-with-love.component.ts**:

```typescript
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'made-with-love',
  templateUrl: './made-with-love.component.html',
  encapsulation: ViewEncapsulation.Native
})
export class MadeWithLoveComponent implements OnInit {
  private _name: string;
  private _url: string;
  private _color: string;
  private _size: number;

  constructor() {
    this.size = 1;
    this.color = 'red';
  }

  ngOnInit() {
    if (!this._name || this._name.length === 0) {
      console.error(`Name attribute must be provided!`);
    }
  }
  
  get name(): string {
    return this._name;
  }
  
  @Input()
  set name(n: string) {
    this._name = n;
  }
  
  get url(): string {
    return this._url;
  }

  @Input()
  set url(u: string) {
    this._url = u;
  }
  
  get color(): string {
    return this._color;
  }

  @Input()
  set color(c: string) {
    this._color = c;
  }
  
  get size(): number {
    return this._size;
  }

  @Input()
  set size(s: number) {
    this._size = s;
  }
}
```

**Note**: Your component **must** have encapsulation equals to `ViewEncapsulation.Native`.

**projects/made-with-love/src/lib/made-with-love.component.html**:

```html
<ng-template #noUrl>
  {{ name }}
</ng-template>
<span [style.font-size.em]="size">
  Made with <span [style.color]="color">♥</span> by
  <ng-container *ngIf="url && url.length > 0; else noUrl">
    <a [attr.href]="url" target="_blank">{{ name }}</a>
  </ng-container>
</span>
```

#### - Module

**projects/made-with-love/src/lib/made-with-love.module.ts**:

```typescript
import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WithCustomElementComponent } from '@hapiness/ng-elements-loader';
import { MadeWithLoveComponent } from './made-with-love.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    MadeWithLoveComponent
  ],
  entryComponents: [
    MadeWithLoveComponent
  ],
  exports: [
    MadeWithLoveComponent
  ]
})
export class MadeWithLoveModule implements WithCustomElementComponent {
  customElementComponent: Type<MadeWithLoveComponent> = MadeWithLoveComponent;
}
```

**Note**: Your module **must** implement `WithCustomElementComponent` interface exposed by `@hapiness/ng-elements-loader` and, component **must** be declared inside `entryComponents` and `declaration` **meta-data** of `NgModule`.

#### - Dependencies

The minimum `package.json` file for your module is described below:

**projects/made-with-love/package.json**:

```json
{
  "name": "made-with-love",
  "version": "1.0.0",
  "peerDependencies": {
    "@hapiness/custom-elements-loader": "^6.0.1"
  }
}
```

If your module has to have others **dependencies** not installed automatically by `@hapiness/custom-elements-loader` like explained in [installation](#installation), you must add them in **dependencies** section.

#### - Publish your module

Your `custom-element` module is now ready to be used so you have to publish it before use it in your application.

[Back to top](#installation)

### 2) *made-with-love* custom element in your JavaScript application

Create a `JavaScript` application with your **module** and `@hapiness/ng-elements-loader` in dependencies.

Install all `dependencies` your module must have if not already installed.

#### - Application contains *made-with-love* custom element

We create a `HTML`file with our `custom element` inside.

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
<div>
    <made-with-love name="Hapiness Framework" url="https://github.com/hapinessjs/" size="2"></made-with-love>
</div>

<script src="./main.js" type="text/javascript"></script>
</body>
</html>
```

`main.js` file contains all `JavaScript` elements to use `ElementsLoader` and it's built with webpack.

**main.ts**

```typescript
// POLYFILLS
import 'zone.js/dist/zone';
import 'document-register-element';

import { ElementsLoader } from '@hapiness/custom-elements-loader';
import { MadeWithLoveModule } from 'made-with-love';

ElementsLoader.loadContainingCustomElements(
    {
        selector: 'made-with-love',
        module: MadeWithLoveModule
    }
).subscribe(undefined, e => console.error(e));
```

#### - Explanation

The creation of the custom element happens directly inside `HTML` file with all attributes we want to display:

```html
<made-with-love name="Hapiness Framework" url="https://github.com/hapinessjs/" size="2"></made-with-love>
```

Loading of the component happens inside `main.ts` file.

- Add required **polyfills**

```typescript
import 'zone.js/dist/zone';
import 'document-register-element';
```

- Additional **polyfills** can be added if needed:

```typescript
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

/** IE10 and IE11 requires the following for NgClass support on SVG elements */
// import 'classlist.js';  // Run `npm install --save classlist.js`.

/** IE10 and IE11 requires the following for the Reflect API. */
// import 'core-js/es6/reflect';
```


- We call `loadContainingCustomElements` method of `ElementsLoader` from `@hapiness/custom-elements-loader`. This method takes in parameter `CustomElementModuleSelector` or `CustomElementModuleSelector[]` from `@hapiness/ng-elements-loader`.

```typescript
export interface CustomElementModuleSelector {
    selector: string;
    module: Type<any>;
}
```

**Selector** is the `custom tag` of your `custom element` and **module** is the `Angular` module contains the component.

#### - Show the result

Launch your application and you will see your `custom element` displayed inside your `JavaScript` application:

Made with ♥ by [Hapiness Framework](https://github.com/hapinessjs/)

[Back to top](#installation)

### 3) Custom element with custom event

In the previous component we have created only `@Input` properties but sometimes, you'll want to **emit event** from your `custom element` to the `DOM` with `@Ouput` properties.

#### - Custom element

Here an example of a component emits event to its parent:

**projects/hello-world/src/lib/hello-world.component.ts**:

```typescript
import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'hello-world',
  templateUrl: './hello-world.component.html',
  styleUrls: ['./hello-world.component.scss'],
  encapsulation: ViewEncapsulation.Native
})
export class HelloWorldComponent implements OnInit {
  private _sayHello$: EventEmitter<string>;

  constructor() {
    this._sayHello$ = new EventEmitter<string>();
  }

  ngOnInit() {
  }
  
  @Output('sayHello')
  get sayHello$(): EventEmitter<string> {
    return this._sayHello$;  
  }

  sayHello() {
    this._sayHello$.emit('Hello World');
  }
}
```

**projects/hello-world/src/lib/hello-world.component.html**:

```html
<div>
  <button type="button" (click)="sayHello()">Say Hello with Event</button>
</div>
```

#### - Use it in your application

To use it and receive event, you must do this:

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
<div>
    <hello-world></hello-world>
</div>

<script src="./main.js" type="text/javascript"></script>
</body>
</html>
```

We set a **listener** to catch `sayHello` event and do what we want:

**main.ts**

```typescript
// POLYFILLS
import 'zone.js/dist/zone';
import 'document-register-element';

import { ElementsLoader } from '@hapiness/custom-elements-loader';
import { HelloWorldModule } from 'hello-world';

ElementsLoader.loadContainingCustomElements(
    {
        selector: 'hello-world',
        module: HelloWorldModule
    }
).subscribe(undefined, e => console.error(e));

document.querySelector('hello-world').addEventListener('sayHello', (event: any) => alert(event.detail));
```

[Back to top](#installation)

## Change History
* v6.0.1 (2018-05-11)
    * `Angular v6.0.1+`
    * Documentation
* v6.0.0 (2018-05-07)
    * `Angular v6.0.0+`
    * Implementation of `ElementsLoader` factory
    * Documentation
    
[Back to top](#installation)

## Maintainers

<table>
    <tr>
        <td colspan="5" align="center"><a href="https://www.tadaweb.com"><img src="http://bit.ly/2xHQkTi" width="117" alt="tadaweb" /></a></td>
    </tr>
    <tr>
        <td align="center"><a href="https://github.com/Juneil"><img src="https://avatars3.githubusercontent.com/u/6546204?v=3&s=117" width="117"/></a></td>
        <td align="center"><a href="https://github.com/antoinegomez"><img src="https://avatars3.githubusercontent.com/u/997028?v=3&s=117" width="117"/></a></td>
        <td align="center"><a href="https://github.com/reptilbud"><img src="https://avatars3.githubusercontent.com/u/6841511?v=3&s=117" width="117"/></a></td>
        <td align="center"><a href="https://github.com/njl07"><img src="https://avatars3.githubusercontent.com/u/1673977?v=3&s=117" width="117"/></a></td>
    </tr>
    <tr>
        <td align="center"><a href="https://github.com/Juneil">Julien Fauville</a></td>
        <td align="center"><a href="https://github.com/antoinegomez">Antoine Gomez</a></td>
        <td align="center"><a href="https://github.com/reptilbud">Sébastien Ritz</a></td>
        <td align="center"><a href="https://github.com/njl07">Nicolas Jessel</a></td>
    </tr>
</table>

[Back to top](#installation)

## License

Copyright (c) 2018 **Hapiness** Licensed under the [MIT license](https://github.com/hapinessjs/ng-elements-loader/blob/master/LICENSE.md).

[Back to top](#installation)

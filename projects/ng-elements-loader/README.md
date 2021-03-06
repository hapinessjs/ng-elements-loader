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

# NG-ELEMENTS-LOADER

This module exposes an `Angular's` service to load easily [custom elements](https://angular.io/guide/elements) in your `Angular` application.

We support `Angular` version `7.1.0+`.

## Installation

```bash
$ yarn add @hapiness/ng-elements-loader

or

$ npm install --save @hapiness/ng-elements-loader
```

**Don't miss to install all peer dependencies if not yet done** : `@angular/common`, `@angular/core`, `@angular/compiler`, `@angular/elements`, `@angular/platform-browser`, `@angular/platform-browser-dynamic`, `core-js`, `document-register-element`, `rxjs` and `zone.js`.

**If your in an `Angular-CLI` application, all dependencies are already installed. You just need to install `@angular/elements`** : `ng add @angular/elements`

## Usage

Before to use `ElementsLoaderService` exposed by `@hapiness/ng-elements-loader`, you must create your own `custom-elements` modules.

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
  encapsulation: ViewEncapsulation.ShadowDom
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

**Note**: Your component **must** have encapsulation equals to `ViewEncapsulation.ShadowDom` if you want to have [shadowdomv1](https://developers.google.com/web/fundamentals/web-components/shadowdom) support else you can delete this line to have original support.

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
export class MadeWithLoveModule {}
```

**Note**: Component **must** be declared inside `entryComponents` and `declaration` **meta-data** of `NgModule`. You can see we've declared the component inside `exports` **meta-data** too, like this the module can be use directly, if you want, with normal **import** without `custom-elements`.

#### - Dependencies

The minimum `package.json` file for your module is described below:

**projects/made-with-love/package.json**:

```json
{
  "name": "made-with-love",
  "version": "1.0.0",
  "peerDependencies": {
    "@hapiness/ng-elements-loader": "^7.2.0"
  }
}
```

If your module has to have others `Angular` **dependencies**, add them in `peerDependencies`. If your module has to have **externals dependencies**, add them in `dependencies` like that they will be automatically installed.

#### - Publish your module

Your `custom-element` module is now ready to be used so you have to publish it before use it in your application.

[Back to top](#installation)

### 2) *made-with-love* custom element in your Angular application

Create an `Angular-CLI` application with your **module** and `@hapiness/ng-elements-loader` in dependencies.

Install all `dependencies` your module must have if not already installed.

#### - Component uses *made-with-love* custom element

We create a new component in our application to integrate custom element inside: `ng g c say-with-love`

This command will create 3 files: `say-with-love.component.ts`, `say-with-love.component.html` and `say-with-love.component.css` and add `SayWithLoveComponent` directly inside the `declaration` of the main module of your application `AppModule`.

**src/app/say-with-love/say-with-love.component.ts**:

```typescript
import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { ElementsLoaderService } from '@hapiness/ng-elements-loader';
import { tap } from 'rxjs/operators';

import { MadeWithLoveComponent } from 'made-with-love';

@Component({
  selector: 'say-with-love',
  templateUrl: './say-with-love.component.html',
  styleUrls: ['./say-with-love.component.css']
})
export class SayWithLoveComponent implements OnInit {

  constructor(private _el: ElementRef, private _rd: Renderer2, private _elementsLoaderService: ElementsLoaderService) {
    const element = this._rd.createElement('wc-made-with-love');
    this._rd.setAttribute(element, 'name', 'Hapiness Framework');
    this._rd.setAttribute(element, 'url', 'https://github.com/hapinessjs/');
    this._rd.setAttribute(element, 'size', '2');
    this._rd.appendChild(this._el.nativeElement, element);
  }

  ngOnInit(): void {
    this._elementsLoaderService.registerContainingCustomElements({
      selector: 'wc-made-with-love',
      component: MadeWithLoveComponent
    })
      .pipe(
        tap(_ => console.log('wc made-with-love loaded'))
      )
      .subscribe();
  }
}
```

`say-with-love.component.html` and `say-with-love.component.css` files are empty.

**src/app/app.module.ts**

```typescript
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MadeWithLoveModule } from 'made-with-love';
import { SayWithLoveComponent } from './say-with-love/say-with-love.component';

@NgModule({
  declarations: [
    SayWithLoveComponent
  ],
  imports: [
    BrowserAnimationsModule,
    MadeWithLoveModule
  ],
  providers: [],
  bootstrap: [ SayWithLoveComponent ]
})
export class AppModule {
}
```

#### - Explanation

The creation of the custom element happens inside the `constructor` of the wrapper component.

- To not interact directly with the `DOM`, we use `Renderer2` to create our custom element:

```typescript
const element = this._rd.createElement('wc-made-with-love');
```

- after, we set all attributes we want to display:

```typescript
this._rd.setAttribute(element, 'name', 'Hapiness Framework');
this._rd.setAttribute(element, 'url', 'https://github.com/hapinessjs/');
this._rd.setAttribute(element, 'size', '2');
```

- when all elements are ready, we can insert our custom element inside the `DOM`:

```typescript
this._rd.appendChild(this._el.nativeElement, element);
```

Loading of the component happens inside `OnInit` process.

```typescript
this._elementsLoaderService.registerContainingCustomElements({
  selector: 'wc-made-with-love',
  component: MadeWithLoveComponent
})
  .pipe(
    tap(_ => console.log('wc made-with-love loaded'))
  )
  .subscribe();
```

We call `registerContainingCustomElements` method of `ElementsLoaderService` from `@hapiness/ng-elements-loader`.

This method takes `CustomElementComponentSelector` or `CustomElementComponentSelector[]` in parameter.

```typescript
export interface CustomElementComponentSelector {
    selector: string;
    component: Type<any>;
}
```

**Selector** is the `custom tag` of your `custom element` and **component** is the `Angular` component presents in `entryComponents` and `declarations` of `MadeWithLoveModule`.

`MadeWithLoveModule` have to be imported inside the main module of your application `AppModule` to compile `MadeWithLoveComponent` declared in `entryComponents`.

#### - Show the result

Launch your application and you will see your `custom element` displayed inside your `Angular` application:

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
  encapsulation: ViewEncapsulation.ShadowDom
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

**src/app/say-hello-world/say-hello-world.component.ts**:

```typescript
import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { ElementsLoaderService } from '@hapiness/ng-elements-loader';
import { tap } from 'rxjs/operators';

import { HelloWorldComponent } from 'hello-world';

@Component({
  selector: 'say-hello',
  templateUrl: './say-hello.component.html',
  styleUrls: ['./say-hello.component.css']
})
export class SayHelloComponent implements OnInit {

  constructor(private _el: ElementRef, private _rd: Renderer2, private _elementsLoaderService: ElementsLoaderService) {
    const element = this._rd.createElement('wc-hello-world');
    this._rd.listen(element, 'sayHello', (event: any) => this.alertHello(event.detail));
    this._rd.appendChild(this._el.nativeElement, element);
  }

  ngOnInit(): void {
    this._elementsLoaderService.registerContainingCustomElements({
      selector: 'wc-hello-world',
      component: HelloWorldComponent
    })
      .pipe(
        tap(_ => console.log('wc hello-world loaded'))
      )
      .subscribe();
  }

  alertHello(event: string) {
    alert(event);
  }
}
```

We set a **listener** with `Renderer2` to catch `sayHello` event and do what we want:

```typescript
this._rd.listen(element, 'sayHello', (event: any) => this.alertHello(event.detail));
```

[Back to top](#installation)

#### - Add custom element support in your application

**tsconfig.json**

````json
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
    "target": "es2015", // this line must switch target from es5 to es2015
    "typeRoots": [
      "node_modules/@types"
    ],
    "lib": [
      "es2018",
      "dom"
    ]
  }
}
````

**If your browser doesn't support natively `customElement` like explain [here](https://angular.io/guide/elements#browser-support-for-custom-elements), you must add `document-register-element` inside `src/polyfills.ts` file**

## Change History
* v7.2.0 (2018-11-27)
    * `Angular v7.1.0+`
    * Add `ElementsLoaderService.registerContainingCustomElements()` method to **be used for AoT compiler**
    * `ElementsLoaderService.loadContainingCustomElements()` method **must be used only for JiT compiler**
    * Explain how to create an **optimized `webcomponent` bundle** with this [tutorial](https://github.com/hapinessjs/ng-elements-loader/blob/master/projects/ng-elements-loader/AOT.md)
    * Documentation
* v7.1.0 (2018-11-09)
    * `Angular v7.0.3+`
    * `document-register-elements v1.13.1` latest version of the `polyfill` only require if your browser doesn't support `customElement`
    * `@webcomponents/webcomponentsjs v2.1.3` to fix issue with `es5` compilation outside `Angular` application like explain [here](https://github.com/angular/angular/issues/24390#issuecomment-437361929)
    * Allow **custom elements registration** in browser even if tag isn't yet present in the `DOM` like this, it can be created or loaded asynchronously after registration
    * Documentation
* v7.0.0 (2018-11-02)
    * `Angular v7.0.2+`
    * Documentation
* v6.4.2 (2018-10-18)
    * `Angular v6.1.10+`
    * Documentation
* v6.4.1 (2018-09-26)
    * Fix version to `Angular v6.1.7` to avoid the bug reported in this [issue](https://github.com/angular/angular/issues/26128)
    * Documentation
* v6.4.0 (2018-07-26)
    * `Angular v6.1.0+`
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

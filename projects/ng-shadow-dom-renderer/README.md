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

# NG-SHADOW-DOM-RENDERER

This module exposes an `Angular's` factory to use the `shadow DOM V1` spec in `Angular renderer` until it's fix in core.

We support `Angular` version `6+`.

## Installation

```bash
$ yarn add @hapiness/ng-shadow-dom-renderer

or

$ npm install --save @hapiness/ng-shadow-dom-renderer
```

**Don't miss to install all peer dependencies if not yet done** : `@angular/core`, `@angular/platform-browser`.

**If your in an `Angular-CLI` application, all dependencies are already installed.**

## Usage

In your main module add the factory `overrideRenderFactory` exposed by `@hapiness/ng-shadow-dom-renderer`.

```typescript
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { overrideRenderFactory } from '@hapiness/ng-shadow-dom-renderer';

@NgModule({
    imports: [
        BrowserAnimationsModule
    ],
    providers: [overrideRenderFactory()]
})
export class AppModule {}
```

[Back to top](#installation)

## Change History
* v6.3.0 (2018-06-20)
    * Create `ShadowDomV1Renderer` to fix angular issue [#24397](https://github.com/angular/angular/issues/24397).
    * Expose factory `overrideRenderFactory` to be used inside `Angular` applications.
    * Version related to others modules of this packages.
    * Documentation.
    
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

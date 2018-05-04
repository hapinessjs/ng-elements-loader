import { enableProdMode, NgModuleRef, destroyPlatform } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { from, Observable, of, throwError } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';

import { ElementsLoaderService } from './elements-loader.service';
import { CustomElementModuleSelector } from './elements-registry';
import { ElementsLoaderModule } from './elements-loader.module';

// enable production mode
enableProdMode();

/** Elements loader factory */
export class ElementsLoaderFactory {
    // private property to store singleton instance
    private static _instance: ElementsLoaderFactory = null;
    // private property to store singleton instance of ElementsLoaderService
    private _elementsLoaderService: Observable<ElementsLoaderService>;

    /**
     * Private constructor for singleton instance
     */
    private constructor() {
        this._elementsLoaderService = of(destroyPlatform())
            .pipe(
                flatMap(_ => from(platformBrowserDynamic().bootstrapModule(ElementsLoaderModule))),
                map((_: NgModuleRef<ElementsLoaderModule>) => _.injector.get(ElementsLoaderService))
            );
    }

    /**
     * Returns singleton instance
     */
    static instance(): ElementsLoaderFactory {
        if (!(ElementsLoaderFactory._instance instanceof ElementsLoaderFactory)) {
            ElementsLoaderFactory._instance = new ElementsLoaderFactory();
        }
        return ElementsLoaderFactory._instance;
    }

    /**
     * Calls service's methods to load custom elements
     */
    loadContainingCustomElements(data: CustomElementModuleSelector | CustomElementModuleSelector[]): Observable<any> {
        return this._elementsLoaderService
            .pipe(
                flatMap(_ =>
                    !!(_ instanceof ElementsLoaderService) ?
                        of(_) :
                        throwError(new Error('Injector gave wrong instance of `ElementsLoaderService` after module\'s bootstrap'))
                ),
                flatMap((_: ElementsLoaderService) => _.loadContainingCustomElements(data))
            );
    }
}

/** Export new singleton instance */
export const ElementsLoader: ElementsLoaderFactory = ElementsLoaderFactory.instance();

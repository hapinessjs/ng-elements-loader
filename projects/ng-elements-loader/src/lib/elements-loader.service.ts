import { DOCUMENT } from '@angular/common';
import { Compiler, Inject, Injectable, Injector, Type } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { forkJoin, from, merge, Observable, of, throwError } from 'rxjs';
import { filter, flatMap, map, tap, toArray } from 'rxjs/operators';
import { CustomElementModuleSelector } from './elements-registry';

@Injectable({
    providedIn: 'root'
} as any)
export class ElementsLoaderService {
    /** Map of unregistered custom elements and their respective module to load. */
    private _elementsToLoad: Map<string, Type<any>>;

    constructor(private _injector: Injector,
                private _compiler: Compiler,
                @Inject(DOCUMENT) private _doc: any) {
        this._elementsToLoad = new Map<string, Type<any>>();
    }

    /**
     * Queries the document element for any custom elements that have not yet been registered with
     * the browser. Custom elements that are registered will be removed from the list of unregistered
     * elements so that they will not be queried in subsequent calls.
     */
    loadContainingCustomElements(data: CustomElementModuleSelector | CustomElementModuleSelector[]): Observable<any> {
        return of(data)
            .pipe(
                flatMap((_: CustomElementModuleSelector | CustomElementModuleSelector[]) =>
                    !!_ ?
                        of([].concat(_)) :
                        throwError(new Error('Parameter must be a `CustomElementModuleSelector` or an array of it'))
                ),
                flatMap((_: CustomElementModuleSelector[]) =>
                    !!_.length ?
                        of(_) :
                        throwError(new Error('`CustomElementModuleSelector` array must have at least one element'))
                ),
                flatMap((_: CustomElementModuleSelector[]) => from(_)),
                filter(_ => !!_.selector && !!_.module),
                toArray(),
                tap((_: CustomElementModuleSelector[]) =>
                    _.forEach((e: CustomElementModuleSelector) => this._elementsToLoad.set(e.selector, e.module))
                ),
                flatMap(() => this._customElements())
            );
    }

    /**
     * Main process to load custom elements
     */
    private _customElements(): Observable<any> {
        return of(of(typeof this._doc))
            .pipe(
                flatMap(obs =>
                    merge(
                        obs
                            .pipe(
                                filter(_ => _ !== 'undefined'),
                                map(_ => Array.from(this._elementsToLoad.keys()).filter((s: any) => this._doc.querySelector(s)))
                            ),
                        obs
                            .pipe(
                                filter(_ => _ === 'undefined'),
                                map(_ => [])
                            )
                    )
                ),
                flatMap(selectors =>
                    of(of(selectors))
                        .pipe(
                            flatMap(obs =>
                                merge(
                                    obs.pipe(
                                        filter(_ => !!_ && !!_.length),
                                        flatMap(_ => forkJoin(_.map(s => this._register(s))))
                                    ),
                                    obs.pipe(
                                        filter(_ => !_ || !_.length),
                                        map(_ => undefined as any)
                                    )
                                )
                            )
                        )
                )
            );
    }

    /**
     * Registers the custom element defined on the WithCustomElement module factory
     */
    private _register(selector: string): Observable<void> {
        return of(
            of(this._elementsToLoad.has(selector))
        )
            .pipe(
                flatMap((obs: Observable<boolean>) =>
                    merge(
                        obs
                            .pipe(
                                filter(_ => !!_), // selector inside elements to load
                                flatMap(_ =>
                                    of(
                                        of(customElements.get(selector))
                                    )
                                        .pipe(
                                            flatMap((o: Observable<boolean>) =>
                                                merge(
                                                    o.pipe(
                                                        filter(__ => !!__), // selector already loaded
                                                        tap(__ => this._elementsToLoad.delete(selector)) // so delete it
                                                    ),
                                                    o.pipe(
                                                        filter(__ => !__), // selector never loaded
                                                        flatMap(__ => this._createCustomElement(selector)) // so create custom element
                                                    )
                                                )
                                            )
                                        )
                                )
                            ),
                        obs
                            .pipe(
                                filter(_ => !_), // selector not in elements to load
                                map(_ => undefined as any)
                            )
                    )
                )
            );
    }

    /**
     * Create custom element for current selector
     */
    private _createCustomElement(selector: string): Observable<void> {
        return of(this._elementsToLoad.get(selector)!)
            .pipe(
                flatMap(elementModule => from(this._compiler.compileModuleAndAllComponentsAsync(elementModule))),
                map(moduleWithComponentFactories => moduleWithComponentFactories.ngModuleFactory),
                map(elementModuleFactory => elementModuleFactory.create(this._injector)),
                flatMap(elementModuleRef =>
                    !!elementModuleRef.instance.customElementComponent ?
                        of(createCustomElement(elementModuleRef.instance.customElementComponent, { injector: elementModuleRef.injector })) :
                        throwError(
                            new Error('WithCustomElementComponent interface must' +
                                ' be implemented by all modules that declare a component that can be used as a custom element.')
                        )
                ),
                tap(customElement => customElements!.define(selector, customElement)),
                tap(_ => this._elementsToLoad.delete(selector)),
                flatMap(_ => from(customElements.whenDefined(selector)))
            );
    }
}

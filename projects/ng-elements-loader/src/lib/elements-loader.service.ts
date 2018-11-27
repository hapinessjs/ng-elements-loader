import {
    Compiler,
    ComponentFactoryResolver,
    Injectable,
    Injector,
    ModuleWithComponentFactories,
    NgModuleFactory,
    NgModuleRef,
    Type
} from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { forkJoin, from, merge, Observable, of, throwError } from 'rxjs';
import { filter, flatMap, map, tap, toArray } from 'rxjs/operators';
import {
    CustomElementComponentSelector,
    CustomElementModuleSelector,
    WithCustomElementComponent
} from './elements-registry';

// interface to map data inserted in createCustomElement()
interface CustomElementData {
    component: Type<any>;
    injector: Injector;
}

@Injectable({
    providedIn: 'root'
} as any)
export class ElementsLoaderService {
    /** Map of unregistered custom elements and their respective module to load. */
    private _elementsToLoad: Map<string, Type<any>>;

    constructor(private _injector: Injector,
                private _compiler: Compiler,
                private _componentFactoryResolver: ComponentFactoryResolver) {
        this._elementsToLoad = new Map<string, Type<any>>();
    }

    /**
     * Queries the document element for any custom elements that have not yet been registered with
     * the browser. Custom elements that are registered will be removed from the list of unregistered
     * elements so that they will not be queried in subsequent calls. Compile the module and its component
     * to be registered as custom elements.
     * This function is used in JIT mode
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
                flatMap(() => this._customElements(true))
            );
    }

    /**
     * Queries the document element for any custom elements that have not yet been registered with
     * the browser. Custom elements that are registered will be removed from the list of unregistered
     * elements so that they will not be queried in subsequent calls. Component will be registered as
     * custom elements.
     * This function is used in AOT mode
     */
    registerContainingCustomElements(data: CustomElementComponentSelector | CustomElementComponentSelector[]): Observable<any> {
        return of(data)
            .pipe(
                flatMap((_: CustomElementComponentSelector | CustomElementComponentSelector[]) =>
                    !!_ ?
                        of([].concat(_)) :
                        throwError(new Error('Parameter must be a `CustomElementComponentSelector` or an array of it'))
                ),
                flatMap((_: CustomElementComponentSelector[]) =>
                    !!_.length ?
                        of(_) :
                        throwError(new Error('`CustomElementComponentSelector` array must have at least one element'))
                ),
                flatMap((_: CustomElementComponentSelector[]) => from(_)),
                filter(_ => !!_.selector && !!_.component),
                toArray(),
                tap((_: CustomElementComponentSelector[]) =>
                    _.forEach((e: CustomElementComponentSelector) => this._elementsToLoad.set(e.selector, e.component))
                ),
                flatMap(() => this._customElements(false))
            );
    }

    /**
     * Main process to load custom elements
     */
    private _customElements(compileModuleAndAllComponents: boolean): Observable<any> {
        return of(of(Array.from(this._elementsToLoad.keys())))
            .pipe(
                flatMap(obs =>
                    merge(
                        obs.pipe(
                            filter(_ => !!_ && !!_.length),
                            flatMap(_ => forkJoin(_.map(s => this._register(s, compileModuleAndAllComponents))))
                        ),
                        obs.pipe(
                            filter(_ => !_ || !_.length),
                            map(_ => undefined as any)
                        )
                    )
                )
            );
    }

    /**
     * Registers the custom element defined on the WithCustomElement module factory
     */
    private _register(selector: string, compileModuleAndAllComponents: boolean): Observable<void> {
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
                                                        flatMap(__ =>
                                                            this._createCustomElement(selector, compileModuleAndAllComponents)
                                                        ) // so create custom element
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
    private _createCustomElement(selector: string, compileModuleAndAllComponents: boolean): Observable<void> {
        return of(
            of(compileModuleAndAllComponents)
        )
            .pipe(
                flatMap((obs: Observable<boolean>) =>
                    merge(
                        obs.pipe(
                            filter(_ => !!_),
                            flatMap(_ => this._componentAndInjectorFromCompiledModule(this._elementsToLoad.get(selector)!))
                        ),
                        obs.pipe(
                            filter(_ => !_),
                            flatMap(_ => this._componentAndInjectorFromComponentFactory(this._elementsToLoad.get(selector)!))
                        )
                    )
                ),
                map((_: CustomElementData) => createCustomElement(_.component, { injector: _.injector })),
                tap((customElement: any) => customElements!.define(selector, customElement)),
                tap(_ => this._elementsToLoad.delete(selector)),
                flatMap(_ => from(customElements.whenDefined(selector)))
            );
    }

    /**
     * Compile module and all components to retrieve the component and the injector for custom element creation.
     * This function is only used in JIT mode.
     */
    private _componentAndInjectorFromCompiledModule(elementModule: Type<WithCustomElementComponent>):
        Observable<CustomElementData | never> {
        return from(this._compiler.compileModuleAndAllComponentsAsync(elementModule))
            .pipe(
                map((moduleWithComponentFactories: ModuleWithComponentFactories<WithCustomElementComponent>) =>
                    moduleWithComponentFactories.ngModuleFactory
                ),
                map((elementModuleFactory: NgModuleFactory<WithCustomElementComponent>) => elementModuleFactory.create(this._injector)),
                flatMap((elementModuleRef: NgModuleRef<WithCustomElementComponent>) =>
                    !!elementModuleRef.instance.customElementComponent ?
                        of({
                            component: elementModuleRef.instance.customElementComponent,
                            injector: elementModuleRef.injector
                        } as CustomElementData) :
                        throwError(
                            new Error('WithCustomElementComponent interface must' +
                                ' be implemented by all modules that declare a component that can be used as a custom element.')
                        )
                )
            );
    }

    /**
     * Resolve component to get module injector  for custom element creation.
     * This function is only used in AOT mode.
     */
    private _componentAndInjectorFromComponentFactory<T>(elementComponent: Type<T>): Observable<CustomElementData> {
        return of(this._componentFactoryResolver.resolveComponentFactory<T>(elementComponent))
            .pipe(
                map((componentFactory: any) => componentFactory.ngModule),
                map((elementModuleRef: NgModuleRef<any>) =>
                    ({
                        component: elementComponent,
                        injector: elementModuleRef.injector
                    }) as CustomElementData
                )
            );
    }
}

import { Type } from '@angular/core';

/**
 * Interface expected to be implemented by all modules that declare a component that can be used as
 * a custom element.
 */
export interface WithCustomElementComponent {
    customElementComponent: Type<any>;
}

/**
 * Interface to map module with its selector to be loaded as custom element when displayed in the DOM
 */
export interface CustomElementModuleSelector {
    selector: string;
    module: Type<any>;
}

/**
 * Interface to map component with its selector to be loaded as custom element when displayed in the DOM
 */
export interface CustomElementComponentSelector {
    selector: string;
    component: Type<any>;
}

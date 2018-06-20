import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ElementsLoaderService } from '@hapiness/ng-elements-loader';
import { overrideRenderFactory } from './shadow-dom-renderer';

@NgModule({
    imports: [
        BrowserAnimationsModule
    ],
    providers: [overrideRenderFactory()]
})
export class ElementsLoaderModule {
    constructor(private _elementsLoaderService: ElementsLoaderService) {}
    ngDoBootstrap() {}
}

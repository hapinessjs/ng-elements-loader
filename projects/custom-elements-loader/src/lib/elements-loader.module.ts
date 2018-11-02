import { ApplicationRef, DoBootstrap, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ElementsLoaderService } from '@hapiness/ng-elements-loader';

@NgModule({
    imports: [ BrowserAnimationsModule ]
})
export class ElementsLoaderModule implements DoBootstrap {
    constructor(private _elementsLoaderService: ElementsLoaderService) {}
    ngDoBootstrap(appRef: ApplicationRef): void {
    }
}

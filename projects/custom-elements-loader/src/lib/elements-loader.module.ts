import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ElementsLoaderService } from '@hapiness/ng-elements-loader';

@NgModule({
    imports: [ BrowserAnimationsModule ],
    providers: [ ElementsLoaderService ]
})
export class ElementsLoaderModule {
    ngDoBootstrap() {
    }
}

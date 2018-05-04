import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ElementsLoaderService } from './elements-loader.service';

@NgModule({
    imports: [
        BrowserModule
    ]
})
export class ElementsLoaderModule {
    constructor(private _elementsLoaderService: ElementsLoaderService) {}
    ngDoBootstrap() {}
}

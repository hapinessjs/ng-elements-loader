import { Renderer2, RendererFactory2, RendererStyleFlags2, RendererType2, ViewEncapsulation } from '@angular/core';
import {
    EventManager,
    ɵDomRendererFactory2 as DomRendererFactory2,
    ɵDomSharedStylesHost as DomSharedStylesHost,
    ɵflattenStyles as flattenStyles,
    ɵNAMESPACE_URIS as NAMESPACE_URIS
} from '@angular/platform-browser';

// HACK: this uses the shadow DOM V1 spec until we fix it in core
// https://github.com/angular/angular/issues/24397

export class ShadowDomV1Renderer implements Renderer2 {
    shadowRoot: ShadowRoot | undefined;
    data: { [ key: string ]: any } = Object.create(null);
    destroyNode: null;
    readonly abstract;

    constructor(
        private eventManager: EventManager, private sharedStylesHost: DomSharedStylesHost,
        private hostEl: any, private component: RendererType2) {

        this.shadowRoot = (hostEl as HTMLElement).attachShadow({ mode: 'open' });
        this.sharedStylesHost.addHost(this.shadowRoot);
        const styles = flattenStyles(component.id, component.styles, []);
        for (let i = 0; i < styles.length; i++) {
            const styleEl = document.createElement('style');
            styleEl.textContent = styles[ i ];
            this.shadowRoot.appendChild(styleEl);
        }
    }

    destroy() {
        this.sharedStylesHost.removeHost(this.shadowRoot);
    }

    private nodeOrShadowRoot(node: any): any {
        return node === this.hostEl ? this.shadowRoot : node;
    }

    createElement(name: string, namespace?: string): any {
        if (namespace) {
            return document.createElementNS(NAMESPACE_URIS[ namespace ], name);
        }

        return document.createElement(name);
    }

    createComment(value: string): any {
        return document.createComment(value);
    }

    createText(value: string): any {
        return document.createTextNode(value);
    }

    appendChild(parent: any, newChild: any): void {
        this.nodeOrShadowRoot(parent).appendChild(newChild);
    }

    insertBefore(parent: any, newChild: any, refChild: any): void {
        if (parent) {
            this.nodeOrShadowRoot(parent).insertBefore(newChild, refChild);
        }
    }

    removeChild(parent: any, oldChild: any): void {
        if (parent) {
            this.nodeOrShadowRoot(parent).removeChild(oldChild);
        }
    }

    selectRootElement(selectorOrNode: string | any): any {
        const el: any = typeof selectorOrNode === 'string' ?
            document.querySelector(selectorOrNode) :
            selectorOrNode;
        if (!el) {
            throw new Error(`The selector "${selectorOrNode}" did not match any elements`);
        }
        return el;
    }

    parentNode(node: any): any {
        return this.nodeOrShadowRoot(node.parentNode);
    }

    nextSibling(node: any): any {
        return node.nextSibling;
    }

    setAttribute(el: any, name: string, value: string, namespace?: string): void {
        if (namespace) {
            name = `${namespace}:${name}`;
            const namespaceUri = NAMESPACE_URIS[ namespace ];
            if (namespaceUri) {
                el.setAttributeNS(namespaceUri, name, value);
            } else {
                el.setAttribute(name, value);
            }
        } else {
            el.setAttribute(name, value);
        }
    }

    removeAttribute(el: any, name: string, namespace?: string): void {
        if (namespace) {
            const namespaceUri = NAMESPACE_URIS[ namespace ];
            if (namespaceUri) {
                el.removeAttributeNS(namespaceUri, name);
            } else {
                el.removeAttribute(`${namespace}:${name}`);
            }
        } else {
            el.removeAttribute(name);
        }
    }

    addClass(el: any, name: string): void {
        el.classList.add(name);
    }

    removeClass(el: any, name: string): void {
        el.classList.remove(name);
    }

    setStyle(el: any, style: string, value: any, flags: RendererStyleFlags2): void {
        if (flags & RendererStyleFlags2.DashCase) {
            el.style.setProperty(
                style, value, !!(flags & RendererStyleFlags2.Important) ? 'important' : '');
        } else {
            el.style[ style ] = value;
        }
    }

    removeStyle(el: any, style: string, flags: RendererStyleFlags2): void {
        if (flags & RendererStyleFlags2.DashCase) {
            el.style.removeProperty(style);
        } else {
            // IE requires '' instead of null
            // see https://github.com/angular/angular/issues/7916
            el.style[ style ] = '';
        }
    }

    setProperty(el: any, name: string, value: any): void {
        checkNoSyntheticProp(name, 'property');
        el[ name ] = value;
    }

    setValue(node: any, value: string): void {
        node.nodeValue = value;
    }

    listen(target: 'window' | 'document' | 'body' | any, event: string, callback: (event: any) => boolean):
        () => void {
        checkNoSyntheticProp(event, 'listener');
        if (typeof target === 'string') {
            return <() => void>this.eventManager.addGlobalEventListener(
                target, event, decoratePreventDefault(callback));
        }
        return <() => void>this.eventManager.addEventListener(
            target, event, decoratePreventDefault(callback)) as() => void;
    }
}

function decoratePreventDefault(eventHandler: Function): Function {
    return (event: any) => {
        const allowDefaultBehavior = eventHandler(event);
        if (allowDefaultBehavior === false) {
            event.preventDefault();
            event.returnValue = false;
        }
    };
}

function checkNoSyntheticProp(name: string, nameKind: string) {
    if (name.charCodeAt(0) === '@'.charCodeAt(0)) {
        throw new Error(
`Found the synthetic ${nameKind} ${name}. Please include either "BrowserAnimationsModule" or "NoopAnimationsModule" in your application.`
        );
    }
}

export function overrideRenderFactory() {
    return [ {
        provide: RendererFactory2, useFactory(renderFactory: RendererFactory2, sharedStylesHost, eventManager) {
            return {
                createRenderer(host, renderType: RendererType2) {

                    if (renderType && renderType.encapsulation === ViewEncapsulation.Native) {
                        return new ShadowDomV1Renderer(eventManager, sharedStylesHost, host, renderType);
                    }
                    return renderFactory.createRenderer(host, renderType);
                }
            };
        }, deps: [ DomRendererFactory2, DomSharedStylesHost, EventManager ]
    } ];
}

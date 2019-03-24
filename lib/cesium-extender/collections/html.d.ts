import { HtmlPrimitive } from '../primitives';
export declare class HtmlCollection {
    private _collection;
    readonly length: number;
    get(index: number): HtmlPrimitive;
    add(options: any): HtmlPrimitive;
    remove(html: HtmlPrimitive): boolean;
    update(): void;
    removeAll(): void;
    contains(html: HtmlPrimitive): boolean;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

export type KeyOfType<TObject, TKey> = keyof TObject & keyof { [K in keyof TObject as TObject[K] extends TKey ? K : never]: any }
export type KeyOfExtendsType<TObject, TKey> = keyof TObject & keyof { [K in keyof TObject as TKey extends TObject[K] ? K : never]: any }

export type IndexOfType<T extends Tuple> = number extends T['length'] ? number : Exclude<Partial<T>['length'], T['length']> & number;

export type AddPrefix<TObject, TPrefix extends string> = { [K in keyof TObject as K extends string ? `${TPrefix}${K}` : never]: TObject[K] }

export type FirstOf<T extends Tuple> = T extends [infer F, ...any] ? F : never;

export type Primitive = bigint | boolean | null | number | string | symbol | undefined;

export type NullableKeys<T> = { [K in keyof T]: T[K] | null }

export type Widen<T> = T extends boolean
    ? boolean
    : T extends number
    ? number
    : T extends string
    ? string
    : T

export type WidenAsTuple<T> = T extends Tuple
    ? { [K in keyof T]: WidenAsTuple<T[K]> }
    : Widen<T>

export type RecursiveArrayLike<T> = ArrayLike<T | RecursiveArrayLike<T>>;

export type Tuple<T = any> = [T, ...T[]];

export interface ReadonlyFloat32Array extends Omit<Float32Array, Exclude<keyof Array<any>, keyof ReadonlyArray<any>>> {
    readonly [n: number]: number;
}

export type Constructor<T = any> = new (...args: any[]) => T;
export type AbstractConstructor<T = any> = abstract new (...args: any[]) => T;

export function assertObjectOfType<T extends object>(value: any): value is T {
    return typeof value === 'object';
}

export type RemoveReadonly<T> = Readonly<any> extends T ? T extends Readonly<infer A> ? A : never : T extends readonly [...(infer A)] ? [...A] : T // narrowing fix

export type TupleWithTypeAtIndex<TTuple extends Tuple, TIndex extends IndexOfType<TTuple>, TType> =
    TTuple extends [..._MaxExtendableTupleHead<TTuple, TIndex>, ...infer R]
    ? [..._SubtupleFromStartToIndex<TTuple, TIndex, TType>, ...R] extends [infer H, ...infer E]
    ? [H, ...E] extends TTuple
    ? [H, ...E]
    : never
    : never
    : never

type _MaxExtendableTupleHead<TTuple extends Tuple, TIndex extends number, TRest extends any[] = []> =
    TTuple extends [any, ...TRest, ...any]
    ? TRest['length'] extends TIndex
    ? [any, ...TRest]
    : _MaxExtendableTupleHead<TTuple, TIndex, [any, ...TRest]>
    : TRest

type _SubtupleFromStartToIndex<
    TTuple extends Tuple,
    TIndex extends number,
    TType,
    TRest extends any[] = []> =
    TRest['length'] extends TIndex
    ? [...TRest, TType]
    : _SubtupleFromStartToIndex<TTuple, TIndex, TType, [...TRest, TTuple[TRest['length']]]>;
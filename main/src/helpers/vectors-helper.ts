export class Vector2 implements ArrayLike<number> {
    public static readonly zero: ReadonlyVector2 = new Vector2(0, 0);

    readonly [n: number]: number;

    public x: number;
    public y: number;
    public readonly length = 2;

    constructor();
    constructor(x: number, y: number);
    constructor(array: ArrayLike<number>);
    constructor(arg0: number | ArrayLike<number> = 0, arg1?: number) {
        if (typeof arg0 === 'number') {
            this.x = arg0;
            this.y = arg1 ?? 0;
        } else {
            this.x = arg0[0] ?? 0;
            this.y = arg0[1] ?? 0;
        }
    }

    public get 0(): number { return this.x; }
    public set 0(value: number) { this.x = value; }
    public get 1(): number { return this.y; }
    public set 1(value: number) { this.y = value; }
}

export class Vector3 implements ArrayLike<number> {
    public static readonly zero = new Vector3(0, 0, 0);

    readonly [n: number]: number;

    public x: number;
    public y: number;
    public z: number;
    public readonly length = 3;

    constructor();
    constructor(x: number, y: number, z: number);
    constructor(array: ArrayLike<number>);
    constructor(arg0: number | ArrayLike<number> = 0, arg1?: number, arg2?: number) {
        if (typeof arg0 === 'number') {
            this.x = arg0;
            this.y = arg1 ?? 0;
            this.z = arg2 ?? 0;
        } else {
            this.x = arg0[0] ?? 0;
            this.y = arg0[1] ?? 0;
            this.z = arg0[2] ?? 0;
        }
    }

    public get 0(): number { return this.x; }
    public set 0(value: number) { this.x = value; }
    public get 1(): number { return this.y; }
    public set 1(value: number) { this.y = value; }
    public get 2(): number { return this.z; }
    public set 2(value: number) { this.z = value; }
}

export class Vector4 implements ArrayLike<number> {
    public static readonly zero = new Vector4(0, 0, 0, 0);

    readonly [n: number]: number;

    public x: number;
    public y: number;
    public z: number;
    public w: number;
    public readonly length = 4;

    constructor();
    constructor(x: number, y: number, z: number, w: number);
    constructor(array: ArrayLike<number>);
    constructor(arg0: number | ArrayLike<number> = 0, arg1?: number, arg2?: number, arg3?: number) {
        if (typeof arg0 === 'number') {
            this.x = arg0;
            this.y = arg1 ?? 0;
            this.z = arg2 ?? 0;
            this.w = arg3 ?? 0;
        } else {
            this.x = arg0[0] ?? 0;
            this.y = arg0[1] ?? 0;
            this.z = arg0[2] ?? 0;
            this.w = arg0[3] ?? 0;
        }
    }

    public get 0(): number { return this.x; }
    public set 0(value: number) { this.x = value; }
    public get 1(): number { return this.y; }
    public set 1(value: number) { this.y = value; }
    public get 2(): number { return this.z; }
    public set 2(value: number) { this.z = value; }
    public get 3(): number { return this.w; }
    public set 3(value: number) { this.w = value; }
}

export interface ReadonlyVector2 extends Readonly<Vector2> { }
export interface ReadonlyVector3 extends Readonly<Vector3> { }
export interface ReadonlyVector4 extends Readonly<Vector4> { }
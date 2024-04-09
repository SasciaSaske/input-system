export class InputPath implements InputPath {
    /* @internal */
    public _priority!: number;

    private _path!: string;
    private _handedness!: string;
    private _controllerPath!: (string | RegExp)[];
    private _controlPath!: string[];

    public get path(): string {
        return this._path;
    }
    public get handedness(): string {
        return this._handedness;
    }
    get controllerPath(): readonly (string | RegExp)[] {
        return this._controllerPath;
    }
    public get controlPath(): string[] {
        return this._controlPath;
    }

    private _anyRegexp = new RegExp('');

    /* @internal */
    public _init(path: string): void;
    public _init(controllerPath: string, controlPath: string): void;
    public _init(a: string, b?: string): void {
        let controller: (string | RegExp)[];
        if (b) {
            this._path = `<${a}>/${b}`;
            controller = a.split('/');
            if (controller[0] === 'left' ||
                controller[0] === 'right' ||
                controller[0] === 'all' ||
                controller[0] === 'none') {
                this._handedness = controller.shift() as string;
            } else {
                this._handedness = 'all';
            }
            this._controlPath = (b as string).split('/');
        } else {
            this._path = a;
            const matches = /^<(?:(left|right|all|none)\/)?(.*)>\/(.*)/.exec(a);
            if (!matches) {
                throw console.error(`The path "${a}" doesn't match the signature "<controllerPath>/controlPath"`);
            }
            if (matches.length === 4) {
                this._handedness = matches[1];
                controller = matches[2].split('/');
                this._controlPath = matches[3].split('/');
            } else {
                this._handedness = 'all';
                controller = matches[1].split('/');
                this._controlPath = matches[2].split('/');
            }
        }
        this._priority = -1;
        for (let i = 0; i < controller.length; i++) {
            let temp: string | RegExp;
            if (controller[i] === '*') {
                temp = this._anyRegexp;
            } else if (controller[i] === '{') {
                temp = new RegExp(controller[++i] as string, (controller[++i] as string).slice(0, -1));
            } else {
                temp = controller[i];
            }
            controller[++this._priority] = temp;
        }
        controller.length = this._priority + 1;
        this._controllerPath = controller;
    }
}
export abstract class DataWrapper<T> {
    protected _data!: T;

    public abstract init(data: T): void;

    public updateData(data: T): void {
        this._data = data;
    }
}
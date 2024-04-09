export function moveFromIndexToFront<T>(array: T[], index: number): void {
    const temp = array[index];
    for (let i = index; i > 0;) {
        array[i] = array[--i];
    }
    array[0] = temp;
}

export function moveToFront<T>(array: T[], element: T): void {
    moveFromIndexToFront(array, array.indexOf(element));
}

export function moveFromIndexToIndex<T>(array: T[], startIndex: number, endIndex: number): void {
    const temp = array[startIndex];
    if (startIndex > endIndex) {
        for (let i = startIndex; i > endIndex;) {
            array[i] = array[--i];
        }
    } else {
        for (let i = startIndex; i < endIndex;) {
            array[i] = array[++i];
        }
    }
    array[endIndex] = temp;
}

export function moveElementToIndex<T>(array: T[], element: T, index: number): void {
    moveFromIndexToIndex(array, array.indexOf(element), index);
}

export function removeAtIndex<T>(array: T[], index: number): void {
    const length = array.length - 1;
    for (let i = index; i < length;) {
        array[i] = array[++i];
    }
    array.length = length;
}

export function removeAtIndexUnsorted<T>(array: T[], index: number): void {
    const length = array.length - 1;
    array[index] = array[length];
    array.length = length;
}

export function removeElement<T>(array: T[], element: T): void {
    removeAtIndex(array, array.indexOf(element));
}
export function removeElementUnsorted<T>(array: T[], element: T): void {
    removeAtIndexUnsorted(array, array.indexOf(element));
}

export function removeFromArray<T>(array: T[], predicate: (element: T) => boolean): void {
    removeAtIndex(array, array.findIndex(predicate));
}

export function copyArray<T>(inArray: T[], outArray: T[]): void {
    for (let i = 0; i < inArray.length; i++) {
        outArray[i] = inArray[i];
    }
    outArray.length = inArray.length;
}

export function insertAtIndex<T>(array: T[], index: number, element: T,): void {
    for (let i = array.length; i > index;) {
        array[i] = array[--i];
    }
    array[index] = element;
}

export function lastElement<T>(array: T[]): T {
    return array[array.length - 1];
}

export function trimArray<T>(array: T[]): void {
    let i = 0, j = 0;
    for (; i < array.length; i++) {
        if (array[i] !== undefined) {
            array[j] = array[i];
            j++;
        }
    }
    array.length = j;
}

export function removeElements<T>(array: T[], predicate: (element: T) => boolean, out: T[] = []): T[] {
    let i = 0, j = 0;
    for (; i < array.length; i++) {
        const element = array[i];
        if (predicate(element)) {
            out.push(element);
        } else {
            array[j] = element;
            j++;
        }
    }
    array.length = j;
    return out;
}
export interface XRContext {
    get frame(): XRFrame | null;
    get referenceSpace(): XRReferenceSpace | null
    get session(): XRSession | null;
}
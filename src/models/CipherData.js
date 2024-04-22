import {Padding} from "./Padding";

export const CipherData = class {
    constructor(key, iv, blockSize, padding) {
        this.key = key;
        this.iv = iv;
        this.blockSize = blockSize;
        this.padding = padding;
    }

}
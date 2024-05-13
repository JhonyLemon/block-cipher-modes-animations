import {arrayBufferToWordArray, wordArrayToArrayBuffer} from "../util/CryptoHelpers";

export const Data = class {
    file: File;
    content: ArrayBuffer;

    constructor() {
        this.file = null;
        this.content = null;
    }

    setFile(file: File) {
        this.file = file;
    }

    setContent(content: ArrayBuffer) {
        this.content = content;
    }

    setContentFromString(content: string) {
        const encoder = new TextEncoder();
        this.content = encoder.encode(content).buffer;
    }

    isFile() {
        return this.file !== null;
    }

    getFile() {
        return this.file;
    }

    getContent() {
        return this.content;
    }

    getContentAsString() {
        const decoder = new TextDecoder('utf-8');
        return decoder.decode(this.content);
    }

    getPaddedContent(paddingType, blockSize) {
        let wordArray = arrayBufferToWordArray(this.content);
        paddingType.cryptoJsPadding.pad(wordArray, blockSize/8);
        return wordArrayToArrayBuffer(wordArray);
    }

    static fromFileAndContent(file: File, content: ArrayBuffer): Data {
        const instance = new Data();
        instance.setFile(file);
        instance.setContent(content);
        return instance;
    }

    static fromString(content): Data {
        const instance = new Data();
        instance.setContentFromString(content);
        return instance;
    }
}
import CryptoJS from "crypto-js";

export const generateKey = (keySize) => {
    return CryptoJS.lib.WordArray.random(keySize / 8).toString();
}

export const generateIv = (keySize) => {
    return CryptoJS.lib.WordArray.random(keySize / 8).toString();
}

export const encrypt = (plaintext: ArrayBuffer, mode, key: string, iv: string= null) => {
    const plainTextWordArray = arrayBufferToWordArray(plaintext);
    return CryptoJS.AES.encrypt(
        plainTextWordArray,
        CryptoJS.enc.Hex.parse(key),
        {
            mode: mode,
            format: CryptoJS.format.Hex,
            iv: CryptoJS.enc.Hex.parse(iv === null ? '' : iv),
            padding: CryptoJS.pad.NoPadding,
        }
    ).ciphertext.toString(CryptoJS.enc.Hex)
}

function decrypt(cipherText, key, iv) {
}

export function arrayBufferToWordArray(ab) {
    return CryptoJS.lib.WordArray.create(ab);
}

export function wordArrayToArrayBuffer(wordArray) {
    let arrayBuffer = new ArrayBuffer(wordArray.sigBytes);
    let view = new DataView(arrayBuffer);
    wordArray.words.forEach((word, index) => {
        view.setInt32(index * 4, word);
    });
    return arrayBuffer;
}

export const buf2hex = (buffer: ArrayBuffer):string => {
    return [...new Uint8Array(buffer)]
        .map(x => x.toString(16).padStart(2, '0'))
        .join('');
}

export const xor = (hex1, hex2) => {
    const h1 = parseInt(hex1, 16)
    const h2 = parseInt(hex2, 16)
    return (h1 ^ h2).toString(16)
}
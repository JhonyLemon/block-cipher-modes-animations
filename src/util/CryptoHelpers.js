import CryptoJS from "crypto-js";

/**
 * Generates a random encryption key of the specified size.
 *
 * @param {number} keySize - The size of the key in bits.
 * @returns {string} The generated key in hexadecimal format.
 */
export const generateKey = (keySize) => {
    return CryptoJS.lib.WordArray.random(keySize / 8).toString();
}

/**
 * Generates a random initialization vector (IV) of the specified size.
 *
 * @param {number} keySize - The size of the IV in bits.
 * @returns {string} The generated IV in hexadecimal format.
 */
export const generateIv = (keySize) => {
    return CryptoJS.lib.WordArray.random(keySize / 8).toString();
}

/**
 * Encrypts the given text using AES encryption with the provided key and IV.
 *
 * @param {string} text - The plaintext to be encrypted in hexadecimal format.
 * @param {string} key - The encryption key in hexadecimal format.
 * @returns {string} The encrypted ciphertext in hexadecimal format.
 */
export const encrypt = (text, key) => {
    return CryptoJS.AES.encrypt(
        CryptoJS.enc.Hex.parse(text),
        CryptoJS.enc.Hex.parse(key),
        {
            padding: CryptoJS.pad.NoPadding,
            mode: CryptoJS.mode.ECB
        }
    ).ciphertext.toString(CryptoJS.enc.Hex);
}

/**
 * Decrypts the given ciphertext using AES decryption with the provided key.
 *
 * @param {string} cipherText - The ciphertext to be decrypted in hexadecimal format.
 * @param {string} key - The decryption key in hexadecimal format.
 * @returns {string} The decrypted plaintext in hexadecimal format.
 */
export const decrypt = (cipherText, key) => {
    return CryptoJS.AES.decrypt(
        {
            ciphertext: CryptoJS.enc.Hex.parse(cipherText)
        },
        CryptoJS.enc.Hex.parse(key),
        {
            padding: CryptoJS.pad.NoPadding,
            mode: CryptoJS.mode.ECB
        }
    ).toString(CryptoJS.enc.Hex);
}

/**
 * Converts an ArrayBuffer to a CryptoJS WordArray.
 *
 * @param {ArrayBuffer} arrayBuffer - The buffer to convert.
 * @returns {CryptoJS.lib.WordArray} The resulting WordArray.
 */
export const ab2wa = (arrayBuffer) => {
    const uint8Array = new Uint8Array(arrayBuffer);
    const words = [];
    for (let i=0; i < uint8Array.length; i += 4) {
        words.push((uint8Array[i] << 24) | (uint8Array[i+1] << 16) | (uint8Array[i+2] << 8) | uint8Array[i+3]);
    }
    return CryptoJS.lib.WordArray.create(words, uint8Array.length);
}

/**
 * Converts a CryptoJS WordArray to an ArrayBuffer.
 *
 * @param {CryptoJS.lib.WordArray} wordArray - The WordArray to convert.
 * @returns {ArrayBuffer} The resulting ArrayBuffer.
 */
export const wa2ab = (wordArray) => {
    let arrayBuffer = new ArrayBuffer(wordArray.sigBytes);
    let view = new DataView(arrayBuffer);
    wordArray.words.forEach((word, index) => {
        view.setInt32(index * 4, word);
    });
    return arrayBuffer;
}

/**
 * Converts a WordArray to a string.
 * @param {CryptoJS.lib.WordArray} wordArray - The WordArray to convert.
 * @returns {string} The resulting string.
 */
export const wa2str = (wordArray) => {
    return CryptoJS.enc.Utf8.stringify(wordArray);
}

/**
 * Converts a string to a WordArray.
 * @param {string} str - The string to convert.
 * @returns {CryptoJS.lib.WordArray} The resulting WordArray.
 */
export const str2wa = (str) => {
    return CryptoJS.enc.Utf8.parse(str);
}

/**
 * Converts a WordArray to a hexadecimal string.
 * @param {CryptoJS.lib.WordArray} wordArray - The WordArray to convert.
 * @returns {string} The resulting hexadecimal string.
 */
export const wa2hex = (wordArray) => {
    return CryptoJS.enc.Hex.stringify(wordArray);
}

/**
 * Converts a string to an ArrayBuffer.
 *
 * @param {string} str - The string to convert.
 * @returns {ArrayBuffer} The resulting ArrayBuffer.
 */
export const str2ab = (str) => {
    return new TextEncoder().encode(str).buffer;
}

/**
 * Converts an ArrayBuffer to a string.
 * @param {ArrayBuffer} ab - The buffer to convert.
 * @returns {string} The resulting string.
 */
export const ab2str = (ab) => {
    return new TextDecoder('utf-8').decode(ab);
}

/**
 * Converts an ArrayBuffer to a hexadecimal string.
 *
 * @param {ArrayBuffer} buffer - The buffer to convert.
 * @returns {string} The resulting hexadecimal string.
 */
export const buf2hex = (buffer) => {
    return [...new Uint8Array(buffer)]
        .map(x => x.toString(16).padStart(2, '0'))
        .join('');
}

/**
 * Converts a hexadecimal string to an ArrayBuffer.
 *
 * @param {string} hexString - The hexadecimal string to convert.
 * @returns {ArrayBuffer} The resulting ArrayBuffer.
 */
export const hex2buf = (hexString) => {
    return new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16))).buffer;
}

/**
 * Converts a hexadecimal string to a binary string.
 *
 * @param {string} hex - The hexadecimal string to convert.
 * @returns {string} The resulting binary string.
 */
export const hex2bin = (hex) => {
    return parseInt(hex, 16).toString(2).padStart(8, '0');
}

/**
 * Converts a hexadecimal string to a character.
 *
 * @param {string} hex - The hexadecimal string to convert.
 * @returns {string} The resulting character.
 */
export const hex2str = (hex) => {
    return String.fromCharCode(parseInt(hex, 16));
}

/**
 * Performs a bitwise XOR operation on two hexadecimal strings.
 *
 * @param {string} a - The first hexadecimal string.
 * @param {string} b - The second hexadecimal string.
 * @returns {string} The resulting hexadecimal string after XOR operation.
 */
export const xor = (a, b) => {
    let res = "",
        i = a.length,
        j = b.length;
    while (i-->0 && j-->0)
        res = (parseInt(a.charAt(i), 16) ^ parseInt(b.charAt(j), 16)).toString(16) + res;
    return res;
}

//    if (a.length !== b.length) {
//         throw new Error('Both hexadecimal numbers must be the same length');
//     }
//
//     let xorResult = '';
//     for (let i = 0; i < a.length; i += 8) {
//         const chunkA = parseInt(a.slice(i, i+8), 16);
//         const chunkB = parseInt(b.slice(i, i+8), 16);
//         console.log([a.slice(i, i+8), b.slice(i, i+8)], [chunkA, chunkB]);
//         const xorChunk = (chunkA ^ chunkB).toString(16).padStart(8, '0');
//
//         // We should check if the length is less than 8, then fill it up with leading zeros.
//         xorResult += xorChunk.length < 8 ? `0${xorChunk}` : xorChunk;
//     }
//
//     return xorResult;

/**
 * Splits wordArray into blocks of blockSize bits.
 * @param {CryptoJS.lib.WordArray} wordArray - The WordArray to split.
 * @param {number} blockSize - The size of the blocks in bits.
 * @returns {CryptoJS.lib.WordArray[]} An array of WordArrays containing the blocks.
 */
export const slice = (wordArray, blockSize) => {
    const blockSizeInWords = blockSize / 32;
    let blocks = [];
    for (let i = 0; i < wordArray.words.length; i += blockSizeInWords) {
        let block = [];
        for (let j = 0; j < blockSizeInWords; j++) {
            block.push(wordArray.words[i + j]);
        }

        blocks.push(new CryptoJS.lib.WordArray.init(block, blockSize / 8));
    }
    blocks = blocks.filter((block) => !block.words.every((word) => word === undefined));
    return blocks;
}
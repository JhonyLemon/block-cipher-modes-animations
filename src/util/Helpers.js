import CryptoJS from "crypto-js";
import bigInt from "big-integer";

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
 * Converts hexadecimal string to a number.
 * @param hex - The hexadecimal string to convert.
 * @returns {BigInteger} The resulting number.
 */
export const hex2num = (hex) => {
    return bigInt(hex, 16);
}

/**
 * Converts a number to a hexadecimal string.
 * @param {BigInteger} num - The number to convert.
 * @returns {string} The resulting hexadecimal string.
 */
export const num2hex = (num) => {
    return num.toString(16);
}

/**
 * Performs a bitwise XOR operation on two hexadecimal strings.
 *
 * @param {string} a - The first hexadecimal string.
 * @param {string} b - The second hexadecimal string.
 * @returns {string} The resulting hexadecimal string after XOR operation.
 */
export const xor = (a, b) => {
    const aNum = bigInt(a, 16);
    const bNum = bigInt(b, 16);
    return aNum.xor(bNum).toString(16).padStart(a.length, '0');
}

/**
 * Replaces whitespace characters with their respective names.
 * @param {string} str - The string to replace the whitespace characters
 * @returns {string} The resulting string with the whitespace characters replaced.
 */
export const replaceWhiteSpaceChars = (str) => {
    return str
        .replace(/\u0009/g, "HORIZONTAL_TAB")
        .replace(/\u000A/g, "LINE_FEED")
        .replace(/\u000B/g, "VERTICAL_TAB")
        .replace(/\u000C/g, "FORM_FEED")
        .replace(/\u000D/g, "CARRIAGE_RETURN")
        .replace(/\u0020/g, "SPACE")
}

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

/**
 * Calculates the length of a line segment defined by two points
 * @param point0
 * @param point1
 * @returns {number} The length of the line segment.
 */
export const length = (point0, point1) => {
    return Math.sqrt(Math.pow(point1.x - point0.x, 2) + Math.pow(point1.y - point0.y, 2));
}

/**
 * Calculates the total length of a path defined by an array of points.
 * @param points - The array of points defining the path.
 * @returns {number} The total length of the path.
 */
export const lengthFromPoints = (points) => {
    let totalLength = 0;
    for (let i = 0; i < points.length - 1; i++) {
        totalLength += length(points[i], points[i + 1]);
    }
    return totalLength;
}

export const pointOnLine = (points, totalLength, distance) => {
    let currentLength = 0;
    let distanceSup = distance
    for (let i = 0; i < points.length - 1; i++) {
        const segmentLength = length(points[i], points[i + 1]);
        if ((currentLength + segmentLength) < distance) {
            currentLength += segmentLength;
            distanceSup = distanceSup - segmentLength;
        } else if (points[i].x === points[i + 1].x) {
            if (points[i].y < points[i + 1].y) {
                return {
                    x: points[i].x,
                    y: points[i].y + (distanceSup)
                }
            } else {
                return {
                    x: points[i].x,
                    y: points[i].y - (distanceSup)
                }
            }
        } else if (points[i].y === points[i + 1].y) {
            if (points[i].x < points[i + 1].x) {
                return {
                    x: points[i].x + (distanceSup),
                    y: points[i].y
                }
            } else {
                return {
                    x: points[i].x - (distanceSup),
                    y: points[i].y
                }
            }
        } else {
            throw new Error('Something weird happened')
        }
    }
    return points[points.length - 1];
}

/**
 * Calculates the indices of the elements to animate.
 * @param {dict} elements - The elements to animate.
 * @param {number} frame - The current frame.
 * @returns {dict} The indices of the elements to animate.
 */
export const getAnimationIndices = (elements, frame) => {
    let cycleIndex = 0;
    let dotIndex = 0;
    let connectionIndex = 0;


    let tempFrame = 0;
    for (let i = 0; i < elements.contents; i++) {
        for (let j = 0; j < elements.connectionAnimation.data[i].length; j++) {
            for (let k = 0; k < ((1 / elements.connectionAnimation.options.speed) + 1); k++) {
                tempFrame++;
                if (tempFrame === frame) {
                    cycleIndex = i;
                    connectionIndex = j;
                    dotIndex = k;
                    return {cycleIndex: cycleIndex, dotIndex: dotIndex, connectionIndex: connectionIndex};
                }
            }
        }
    }
    return {cycleIndex: cycleIndex, dotIndex: dotIndex, connectionIndex: connectionIndex};
}

/**
 * Gets the frame for the animation.
 * @param {dict} elements - The elements to animate.
 * @param {number} cycleIndex - The index of the cycle.
 * @param {number} dotIndex - The index of the dot.
 * @param {number} connectionIndex - The index of the connection.
 * @returns {number} The frame for the animation.
 */
export const getFrame = (elements, cycleIndex, dotIndex, connectionIndex) => {
    let frame = 0;
    const cycleIndexOrMax = Math.min(cycleIndex, elements.contents);
    for (let i = 0; i < cycleIndexOrMax; i++) {
        for (let j = 0; j < elements.connectionAnimation.data[i].length; j++) {
            for (let k = 0; k < ((1 / elements.connectionAnimation.options.speed) + 1); k++) {
                frame++;
            }
        }
    }

    const connectionIndexOrMax = Math.min(connectionIndex, elements.connectionAnimation.data[cycleIndex].length);

    for (let i = 0; i < connectionIndexOrMax; i++) {
        for (let j = 0; j < ((1 / elements.connectionAnimation.options.speed) + 1); j++) {
            frame++;
        }
    }

    const dotIndexOrMax = Math.min(dotIndex, (1 / elements.connectionAnimation.options.speed));
    frame += dotIndexOrMax;

    frame++;

    return frame
}

/**
 * Multiplies two hex strings in GF(2^128).
 * @param {string} hex0 - The first hexadecimal string to multiply.
 * @param {string} hex1 - The second hexadecimal string to multiply.
 * @returns {string} The resulting hexadecimal string after multiplication.
 */
export const multiplyGF128 = (hex0, hex1) => {
    const R = bigInt("11100001" + "0".repeat(120), 2);
    const X = bigInt(hex0, 16);
    const Y = bigInt(hex1, 16);

    let Z = bigInt(0);
    let V = X;
    for (let i = 0; i < 128; i++) {
        const Yi = Y.shiftRight(i).and(1);
        if (Yi.eq(1)) {
            Z = Z.xor(V);
        }
        const V127 = V.shiftRight(127).and(1);
        if (V127.eq(0)) {
            V = V.shiftRight(1);
        } else {
            V = V.shiftRight(1).xor(R);
        }
    }
    return Z.toString(16).padStart(hex0.length, '0');
}
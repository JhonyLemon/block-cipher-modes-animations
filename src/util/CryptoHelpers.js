import CryptoJS from "crypto-js";

export const generateKey = (keySize) => {
    return CryptoJS.lib.WordArray.random(keySize / 8).toString();
}

export const generateIv = (keySize) => {
    return CryptoJS.lib.WordArray.random(keySize / 8).toString();
}

function toBinary(value) {
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(value);
    return [...encodedData].map(byte => byte.toString(2)
        .padStart(8, '0')).join(' ');
}

export const encrypt = (plaintext, mode, key, iv = null) => {
    return CryptoJS.AES.encrypt(plaintext, key, { mode: mode, format: CryptoJS.format.Hex, iv: iv }).ciphertext.toString(CryptoJS.enc.Hex)
}

function decrypt(cipherText, key, iv) {
}

export const buf2hex = (buffer) => {
    return [...new Uint8Array(buffer)]
        .map(x => x.toString(16).padStart(2, '0'))
        .join('');
}

export const hex2a = (hex) => {
    const hexString = hex.toString();//force conversion
    let str = '';
    for (let i = 0; i < hexString.length; i += 2)
        str += String.fromCharCode(parseInt(hexString.substring(i, i+2), 16));
    return str;
}

export const xor = (hex1, hex2) => {
    const h1= parseInt(hex1, 16)
    const h2= parseInt(hex2, 16)
    return (h1 ^ h2).toString(16)
}
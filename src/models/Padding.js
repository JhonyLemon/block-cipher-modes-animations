import CryptoJS from "crypto-js";

export const Padding = class {
    constructor(name, cryptoJsPadding) {
        this.name = name;
        this.cryptoJsPadding = cryptoJsPadding;
    }
}
Padding.ZERO = new Padding('Zero padding', CryptoJS.pad.ZeroPadding);
Padding.PADDINGS = [
    Padding.ZERO
];
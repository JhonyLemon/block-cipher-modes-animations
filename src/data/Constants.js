import {Data} from "../models/Data";
import {CipherMode} from "../models/CipherMode";
import {CipherData} from "../models/CipherData";
import {generateIv, generateKey} from "../util/CryptoHelpers";
import {Padding} from "../models/Padding";
import {Mode} from "../models/modes/Mode";
import {Ecb} from "../models/modes/Ecb";

export const EMPTY_ANIMATION = new Mode();
export const AVAILABLE_MODES = [
    new CipherMode('None selected', '', EMPTY_ANIMATION),
    new CipherMode('ECB', 'Electronic codebook', new Ecb()),
    new CipherMode('CBC', 'Cipher block chaining', EMPTY_ANIMATION),
    new CipherMode('CFB', 'Cipher feedback', EMPTY_ANIMATION),
    new CipherMode('OFB', 'Output feedback', EMPTY_ANIMATION),
    new CipherMode('CTR', 'Counter', EMPTY_ANIMATION),
    new CipherMode('GCM', 'Galois/Counter mode', EMPTY_ANIMATION),
    new CipherMode('CCM', 'Counter with CBC-MAC', EMPTY_ANIMATION),
    new CipherMode('XTS', 'XEX-based tweaked-codebook mode with ciphertext stealing', EMPTY_ANIMATION),
    new CipherMode('SIV', 'Synthetic initialization vector', ''),
    new CipherMode('EAX', 'Encrypt then authenticate then translate', EMPTY_ANIMATION),
    new CipherMode('OCB', 'Offset codebook mode', EMPTY_ANIMATION),
    new CipherMode('ChaCha20', 'ChaCha20', EMPTY_ANIMATION)
];
export const BLOCK_SIZE = 128;
export const DEFAULT_MODE = AVAILABLE_MODES[1];
export const DEFAULT_PADDING = Padding.ZERO;
export const DEFAULT_DATA = Data.fromString(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. " +
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. " +
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. " +
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
);
export const DEFAULT_CIPHER_DATA = new CipherData(
    generateKey(BLOCK_SIZE),
    generateIv(BLOCK_SIZE),
    BLOCK_SIZE,
    DEFAULT_PADDING
)
export const VIRTUAL_CANVAS_WIDTH = 1280;
export const VIRTUAL_CANVAS_HEIGHT = 720;

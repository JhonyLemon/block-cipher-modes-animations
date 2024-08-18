import {Data} from "../models/Data";
import {CipherMode} from "../models/CipherMode";
import {CipherData} from "../models/CipherData";
import {generateIv, generateKey} from "../util/CryptoHelpers";
import {Padding} from "../models/Padding";
import {Mode} from "../models/modes/Mode";
import {Ecb} from "../models/modes/Ecb";
import {Cbc} from "../models/modes/Cbc";
import {Cfb} from "../models/modes/Cfb";
import {Pcbc} from "../models/modes/Pcbc";
import {Ofb} from "../models/modes/Ofb";
import {Ctr} from "../models/modes/Ctr";

export const EMPTY_ANIMATION = new Mode();
export const AVAILABLE_MODES = [
    new CipherMode('ECB', 'Electronic codebook', new Ecb()),
    new CipherMode('CBC', 'Cipher block chaining', new Cbc()),
    new CipherMode('CFB', 'Cipher feedback', new Cfb()),
    new CipherMode('OFB', 'Output feedback', new Ofb()),
    new CipherMode('PCBC', 'Propagating cipher block chaining', new Pcbc()),
    new CipherMode('CTR', 'Counter', new Ctr())
];
export const BLOCK_SIZE = 128;
export const DEFAULT_MODE = AVAILABLE_MODES[0];
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

export const VIRTUAL_RESOLUTIONS = {
    // '240p': {width: 426, height: 240},
    // '360p': {width: 640, height: 360},
    // '480p': {width: 854, height: 480},
    '720p': {width: 1280, height: 720},
    '1080p': {width: 1920, height: 1080},
    '1440p': {width: 2560, height: 1440},
    '2160p': {width: 3840, height: 2160},
    '4320p': {width: 7680, height: 4320},
}

export const CANVAS_SIZE = (resolution) => {
    const closestMatch = Object.values(VIRTUAL_RESOLUTIONS).reduce((prev, curr) => {
        return Math.abs(curr.width - resolution.width) < Math.abs(prev.width - resolution.width) ? curr : prev;
    });
    return closestMatch;
};
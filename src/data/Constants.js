import CryptoJS from "crypto-js";
import {generateIv, generateKey, str2wa} from "../util/Helpers";
import {ecb} from "../modes/Ecb";
import {cbc} from "../modes/Cbc";
import {cfb} from "../modes/Cfb";
import {gcm} from "../modes/Gcm";
import {ctr} from "../modes/Ctr";
import {pcbc} from "../modes/Pcbc";
import {ofb} from "../modes/Ofb";

export const ECB_DESCRIPTION = 'The Electronic Codebook mode is the simplest mode of operation for a block cipher. It encrypts each block of data independently, which can lead to security vulnerabilities if the same plaintext block is encrypted with the same key.';
export const CBC_DESCRIPTION = 'The Cipher Block Chaining mode is a secure mode of operation for a block cipher. It uses an initialization vector to ensure that the same plaintext block encrypted with the same key produces different ciphertext each time.';
export const CFB_DESCRIPTION = 'The Cipher Feedback mode is a stream cipher mode of operation for a block cipher. It encrypts data in blocks and uses the output of the encryption process as the input for the next block.';
export const OFB_DESCRIPTION = 'The Output Feedback mode is a stream cipher mode of operation for a block cipher. It encrypts data in blocks and uses the output of the encryption process as the input for the next block.';
export const PCBC_DESCRIPTION = 'The Propagating Cipher Block Chaining mode is a secure mode of operation for a block cipher. It uses an initialization vector to ensure that the same plaintext block encrypted with the same key produces different ciphertext each time.';
export const CTR_MODE_DESCRIPTION = 'The Counter mode is a stream cipher mode of operation for a block cipher. It uses a counter to generate a unique initialization vector for each block of data to be encrypted.';
export const GCM_DESCRIPTION = 'The Galois/Counter mode is an authenticated encryption mode that provides both confidentiality and integrity protection for data. It uses a counter to generate a unique initialization vector for each block of data to be encrypted and includes an authentication tag with the ciphertext.';

export const AVAILABLE_MODES = {
    ECB: {
        name: 'ECB', description: ECB_DESCRIPTION, animation: (data, key, iv, blockSize, padding) => {
            return ecb(data, key, iv, blockSize, padding);
        }
    },
    CBC: {
        name: 'CBC', description: CBC_DESCRIPTION, animation: (data, key, iv, blockSize, padding) => {
            return cbc(data, key, iv, blockSize, padding);
        }
    },
    CFB: {
        name: 'CFB', description: CFB_DESCRIPTION, animation: (data, key, iv, blockSize, padding) => {
            return cfb(data, key, iv, blockSize, padding);
        }
    },
    OFB: {
        name: 'OFB', description: OFB_DESCRIPTION, animation: (data, key, iv, blockSize, padding) => {
            return ofb(data, key, iv, blockSize, padding);
        }
    },
    PCBC: {
        name: 'PCBC',
        description: PCBC_DESCRIPTION,
        animation: (data, key, iv, blockSize, padding) => {
            return pcbc(data, key, iv, blockSize, padding);
        }
    },
    CTR: {
        name: 'CTR', description: CTR_MODE_DESCRIPTION, animation: (data, key, iv, blockSize, padding) => {
            return ctr(data, key, iv, blockSize, padding);
        }
    },
    GCM: {
        name: 'GCM', description: GCM_DESCRIPTION, animation: (data, key, iv, blockSize, padding) => {
            return gcm(data, key, iv, blockSize, padding);
        }
    },
};

export const AVAILABLE_PADDING = {
    ZERO: {
        name: 'ZERO',
        description: 'Zero padding',
        pad: (data, blockSize) => {
            CryptoJS.pad.ZeroPadding.pad(data, blockSize / 8)
            return data;
        },
        unpad: (data) => {
            CryptoJS.pad.ZeroPadding.unpad(data)
            return data;
        }
    },
    NO: {
        name: 'NO',
        description: 'No padding',
        pad: (data, blockSize) => data,
        unpad: (data) => data
    }
}

export const BLOCK_SIZE = 128;

export const DEFAULT_MODE = AVAILABLE_MODES.ECB;
export const DEFAULT_PADDING = AVAILABLE_PADDING.ZERO
export const DEFAULT_DATA = str2wa(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. " +
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. " +
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. " +
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
);

export const KEY = () => {
    return generateKey(BLOCK_SIZE);
}

export const IV = () => {
    return generateIv(BLOCK_SIZE);
}

export const VIRTUAL_RESOLUTIONS = {
    '480p': {width: 848, height: 480}
}

export const AES_BOX_CONTENT = 'AES'
export const XOR_BOX_CONTENT = 'XOR'
export const NEW_IV_BOX_CONTENT = 'Next IV'

export const PLAINTEXT_TITLE = 'Plaintext';
export const CIPHERTEXT_TITLE = 'Ciphertext';
export const KEY_TITLE = 'Key';
export const IV_TITLE = 'IV(Initialization Vector)';
export const XOR_TITLE = 'XOR';
export const AES_TITLE = 'AES';
export const NEW_IV = 'Next IV';
export const CTR_TITLE = 'Counter';
export const HASH_KEY = 'H (Hash Key)';
export const MULTIPLICATION_IN_GALOIS_FIELD = 'Multiplication in Galois Field';
export const NEW_BLOCK = 'Signature Fragment (used in next data block)'
export const OLD_BLOCK = 'Previous Signature Fragment'
export const LENGTH_C = 'Length of data';
export const AUTH_TAG = 'Authentication Tag';


export const PLAINTEXT_DESCRIPTION = 'Refers to data in its original, unencrypted state. It is readable and understandable without the need for decryption.';
export const CIPHERTEXT_DESCRIPTION = 'Refers to data that has been encrypted using an encryption algorithm. It is unreadable and meaningless without the decryption key';
export const KEY_DESCRIPTION = 'A cryptographic key is a piece of information used to encrypt and decrypt data. It is a parameter that determines the functional output of a cryptographic algorithm. The security of encrypted data is directly related to the length and randomness of the key.';
export const IV_DESCRIPTION = 'An initialization vector is a random value used in conjunction with a secret key to encrypt data. It is used to ensure that the same plaintext data encrypted with the same key does not produce the same ciphertext. This prevents attackers from identifying patterns in the encrypted data.';
export const XOR_DESCRIPTION = 'The XOR operation is a binary operation that outputs true only when the inputs differ (one is true, the other is false). It is commonly used in cryptography to combine data in a reversible manner.';
export const AES_DESCRIPTION = 'The Advanced Encryption Standard is a symmetric encryption algorithm that is widely used to secure sensitive data. It is a block cipher that encrypts data in fixed-size blocks and uses a secret key to encrypt and decrypt data.';
export const PADDING_DESCRIPTION = 'Padding is a technique used to ensure that the length of the data to be encrypted is a multiple of the block size of the encryption algorithm. It is necessary because many encryption algorithms require the data to be a fixed length.';
export const BLOCK_SIZE_DESCRIPTION = 'The block size of an encryption algorithm refers to the size of the data blocks that the algorithm processes. It is an important parameter that affects the security and performance of the encryption process.';
export const MODE_DESCRIPTION = 'The mode of operation of an encryption algorithm determines how the algorithm processes data in blocks. Different modes offer different levels of security and performance, and are suitable for different use cases.';
export const NEW_IV_DESCRIPTION = 'In this mode of operation, a new IV is generated for each block of data to be encrypted using data from previous block. This ensures that the same plaintext data encrypted with the same key produces different ciphertext each time.';
export const CTR_DESCRIPTION = 'In this mode of operation, a counter is used to generate a unique IV for each block of data to be encrypted. We take generated IV and for each block we increase it\'s value by one. This ensures that the same plaintext data encrypted with the same key produces different ciphertext each time.';
export const HASH_KEY_DESCRIPTION = 'In this mode of operation, a hash key is generated for all blocks of data to be encrypted. It is calculated by encrypting block of data where all bits are zero.';
export const MULTIPLICATION_IN_GALOIS_FIELD_DESCRIPTION = 'Multiplication in GF(2^128).';
export const NEW_BLOCK_DESCRIPTION = 'Block of data that is used in next data block encryption, it is used to generate signature of encrypted data.';
export const OLD_BLOCK_DESCRIPTION = 'Block of data that is generated in previous data block encryption';
export const LENGTH_C_DESCRIPTION = 'Length of data that is used in encryption process.';
export const AUTH_TAG_DESCRIPTION = 'Authentication tag is used to verify the integrity of the data and authenticate the sender. It is generated during the encryption process and is sent along with the ciphertext.';
export const DATA_MODAL_DESCRIPTION = 'This modal allows you to view input data that will be used in encryption process, to edit it use \"Refresh data\" button.';
export const DATA_INPUT_MODAL_DESCRIPTION = 'This modal allows you to input or edit data that will be used in encryption process.';
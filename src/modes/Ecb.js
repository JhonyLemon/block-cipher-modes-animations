import {encrypt, slice, wa2hex, wa2str} from "../util/CryptoHelpers";
import {SIDE, TOOLTIP_POSITION} from "../components/AnimationPlayer";
import {
    AES_BOX_CONTENT,
    AES_DESCRIPTION,
    AES_TITLE, CIPHERTEXT_DESCRIPTION, CIPHERTEXT_TITLE,
    KEY_DESCRIPTION,
    KEY_TITLE,
    PLAINTEXT_DESCRIPTION,
    PLAINTEXT_TITLE
} from "../data/Constants";

const elements = (plaintextData, ciphertextData, key) => {
    const length = Math.max(plaintextData.length, ciphertextData.length);
    return {
        boxes: [
            {
                pos: {x: 0.5, y: 0.1},
                title: PLAINTEXT_TITLE,
                description: PLAINTEXT_DESCRIPTION,
                content: {
                    data: plaintextData,
                    options: {
                        textSize: 12,
                        onHoverInfo: true,
                        hoverInfoPos: TOOLTIP_POSITION.RIGHT.TOP,
                        onHoverText: true,
                        hoverTextPos: TOOLTIP_POSITION.BOTTOM.MIDDLE
                    }
                }
            },
            {
                pos: {x: 0.15, y: 0.5},
                title: KEY_TITLE,
                description: KEY_DESCRIPTION,
                content: {
                    data: new Array(length).fill(key),
                    options: {
                        textSize: 12,
                        onHoverInfo: true,
                        hoverInfoPos: TOOLTIP_POSITION.RIGHT.TOP,
                        onHoverText: true,
                        hoverTextPos: TOOLTIP_POSITION.RIGHT.MIDDLE
                    }
                }
            },
            {
                pos: {x: 0.5, y: 0.5},
                title: AES_TITLE,
                description: AES_DESCRIPTION,
                content: {
                    data: new Array(length).fill(AES_BOX_CONTENT),
                    options: {
                        textSize: 15,
                        onHoverInfo: true,
                        hoverInfoPos: TOOLTIP_POSITION.RIGHT.TOP,
                        onHoverText: false
                    }
                }
            },
            {
                pos: {x: 0.5, y: 0.8},
                title: CIPHERTEXT_TITLE,
                description: CIPHERTEXT_DESCRIPTION,
                content: {
                    data: ciphertextData,
                    options: {
                        textSize: 12,
                        onHoverInfo: true,
                        hoverInfoPos: TOOLTIP_POSITION.RIGHT.BOTTOM,
                        onHoverText: true,
                        hoverTextPos: TOOLTIP_POSITION.TOP.MIDDLE
                    }
                }
            }
        ],
        connections: [
            {
                from: {boxId: 0, arrowOut: SIDE.DOWN},
                to: {boxId: 2, arrowIn: SIDE.UP},
                connectionColor: 'black',
                arrowSize: 10,
                dotSize: 5,
                dotColor: 'red'
            },
            {
                from: {boxId: 1, arrowOut: SIDE.RIGHT},
                to: {boxId: 2, arrowIn: SIDE.LEFT},
                connectionColor: 'black',
                arrowSize: 10,
                dotSize: 5,
                dotColor: 'red'
            },
            {
                from: {boxId: 2, arrowOut: SIDE.DOWN},
                to: {boxId: 3, arrowIn: SIDE.UP},
                connectionColor: 'black',
                arrowSize: 10,
                dotSize: 5,
                dotColor: 'red'
            },

        ],
        connectionAnimation: {
            data: [
                {animations: [0, 1]},
                {animations: [2]}
            ],
            options: {
                speed: 0.25
            }
        },
        contents: length
    };
}

export const ecb = (data, key, iv, blockSize, padding) => {
    const paddedData = padding.pad(data, blockSize);
    const splicedData = slice(paddedData, blockSize);

    const plaintextData = splicedData.map((d) => wa2hex(d));
    const ciphertextData = splicedData.map((d) => wa2hex(d))
        .map((d) => encrypt(d, key));

    console.log(splicedData.map((d) => wa2str(d)));

    return elements(plaintextData, ciphertextData, key);
}
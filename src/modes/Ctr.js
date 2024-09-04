import {encrypt, hex2bin, hex2num, num2hex, slice, wa2hex, wa2str, xor} from "../util/Helpers";
import {SIDE, TOOLTIP_POSITION} from "../components/AnimationPlayer";
import {
    AES_BOX_CONTENT,
    AES_DESCRIPTION,
    AES_TITLE, CIPHERTEXT_DESCRIPTION, CIPHERTEXT_TITLE,
    KEY_DESCRIPTION,
    KEY_TITLE,
    PLAINTEXT_DESCRIPTION,
    PLAINTEXT_TITLE, XOR_BOX_CONTENT, XOR_DESCRIPTION, XOR_TITLE
} from "../data/Constants";

const elements = (plaintextData, ivData, semiEncrypted, ciphertextData, key) => {
    const length = Math.max(plaintextData.length, ivData.length, semiEncrypted.length, ciphertextData.length);
    return {
        boxes: [
            ...(new Array(length).fill([{
                pos: {x: 0.5, y: 0.1},
                title: 'CTR',
                description: 'CTR',
                content: {
                    data: ivData,
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
                pos: {x: 0.5, y: 0.25},
                title: AES_TITLE,
                description: AES_DESCRIPTION,
                content: {
                    data: new Array(length).fill(AES_BOX_CONTENT),
                    options: {
                        textSize: 12,
                        onHoverInfo: true,
                        hoverInfoPos: TOOLTIP_POSITION.RIGHT.TOP,
                        onHoverText: false,
                        hoverTextPos: TOOLTIP_POSITION.RIGHT.MIDDLE
                    }
                }
            },
            {
                pos: {x: 0.2, y: 0.25},
                title: KEY_TITLE,
                description: KEY_DESCRIPTION,
                content: {
                    data: new Array(length).fill(key),
                    options: {
                        textSize: 12,
                        onHoverInfo: true,
                        hoverInfoPos: TOOLTIP_POSITION.BOTTOM.LEFT,
                        onHoverText: true,
                        hoverTextPos: TOOLTIP_POSITION.RIGHT.MIDDLE
                    }
                }
            },
            {
                pos: {x: 0.5, y: 0.4},
                title: 'semi-encrypted',
                description: 'semi-encrypted',
                content: {
                    data: semiEncrypted,
                    options: {
                        textSize: 12,
                        onHoverInfo: false,
                        hoverInfoPos: TOOLTIP_POSITION.RIGHT.BOTTOM,
                        onHoverText: true,
                        hoverTextPos: TOOLTIP_POSITION.TOP.MIDDLE
                    }
                }
            },
            {
                pos: {x: 0.5, y: 0.55},
                title: XOR_TITLE,
                description: XOR_DESCRIPTION,
                content: {
                    data: new Array(length).fill(XOR_BOX_CONTENT),
                    options: {
                        textSize: 12,
                        onHoverInfo: true,
                        hoverInfoPos: TOOLTIP_POSITION.RIGHT.BOTTOM,
                        onHoverText: false,
                        hoverTextPos: TOOLTIP_POSITION.TOP.MIDDLE
                    }
                }
            },
            {
                pos: {x: 0.2, y: 0.55},
                title: PLAINTEXT_TITLE,
                description: PLAINTEXT_DESCRIPTION,
                content: {
                    data: plaintextData,
                    options: {
                        textSize: 12,
                        onHoverInfo: true,
                        hoverInfoPos: TOOLTIP_POSITION.RIGHT.BOTTOM,
                        onHoverText: true,
                        hoverTextPos: TOOLTIP_POSITION.TOP.MIDDLE
                    }
                }
            },
            {
                pos: {x: 0.5, y: 0.7},
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
            }])),
        ],
        connections: [
            ...(new Array(length).fill([{
                from: {boxId: 0, arrowOut: SIDE.DOWN},
                to: {boxId: 1, arrowIn: SIDE.UP},
                connectionColor: 'black',
                arrowSize: 10,
                dotSize: 5,
                dotColor: 'red'
            },
            {
                from: {boxId: 2, arrowOut: SIDE.RIGHT},
                to: {boxId: 1, arrowIn: SIDE.LEFT},
                connectionColor: 'black',
                arrowSize: 10,
                dotSize: 5,
                dotColor: 'red'
            },
            {
                from: {boxId: 1, arrowOut: SIDE.DOWN},
                to: {boxId: 3, arrowIn: SIDE.UP},
                connectionColor: 'black',
                arrowSize: 10,
                dotSize: 5,
                dotColor: 'red'
            },
            {
                from: {boxId: 3, arrowOut: SIDE.DOWN},
                to: {boxId: 4, arrowIn: SIDE.UP},
                connectionColor: 'black',
                arrowSize: 10,
                dotSize: 5,
                dotColor: 'red'
            },
            {
                from: {boxId: 5, arrowOut: SIDE.RIGHT},
                to: {boxId: 4, arrowIn: SIDE.LEFT},
                connectionColor: 'black',
                arrowSize: 10,
                dotSize: 5,
                dotColor: 'red'
            },
            {
                from: {boxId: 4, arrowOut: SIDE.DOWN},
                to: {boxId: 6, arrowIn: SIDE.UP},
                connectionColor: 'black',
                arrowSize: 10,
                dotSize: 5,
                dotColor: 'red'
            }]))
        ],
        connectionAnimation: {
            data: [
                ...(new Array(length).fill([{animations: [0, 1]},
                {animations: [2]},
                {animations: [3,4]},
                {animations: [5]}])),
            ],
            options: {
                speed: 0.25
            }
        },
        contents: length
    };
}

export const ctr = (data, key, iv, blockSize, padding) => {
    const paddedData = padding.pad(data, blockSize);
    const splicedData = slice(paddedData, blockSize);

    const plaintextData = splicedData.map((d) => wa2hex(d));
    let semiEncrypted = [];
    let ivData = [iv];
    let ciphertextData = [];

    plaintextData.forEach((hexPlain, i) => {
        const ctrNounce = ivData[i];
        const semiEncrypt = encrypt(ctrNounce, key);
        semiEncrypted.push(semiEncrypt);
        const encrypted = xor(semiEncrypt, hexPlain);
        ciphertextData.push(encrypted);
        ivData.push(num2hex(hex2num(ctrNounce).add(1)));
    });

    ivData.pop();

    return elements(plaintextData, ivData, semiEncrypted, ciphertextData, key);
}
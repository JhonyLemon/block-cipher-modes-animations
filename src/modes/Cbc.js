import {encrypt, slice, wa2hex, xor} from "../util/Helpers";
import {SIDE, TOOLTIP_POSITION} from "../components/AnimationPlayer";
import {
    AES_BOX_CONTENT,
    AES_DESCRIPTION,
    AES_TITLE, CIPHERTEXT_DESCRIPTION, CIPHERTEXT_TITLE, IV_DESCRIPTION, IV_TITLE,
    KEY_DESCRIPTION,
    KEY_TITLE, NEW_IV, NEW_IV_BOX_CONTENT, NEW_IV_DESCRIPTION,
    PLAINTEXT_DESCRIPTION,
    PLAINTEXT_TITLE, XOR_BOX_CONTENT, XOR_DESCRIPTION, XOR_TITLE
} from "../data/Constants";

const elements = (plaintextData, ivData, xoredData, ciphertextData, key) => {
    const length = Math.max(plaintextData.length, ciphertextData.length, ivData.length, xoredData.length);
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
                pos: {x: 0.2, y: 0.25},
                title: IV_TITLE,
                description: IV_DESCRIPTION,
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
                title: XOR_TITLE,
                description: XOR_DESCRIPTION,
                content: {
                    data: new Array(length).fill(XOR_BOX_CONTENT),
                    options: {
                        textSize: 15,
                        onHoverInfo: true,
                        hoverInfoPos: TOOLTIP_POSITION.RIGHT.TOP,
                        onHoverText: false
                    }
                }
            },
            {
                pos: {x: 0.5, y: 0.4},
                title: 'XOR-ed',
                description: 'XOR-ed data',
                content: {
                    data: xoredData,
                    options: {
                        textSize: 12,
                        onHoverInfo: false,
                        onHoverText: true,
                        hoverTextPos: TOOLTIP_POSITION.BOTTOM.MIDDLE
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
            },
            {
                pos: {x: 0.2, y: 0.55},
                title: KEY_TITLE,
                description: KEY_DESCRIPTION,
                content: {
                    data: new Array(length).fill(key),
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
                pos: {x: 0.5, y: 0.55},
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
                pos: {x: 0.8, y: 0.7},
                title: NEW_IV,
                description: NEW_IV_DESCRIPTION,
                content: {
                    data: new Array(length).fill(NEW_IV_BOX_CONTENT),
                    options: {
                        textSize: 15,
                        onHoverInfo: true,
                        hoverInfoPos: TOOLTIP_POSITION.LEFT.BOTTOM,
                        onHoverText: false
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
            {
                from: {boxId: 3, arrowOut: SIDE.DOWN},
                to: {boxId: 6, arrowIn: SIDE.UP},
                connectionColor: 'black',
                arrowSize: 10,
                dotSize: 5,
                dotColor: 'red'
            },
            {
                from: {boxId: 5, arrowOut: SIDE.RIGHT},
                to: {boxId: 6, arrowIn: SIDE.LEFT},
                connectionColor: 'black',
                arrowSize: 10,
                dotSize: 5,
                dotColor: 'red'
            },
            {
                from: {boxId: 6, arrowOut: SIDE.DOWN},
                to: {boxId: 4, arrowIn: SIDE.UP},
                connectionColor: 'black',
                arrowSize: 10,
                dotSize: 5,
                dotColor: 'red'
            },
            {
                from: {boxId: 4, arrowOut: SIDE.RIGHT},
                to: {boxId: 7, arrowIn: SIDE.LEFT},
                connectionColor: 'black',
                arrowSize: 10,
                dotSize: 5,
                dotColor: 'red'
            }
        ],
        connectionAnimation: {
            data: [
                {animations: [0, 1]},
                {animations: [2]},
                {animations: [3, 4]},
                {animations: [5]},
                {animations: [6]},
            ],
            options: {
                speed: 0.25
            }
        },
        contents: length
    };
}

export const cbc = (data, key, iv, blockSize, padding) => {
    const paddedData = padding.pad(data, blockSize);
    const splicedData = slice(paddedData, blockSize);

    const plaintextData = splicedData.map((d) => wa2hex(d));
    let xored = [];
    let ivData = [iv];
    let ciphertextData = [];

    plaintextData.forEach((hexPlain, i) => {
        const xorIv = i === 0 ? iv : ciphertextData[i - 1];
        const hexXor = xor(hexPlain, xorIv);
        xored.push(hexXor);
        const encrypted = encrypt(hexXor, key);
        ciphertextData.push(encrypted);
        ivData.push(encrypted);
    });

    ivData.pop();

    return elements(plaintextData, ivData, xored, ciphertextData, key);
}
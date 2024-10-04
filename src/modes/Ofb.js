import {encrypt, slice, wa2hex, wa2str, xor} from "../util/Helpers";
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

const elements = (plaintextData, ivData, semiEncrypted, ciphertextData, key) => {
    const length = Math.max(plaintextData.length, ciphertextData.length, ivData.length, semiEncrypted.length);
    return {
        boxes: [
            ...(new Array(length).fill([{
                pos: {x: 0.5, y: 0.1},
                title: IV_TITLE,
                description: IV_DESCRIPTION,
                content: {
                    data: ivData,
                    options: {
                        showTitle: true,
                        textSize: 12,
                        onHoverInfo: true,
                        hoverInfoPos: TOOLTIP_POSITION.RIGHT.TOP,
                        onHoverText: true,
                        showText: true,
                        hoverTextPos: TOOLTIP_POSITION.BOTTOM.MIDDLE
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
                            showTitle: true,
                            textSize: 12,
                            onHoverInfo: true,
                            hoverInfoPos: TOOLTIP_POSITION.RIGHT.TOP,
                            onHoverText: true,
                            showText: true,
                            hoverTextPos: TOOLTIP_POSITION.RIGHT.MIDDLE
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
                            textSize: 15,
                            onHoverInfo: true,
                            hoverInfoPos: TOOLTIP_POSITION.RIGHT.TOP,
                            onHoverText: false
                        }
                    }
                },
                {
                    pos: {x: 0.5, y: 0.4},
                    title: 'Outcome of AES operation',
                    description: '',
                    content: {
                        data: semiEncrypted,
                        options: {
                            showTitle: true,
                            textSize: 12,
                            onHoverInfo: false,
                            hoverInfoPos: TOOLTIP_POSITION.RIGHT.BOTTOM,
                            onHoverText: true,
                            showText: true,
                            hoverTextPos: TOOLTIP_POSITION.TOP.MIDDLE
                        }
                    }
                },
                {
                    pos: {x: 0.8, y: 0.4},
                    title: NEW_IV,
                    description: NEW_IV_DESCRIPTION,
                    content: {
                        data: new Array(length).fill(NEW_IV_BOX_CONTENT),
                        options: {
                            showTitle: false,
                            textSize: 12,
                            onHoverInfo: true,
                            hoverInfoPos: TOOLTIP_POSITION.LEFT.BOTTOM,
                            onHoverText: false,
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
                            showTitle: false,
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
                            showTitle: true,
                            textSize: 12,
                            onHoverInfo: true,
                            hoverInfoPos: TOOLTIP_POSITION.RIGHT.BOTTOM,
                            onHoverText: true,
                            showText: true,
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
                            showTitle: true,
                            textSize: 12,
                            onHoverInfo: true,
                            hoverInfoPos: TOOLTIP_POSITION.RIGHT.BOTTOM,
                            onHoverText: true,
                            showText: true,
                            hoverTextPos: TOOLTIP_POSITION.TOP.MIDDLE
                        }
                    }
                }]))
        ],
        connections: [
            ...(new Array(length).fill([{
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
                    from: {boxId: 3, arrowOut: SIDE.RIGHT},
                    to: {boxId: 4, arrowIn: SIDE.LEFT},
                    connectionColor: 'black',
                    arrowSize: 10,
                    dotSize: 5,
                    dotColor: 'red'
                },
                {
                    from: {boxId: 3, arrowOut: SIDE.DOWN},
                    to: {boxId: 5, arrowIn: SIDE.UP},
                    connectionColor: 'black',
                    arrowSize: 10,
                    dotSize: 5,
                    dotColor: 'red'
                },
                {
                    from: {boxId: 6, arrowOut: SIDE.RIGHT},
                    to: {boxId: 5, arrowIn: SIDE.LEFT},
                    connectionColor: 'black',
                    arrowSize: 10,
                    dotSize: 5,
                    dotColor: 'red'
                },
                {
                    from: {boxId: 5, arrowOut: SIDE.DOWN},
                    to: {boxId: 7, arrowIn: SIDE.UP},
                    connectionColor: 'black',
                    arrowSize: 10,
                    dotSize: 5,
                    dotColor: 'red'
                }])),
        ],
        connectionAnimation: {
            data: [
                ...(new Array(length).fill([{animations: [0, 1]},
                    {animations: [2]},
                    {animations: [3, 4, 5]},
                    {animations: [6]}]))
            ],
            options: {
                speed: 0.20
            }
        },
        contents: length
    };
}

export const ofb = (data, key, iv, blockSize, padding) => {
    const paddedData = padding.pad(data, blockSize);
    const splicedData = slice(paddedData, blockSize);

    const plaintextData = splicedData.map((d) => wa2hex(d));
    let semiEncrypted = [];
    let ivData = [iv];
    let ciphertextData = [];

    plaintextData.forEach((hexPlain, i) => {
        const aesIv = i === 0 ? iv : semiEncrypted[i - 1];
        const newIv = encrypt(aesIv, key);
        semiEncrypted.push(newIv);
        const encrypted = xor(newIv, hexPlain);
        ciphertextData.push(encrypted);
        ivData.push(newIv);
    });

    ivData.pop();

    return elements(plaintextData, ivData, semiEncrypted, ciphertextData, key);
}
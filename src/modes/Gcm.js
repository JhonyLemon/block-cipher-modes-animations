import {encrypt, hex2num, multiplyGF128, num2hex, slice, wa2hex, wa2str, xor} from "../util/Helpers";
import {SIDE, TOOLTIP_POSITION} from "../components/AnimationPlayer";
import {
    AES_BOX_CONTENT,
    AES_DESCRIPTION,
    AES_TITLE, AUTH_TAG, AUTH_TAG_DESCRIPTION,
    CIPHERTEXT_DESCRIPTION,
    CIPHERTEXT_TITLE,
    CTR_DESCRIPTION,
    CTR_TITLE,
    HASH_KEY,
    HASH_KEY_DESCRIPTION,
    KEY_DESCRIPTION,
    KEY_TITLE, LENGTH_C, LENGTH_C_DESCRIPTION,
    MULTIPLICATION_IN_GALOIS_FIELD,
    MULTIPLICATION_IN_GALOIS_FIELD_DESCRIPTION,
    NEW_BLOCK,
    NEW_BLOCK_DESCRIPTION, OLD_BLOCK, OLD_BLOCK_DESCRIPTION,
    PLAINTEXT_DESCRIPTION,
    PLAINTEXT_TITLE,
    XOR_BOX_CONTENT,
    XOR_DESCRIPTION,
    XOR_TITLE
} from "../data/Constants";
import bigInt from "big-integer";

const elements = (plaintextData, ivData, ciphertextData, semiEncrypted, cipherXored, multiH, xoredLenC, multiHLenC, encryptedCounter0, xoredCounter0, key, h, lenC) => {
    const length = Math.max(plaintextData.length, ciphertextData.length);
    console.log('plaintextData', plaintextData, 'ivData', ivData, 'ciphertextData', ciphertextData, 'semiEncrypted', semiEncrypted, 'cipherXored', cipherXored, 'multiH', multiH, 'xoredLenC', xoredLenC, 'multiHLenC', multiHLenC, 'encryptedCounter0', encryptedCounter0, 'xoredCounter0', xoredCounter0, 'key', key, 'h', h, 'lenC', lenC);
    return {
        boxes: [
            [
                {
                    pos: {x: 0.4, y: 0.1},
                    title: CTR_TITLE,
                    description: CTR_DESCRIPTION,
                    content: {
                        data: ivData.slice(1),
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
                    pos: {x: 0.4, y: 0.25},
                    title: AES_TITLE,
                    description: AES_DESCRIPTION,
                    content: {
                        data: new Array(length + 2).fill(AES_BOX_CONTENT),
                        options: {
                            showTitle: false,
                            textSize: 12,
                            onHoverInfo: true,
                            hoverInfoPos: TOOLTIP_POSITION.RIGHT.TOP,
                            onHoverText: false,
                            hoverTextPos: TOOLTIP_POSITION.BOTTOM.MIDDLE
                        }
                    }
                },
                {
                    pos: {x: 0.15, y: 0.25},
                    title: KEY_TITLE,
                    description: KEY_DESCRIPTION,
                    content: {
                        data: new Array(length + 2).fill(key),
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
                    pos: {x: 0.4, y: 0.4},
                    title: 'Outcome of AES operation',
                    description: 'semi_ecrypted',
                    content: {
                        data: semiEncrypted,
                        options: {
                            showTitle: true,
                            textSize: 12,
                            onHoverInfo: false,
                            hoverInfoPos: TOOLTIP_POSITION.RIGHT.TOP,
                            onHoverText: true,
                            showText: true,
                            hoverTextPos: TOOLTIP_POSITION.BOTTOM.MIDDLE
                        }
                    }
                },
                {
                    pos: {x: 0.4, y: 0.55},
                    title: XOR_TITLE,
                    description: XOR_DESCRIPTION,
                    content: {
                        data: new Array(length + 2).fill(XOR_BOX_CONTENT),
                        options: {
                            showTitle: false,
                            textSize: 12,
                            onHoverInfo: true,
                            hoverInfoPos: TOOLTIP_POSITION.RIGHT.TOP,
                            onHoverText: false,
                            hoverTextPos: TOOLTIP_POSITION.BOTTOM.MIDDLE
                        }
                    }
                },
                {
                    pos: {x: 0.15, y: 0.55},
                    title: PLAINTEXT_TITLE,
                    description: PLAINTEXT_DESCRIPTION,
                    content: {
                        data: plaintextData,
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
                    pos: {x: 0.4, y: 0.7},
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
                            hoverTextPos: TOOLTIP_POSITION.BOTTOM.MIDDLE
                        }
                    }
                },
                {
                    pos: {x: 0.4, y: 0.85},
                    title: MULTIPLICATION_IN_GALOIS_FIELD,
                    description: MULTIPLICATION_IN_GALOIS_FIELD_DESCRIPTION,
                    content: {
                        data: new Array(length + 2).fill('MultiH'),
                        options: {
                            showTitle: false,
                            textSize: 12,
                            onHoverInfo: true,
                            hoverInfoPos: TOOLTIP_POSITION.RIGHT.BOTTOM,
                            onHoverText: false,
                            hoverTextPos: TOOLTIP_POSITION.BOTTOM.MIDDLE
                        }
                    }
                },
                {
                    pos: {x: 0.15, y: 0.85},
                    title: HASH_KEY,
                    description: HASH_KEY_DESCRIPTION,
                    content: {
                        data: new Array(length + 2).fill(h),
                        options: {
                            showTitle: true,
                            textSize: 12,
                            onHoverInfo: true,
                            hoverInfoPos: TOOLTIP_POSITION.RIGHT.BOTTOM,
                            onHoverText: true,
                            showText: true,
                            hoverTextPos: TOOLTIP_POSITION.RIGHT.MIDDLE
                        }
                    }
                },
                {
                    pos: {x: 0.65, y: 0.85},
                    title: NEW_BLOCK,
                    description: NEW_BLOCK_DESCRIPTION,
                    content: {
                        data: multiH,
                        options: {
                            showTitle: true,
                            textSize: 12,
                            onHoverInfo: false,
                            hoverInfoPos: TOOLTIP_POSITION.RIGHT.TOP,
                            onHoverText: true,
                            showText: true,
                            hoverTextPos: TOOLTIP_POSITION.TOP.MIDDLE
                        }
                    }
                },
                {
                    pos: {x: 0.9, y: 0.85},
                    title: 'Signature Fragment',
                    description: NEW_BLOCK_DESCRIPTION,
                    content: {
                        data: new Array(length + 2).fill('New Block'),
                        options: {
                            showTitle: false,
                            textSize: 12,
                            onHoverInfo: true,
                            hoverInfoPos: TOOLTIP_POSITION.LEFT.BOTTOM,
                            onHoverText: false,
                            hoverTextPos: TOOLTIP_POSITION.BOTTOM.MIDDLE
                        }
                    }
                }
            ],
            ...new Array(length - 1).fill([
                    {
                        pos: {x: 0.4, y: 0.1},
                        title: CTR_TITLE,
                        description: CTR_DESCRIPTION,
                        content: {
                            data: ivData.slice(1),
                            options: {
                                textSize: 12,
                                onHoverInfo: true,
                                hoverInfoPos: TOOLTIP_POSITION.RIGHT.TOP,
                                onHoverText: true,
                                showTitle: true,
                                showText: true,
                                hoverTextPos: TOOLTIP_POSITION.BOTTOM.MIDDLE
                            }
                        }
                    },
                    {
                        pos: {x: 0.4, y: 0.25},
                        title: AES_TITLE,
                        description: AES_DESCRIPTION,
                        content: {
                            data: new Array(length + 2).fill(AES_BOX_CONTENT),
                            options: {
                                textSize: 12,
                                onHoverInfo: true,
                                hoverInfoPos: TOOLTIP_POSITION.RIGHT.TOP,
                                onHoverText: false,
                                hoverTextPos: TOOLTIP_POSITION.BOTTOM.MIDDLE
                            }
                        }
                    },
                    {
                        pos: {x: 0.15, y: 0.25},
                        title: KEY_TITLE,
                        description: KEY_DESCRIPTION,
                        content: {
                            data: new Array(length + 2).fill(key),
                            options: {
                                textSize: 12,
                                onHoverInfo: true,
                                hoverInfoPos: TOOLTIP_POSITION.RIGHT.TOP,
                                showTitle: true,
                                onHoverText: true,
                                showText: true,
                                hoverTextPos: TOOLTIP_POSITION.RIGHT.MIDDLE
                            }
                        }
                    },
                    {
                        pos: {x: 0.4, y: 0.4},
                        title: 'Outcome of AES operation',
                        description: 'semi_ecrypted',
                        content: {
                            data: semiEncrypted,
                            options: {
                                textSize: 12,
                                onHoverInfo: false,
                                hoverInfoPos: TOOLTIP_POSITION.RIGHT.TOP,
                                showTitle: true,
                                onHoverText: true,
                                showText: true,
                                hoverTextPos: TOOLTIP_POSITION.BOTTOM.MIDDLE
                            }
                        }
                    },
                    {
                        pos: {x: 0.4, y: 0.55},
                        title: XOR_TITLE,
                        description: XOR_DESCRIPTION,
                        content: {
                            data: new Array(length + 2).fill(XOR_BOX_CONTENT),
                            options: {
                                textSize: 12,
                                onHoverInfo: true,
                                hoverInfoPos: TOOLTIP_POSITION.RIGHT.TOP,
                                onHoverText: false,
                                hoverTextPos: TOOLTIP_POSITION.BOTTOM.MIDDLE
                            }
                        }
                    },
                    {
                        pos: {x: 0.15, y: 0.55},
                        title: PLAINTEXT_TITLE,
                        description: PLAINTEXT_DESCRIPTION,
                        content: {
                            data: plaintextData,
                            options: {
                                textSize: 12,
                                onHoverInfo: true,
                                hoverInfoPos: TOOLTIP_POSITION.RIGHT.TOP,
                                showTitle: true,
                                onHoverText: true,
                                showText: true,
                                hoverTextPos: TOOLTIP_POSITION.RIGHT.MIDDLE
                            }
                        }
                    },
                    {
                        pos: {x: 0.4, y: 0.7},
                        title: CIPHERTEXT_TITLE,
                        description: CIPHERTEXT_DESCRIPTION,
                        content: {
                            data: ciphertextData,
                            options: {
                                textSize: 12,
                                onHoverInfo: true,
                                hoverInfoPos: TOOLTIP_POSITION.RIGHT.TOP,
                                showTitle: true,
                                onHoverText: true,
                                showText: true,
                                hoverTextPos: TOOLTIP_POSITION.BOTTOM.MIDDLE
                            }
                        }
                    },
                    {
                        pos: {x: 0.4, y: 0.85},
                        title: XOR_TITLE,
                        description: XOR_DESCRIPTION,
                        content: {
                            data: new Array(length + 2).fill(XOR_BOX_CONTENT),
                            options: {
                                textSize: 12,
                                onHoverInfo: true,
                                hoverInfoPos: TOOLTIP_POSITION.RIGHT.BOTTOM,
                                onHoverText: false,
                                hoverTextPos: TOOLTIP_POSITION.BOTTOM.MIDDLE
                            }
                        }
                    },
                    {
                        pos: {x: 0.15, y: 0.85},
                        title: OLD_BLOCK,
                        description: OLD_BLOCK_DESCRIPTION,
                        content: {
                            data: ['null', ...multiH.slice(0, multiH.length - 1)],
                            options: {
                                textSize: 12,
                                onHoverInfo: true,
                                hoverInfoPos: TOOLTIP_POSITION.RIGHT.BOTTOM,
                                onHoverText: true,
                                showTitle: true,
                                showText: true,
                                hoverTextPos: TOOLTIP_POSITION.RIGHT.MIDDLE
                            }
                        }
                    },
                    {
                        pos: {x: 0.8, y: 0.85},
                        title: 'Ciphertext after XOR operation',
                        description: 'cipher_xored',
                        content: {
                            data: cipherXored,
                            options: {
                                textSize: 12,
                                onHoverInfo: false,
                                hoverInfoPos: TOOLTIP_POSITION.RIGHT.TOP,
                                onHoverText: true,
                                showTitle: true,
                                showText: true,
                                hoverTextPos: TOOLTIP_POSITION.LEFT.MIDDLE
                            }
                        }
                    },
                    {
                        pos: {x: 0.80, y: 0.7},
                        title: MULTIPLICATION_IN_GALOIS_FIELD,
                        description: MULTIPLICATION_IN_GALOIS_FIELD_DESCRIPTION,
                        content: {
                            data: new Array(length + 2).fill('MultiH'),
                            options: {
                                textSize: 12,
                                onHoverInfo: true,
                                hoverInfoPos: TOOLTIP_POSITION.LEFT.BOTTOM,
                                onHoverText: false,
                                hoverTextPos: TOOLTIP_POSITION.BOTTOM.MIDDLE
                            }
                        }
                    },
                    {
                        pos: {x: 0.8, y: 0.55},
                        title: NEW_BLOCK,
                        description: NEW_BLOCK_DESCRIPTION,
                        content: {
                            data: multiH,
                            options: {
                                textSize: 12,
                                onHoverInfo: false,
                                hoverInfoPos: TOOLTIP_POSITION.RIGHT.TOP,
                                showTitle: true,
                                onHoverText: true,
                                showText: true,
                                hoverTextPos: TOOLTIP_POSITION.LEFT.MIDDLE
                            }
                        }
                    },
                    {
                        pos: {x: 0.60, y: 0.25},
                        title: HASH_KEY,
                        description: HASH_KEY_DESCRIPTION,
                        content: {
                            data: new Array(length + 2).fill(h),
                            options: {
                                textSize: 12,
                                onHoverInfo: true,
                                hoverInfoPos: TOOLTIP_POSITION.RIGHT.TOP,
                                showTitle: true,
                                onHoverText: true,
                                showText: true,
                                hoverTextPos: TOOLTIP_POSITION.BOTTOM.MIDDLE
                            }
                        }
                    },

                    {
                        pos: {x: 0.8, y: 0.4},
                        title: 'Signature Fragment',
                        description: NEW_BLOCK_DESCRIPTION,
                        content: {
                            data: new Array(length + 2).fill('New Block'),
                            options: {
                                textSize: 12,
                                onHoverInfo: true,
                                hoverInfoPos: TOOLTIP_POSITION.LEFT.TOP,
                                onHoverText: true,
                                showText: false,
                                hoverTextPos: TOOLTIP_POSITION.BOTTOM.MIDDLE
                            }
                        }
                    }
                ]
            ),
            [
                {
                    pos: {x: 0.15, y: 0.1},
                    title: CTR_TITLE,
                    description: CTR_DESCRIPTION,
                    content: {
                        data: new Array(length + 2).fill(ivData[0]),
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
                    pos: {x: 0.15, y: 0.25},
                    title: AES_TITLE,
                    description: AES_DESCRIPTION,
                    content: {
                        data: new Array(length + 2).fill(AES_BOX_CONTENT),
                        options: {
                            showTitle: false,
                            textSize: 12,
                            onHoverInfo: true,
                            hoverInfoPos: TOOLTIP_POSITION.RIGHT.TOP,
                            onHoverText: false,
                            hoverTextPos: TOOLTIP_POSITION.BOTTOM.MIDDLE
                        }
                    }
                },
                {
                    pos: {x: 0.35, y: 0.25},
                    title: KEY_TITLE,
                    description: KEY_DESCRIPTION,
                    content: {
                        data: new Array(length + 2).fill(key),
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
                    pos: {x: 0.15, y: 0.40},
                    title: 'Outcome of AES operation',
                    description: 'counter0_encrypted',
                    content: {
                        data: new Array(length + 2).fill(encryptedCounter0),
                        options: {
                            showTitle: true,
                            textSize: 12,
                            onHoverInfo: false,
                            hoverInfoPos: TOOLTIP_POSITION.RIGHT.TOP,
                            onHoverText: true,
                            showText: true,
                            hoverTextPos: TOOLTIP_POSITION.RIGHT.MIDDLE
                        }
                    }
                },
                {
                    pos: {x: 0.4, y: 0.55},
                    title: XOR_TITLE,
                    description: XOR_DESCRIPTION,
                    content: {
                        data: new Array(length + 2).fill(XOR_BOX_CONTENT),
                        options: {
                            showTitle: false,
                            textSize: 12,
                            onHoverInfo: true,
                            hoverInfoPos: TOOLTIP_POSITION.RIGHT.TOP,
                            onHoverText: false,
                            hoverTextPos: TOOLTIP_POSITION.BOTTOM.MIDDLE
                        }
                    }
                },
                {
                    pos: {x: 0.53, y: 0.1},
                    title: OLD_BLOCK,
                    description: OLD_BLOCK_DESCRIPTION,
                    content: {
                        data: new Array(length + 2).fill(multiH[multiH.length - 1]),
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
                    pos: {x: 0.7, y: 0.25},
                    title: XOR_TITLE,
                    description: XOR_DESCRIPTION,
                    content: {
                        data: new Array(length + 2).fill(XOR_BOX_CONTENT),
                        options: {
                            showTitle: false,
                            textSize: 12,
                            onHoverInfo: true,
                            hoverInfoPos: TOOLTIP_POSITION.RIGHT.TOP,
                            onHoverText: false,
                            hoverTextPos: TOOLTIP_POSITION.BOTTOM.MIDDLE
                        }
                    }
                },
                {
                    pos: {x: 0.83, y: 0.1},
                    title: LENGTH_C,
                    description: LENGTH_C_DESCRIPTION,
                    content: {
                        data: new Array(length + 2).fill(lenC),
                        options: {
                            showTitle: true,
                            textSize: 12,
                            onHoverInfo: true,
                            hoverInfoPos: TOOLTIP_POSITION.LEFT.TOP,
                            onHoverText: true,
                            showText: true,
                            hoverTextPos: TOOLTIP_POSITION.LEFT.MIDDLE
                        }
                    }
                },
                {
                    pos: {x: 0.7, y: 0.40},
                    title: 'Outcome of XOR operation',
                    description: 'xored_len_c',
                    content: {
                        data: new Array(length + 2).fill(xoredLenC),
                        options: {
                            showTitle: true,
                            textSize: 12,
                            onHoverInfo: false,
                            hoverInfoPos: TOOLTIP_POSITION.RIGHT.TOP,
                            onHoverText: true,
                            showText: true,
                            hoverTextPos: TOOLTIP_POSITION.BOTTOM.MIDDLE
                        }
                    }
                },
                {
                    pos: {x: 0.7, y: 0.55},
                    title: MULTIPLICATION_IN_GALOIS_FIELD,
                    description: MULTIPLICATION_IN_GALOIS_FIELD_DESCRIPTION,
                    content: {
                        data: new Array(length + 2).fill('MultiH'),
                        options: {
                            showTitle: false,
                            textSize: 12,
                            onHoverInfo: true,
                            hoverInfoPos: TOOLTIP_POSITION.RIGHT.TOP,
                            onHoverText: false,
                            hoverTextPos: TOOLTIP_POSITION.BOTTOM.MIDDLE
                        }
                    }
                },
                {
                    pos: {x: 0.83, y: 0.7},
                    title: HASH_KEY,
                    description: HASH_KEY_DESCRIPTION,
                    content: {
                        data: new Array(length + 2).fill(h),
                        options: {
                            showTitle: true,
                            textSize: 12,
                            onHoverInfo: true,
                            hoverInfoPos: TOOLTIP_POSITION.LEFT.TOP,
                            onHoverText: true,
                            showText: true,
                            hoverTextPos: TOOLTIP_POSITION.LEFT.MIDDLE
                        }
                    }
                },
                {
                    pos: {x: 0.65, y: 0.85},
                    title: 'Outcome of Multiplication in Galois Field',
                    description: 'multi_h_len_c',
                    content: {
                        data: new Array(length + 2).fill(multiHLenC),
                        options: {
                            showTitle: true,
                            textSize: 12,
                            onHoverInfo: false,
                            hoverInfoPos: TOOLTIP_POSITION.RIGHT.TOP,
                            onHoverText: true,
                            showText: true,
                            hoverTextPos: TOOLTIP_POSITION.TOP.MIDDLE
                        }
                    }
                },
                {
                    pos: {x: 0.15, y: 0.7},
                    title: AUTH_TAG,
                    description: AUTH_TAG_DESCRIPTION,
                    content: {
                        data: new Array(length + 2).fill(xoredCounter0),
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
            ]
        ],
        connections: [
            [
                {
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
                },
                {
                    from: {boxId: 6, arrowOut: SIDE.DOWN},
                    to: {boxId: 7, arrowIn: SIDE.UP},
                    connectionColor: 'black',
                    arrowSize: 10,
                    dotSize: 5,
                    dotColor: 'red'
                },
                {
                    from: {boxId: 8, arrowOut: SIDE.RIGHT},
                    to: {boxId: 7, arrowIn: SIDE.LEFT},
                    connectionColor: 'black',
                    arrowSize: 10,
                    dotSize: 5,
                    dotColor: 'red'
                },
                {
                    from: {boxId: 7, arrowOut: SIDE.RIGHT},
                    to: {boxId: 9, arrowIn: SIDE.LEFT},
                    connectionColor: 'black',
                    arrowSize: 10,
                    dotSize: 5,
                    dotColor: 'red'
                },
                {
                    from: {boxId: 9, arrowOut: SIDE.RIGHT},
                    to: {boxId: 10, arrowIn: SIDE.LEFT},
                    connectionColor: 'black',
                    arrowSize: 10,
                    dotSize: 5,
                    dotColor: 'red'
                },
            ],
            ...new Array(length - 1).fill([
                {
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
                },
                {
                    from: {boxId: 6, arrowOut: SIDE.DOWN},
                    to: {boxId: 7, arrowIn: SIDE.UP},
                    connectionColor: 'black',
                    arrowSize: 10,
                    dotSize: 5,
                    dotColor: 'red'
                },
                {
                    from: {boxId: 8, arrowOut: SIDE.RIGHT},
                    to: {boxId: 7, arrowIn: SIDE.LEFT},
                    connectionColor: 'black',
                    arrowSize: 10,
                    dotSize: 5,
                    dotColor: 'red'
                },
                {
                    from: {boxId: 7, arrowOut: SIDE.RIGHT},
                    to: {boxId: 9, arrowIn: SIDE.LEFT},
                    connectionColor: 'black',
                    arrowSize: 10,
                    dotSize: 5,
                    dotColor: 'red'
                },
                {
                    from: {boxId: 9, arrowOut: SIDE.UP},
                    to: {boxId: 10, arrowIn: SIDE.DOWN},
                    connectionColor: 'black',
                    arrowSize: 10,
                    dotSize: 5,
                    dotColor: 'red'
                },
                {
                    from: {boxId: 10, arrowOut: SIDE.UP},
                    to: {boxId: 11, arrowIn: SIDE.DOWN},
                    connectionColor: 'black',
                    arrowSize: 10,
                    dotSize: 5,
                    dotColor: 'red'
                },
                {
                    from: {boxId: 12, arrowOut: SIDE.DOWN},
                    to: {boxId: 10, arrowIn: SIDE.LEFT},
                    connectionColor: 'black',
                    arrowSize: 10,
                    dotSize: 5,
                    dotColor: 'red'
                },
                {
                    from: {boxId: 11, arrowOut: SIDE.UP},
                    to: {boxId: 13, arrowIn: SIDE.DOWN},
                    connectionColor: 'black',
                    arrowSize: 10,
                    dotSize: 5,
                    dotColor: 'red'
                }
            ]),
            [
                {
                    from: {boxId: 0, arrowOut: SIDE.DOWN},
                    to: {boxId: 1, arrowIn: SIDE.UP},
                    connectionColor: 'black',
                    arrowSize: 10,
                    dotSize: 5,
                    dotColor: 'red'
                },
                {
                    from: {boxId: 2, arrowOut: SIDE.LEFT},
                    to: {boxId: 1, arrowIn: SIDE.RIGHT},
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
                    from: {boxId: 3, arrowOut: SIDE.RIGHT},
                    to: {boxId: 4, arrowIn: SIDE.UP},
                    connectionColor: 'black',
                    arrowSize: 10,
                    dotSize: 5,
                    dotColor: 'red'
                },
                {
                    from: {boxId: 5, arrowOut: SIDE.DOWN},
                    to: {boxId: 6, arrowIn: SIDE.LEFT},
                    connectionColor: 'black',
                    arrowSize: 10,
                    dotSize: 5,
                    dotColor: 'red'
                },
                {
                    from: {boxId: 7, arrowOut: SIDE.DOWN},
                    to: {boxId: 6, arrowIn: SIDE.RIGHT},
                    connectionColor: 'black',
                    arrowSize: 10,
                    dotSize: 5,
                    dotColor: 'red'
                },
                {
                    from: {boxId: 6, arrowOut: SIDE.DOWN},
                    to: {boxId: 8, arrowIn: SIDE.UP},
                    connectionColor: 'black',
                    arrowSize: 10,
                    dotSize: 5,
                    dotColor: 'red'
                },
                {
                    from: {boxId: 8, arrowOut: SIDE.DOWN},
                    to: {boxId: 9, arrowIn: SIDE.UP},
                    connectionColor: 'black',
                    arrowSize: 10,
                    dotSize: 5,
                    dotColor: 'red'
                },
                {
                    from: {boxId: 10, arrowOut: SIDE.UP},
                    to: {boxId: 9, arrowIn: SIDE.RIGHT},
                    connectionColor: 'black',
                    arrowSize: 10,
                    dotSize: 5,
                    dotColor: 'red'
                },
                {
                    from: {boxId: 9, arrowOut: SIDE.LEFT},
                    to: {boxId: 11, arrowIn: SIDE.UP},
                    connectionColor: 'black',
                    arrowSize: 10,
                    dotSize: 5,
                    dotColor: 'red'
                },
                {
                    from: {boxId: 11, arrowOut: SIDE.LEFT},
                    to: {boxId: 4, arrowIn: SIDE.DOWN},
                    connectionColor: 'black',
                    arrowSize: 10,
                    dotSize: 5,
                    dotColor: 'red'
                },
                {
                    from: {boxId: 4, arrowOut: SIDE.LEFT},
                    to: {boxId: 12, arrowIn: SIDE.UP},
                    connectionColor: 'black',
                    arrowSize: 10,
                    dotSize: 5,
                    dotColor: 'red'
                }
            ]
        ],
        connectionAnimation: {
            data: [
                [
                    {animations: [0, 1]},
                    {animations: [2]},
                    {animations: [3, 4]},
                    {animations: [5]},
                    {animations: [6, 7]},
                    {animations: [8]},
                    {animations: [9]}
                ],
                ...new Array(length - 1).fill([
                    {animations: [0, 1]},
                    {animations: [2]},
                    {animations: [3, 4]},
                    {animations: [5]},
                    {animations: [6, 7]},
                    {animations: [8]},
                    {animations: [9, 11]},
                    {animations: [10]},
                    {animations: [12]}
                ]),
                [
                    {animations: [4, 5]},
                    {animations: [6]},
                    {animations: [0, 1, 7, 8]},
                    {animations: [2, 9]},
                    {animations: [3, 10]},
                    {animations: [11]}
                ]
            ],
            options: {
                speed: 0.20
            }
        },
        contents: length + 1
    };
}

export const gcm = (data, key, iv, blockSize, padding) => {
    const paddedData = padding.pad(data, blockSize);
    const splicedData = slice(paddedData, blockSize);

    const plaintextData = splicedData.map((d) => wa2hex(d));
    let ivData = [iv];
    let ciphertextData = [];
    let semiEncrypted = [];
    let cipherXored = [];
    let multiH = [];
    let xoredLenC = null;
    let multiHLenC = null;
    let encryptedCounter0 = encrypt(iv, key);
    let xoredCounter0 = null;
    let h = encrypt('0'.repeat(32), key);
    let lenC = num2hex(bigInt(splicedData.length).multiply(bigInt(blockSize)));
    lenC = lenC.padStart(32, '0');

    ivData.push(num2hex(hex2num(ivData[0]).add(1)));

    plaintextData.forEach((hexPlain, i) => {
        const ctrNounce = ivData[i + 1];
        const semiEncrypt = encrypt(ctrNounce, key);
        semiEncrypted.push(semiEncrypt);
        const encrypted = xor(hexPlain, semiEncrypt);
        ciphertextData.push(encrypted);
        let cipherXor = null;
        let multiHVal = null;
        if (i === 0) {
            cipherXor = xor(encryptedCounter0, '0'.repeat(32));
            multiHVal = multiplyGF128(h, cipherXor);
        } else {
            cipherXor = xor(ciphertextData[i - 1], encrypted);
            multiHVal = multiplyGF128(h, cipherXor);
        }
        cipherXored.push(cipherXor);
        multiH.push(multiHVal);
        ivData.push(num2hex(hex2num(ctrNounce).add(1)));
    });

    xoredLenC = xor(multiH[multiH.length - 1], lenC);
    multiHLenC = multiplyGF128(h, xoredLenC);
    xoredCounter0 = xor(multiHLenC, encryptedCounter0);

    return elements(plaintextData, ivData, ciphertextData, semiEncrypted, cipherXored, multiH, xoredLenC, multiHLenC, encryptedCounter0, xoredCounter0, key, h, lenC);
}
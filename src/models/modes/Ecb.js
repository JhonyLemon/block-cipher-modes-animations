import {Mode} from "./Mode";
import {buf2hex, encrypt} from "../../util/CryptoHelpers";
import {arrowDot, ArrowToShapes, Direction, HexTextWithBorder, TextWithBorder} from "../CustomShape";
import {Frame} from "../animation/Frame";
import {AnimationFrames} from "../animation/AnimationFrames";
import CryptoJS from "crypto-js";

export const Ecb = class extends Mode {
    constructor() {
        super();
    }

    getAnimation(data, cipher) {
        const frames = []
        const key = cipher.key;
        const paddedArrayBuffer = data.getPaddedContent(cipher.padding, cipher.blockSize);
        const blocks = paddedArrayBuffer.byteLength * 8 / cipher.blockSize;

        for (let i = 0; i < blocks; i++) {
            const block = paddedArrayBuffer.slice(i * cipher.blockSize / 8, (i + 1) * cipher.blockSize / 8)
            const message = buf2hex(block);
            const ciphertext = encrypt(CryptoJS.lib.WordArray.create(new Uint8Array(this.content)), CryptoJS.mode.ECB, key);

            const messageShapes = HexTextWithBorder({
                text: message,
                x: this.getX(0.5),
                y: this.getY(0.2),
                fontSize: 24,
                stroke: 'black',
                strokeWidth: 1
            });

            const keyShapes = HexTextWithBorder({
                text: key,
                x: this.getX(0.2),
                y: this.getY(0.5),
                fontSize: 24,
                stroke: 'black',
                strokeWidth: 1
            });

            const ciphertextShapes = HexTextWithBorder({
                text: ciphertext,
                x: this.getX(0.5),
                y: this.getY(0.8),
                fontSize: 24,
                stroke: 'black',
                strokeWidth: 1
            });

            const aesBlock = TextWithBorder(
                {
                    text: 'AES',
                    x: this.getX(0.5),
                    y: this.getY(0.5),
                    fontSize: 32,
                    stroke: 'black',
                    strokeWidth: 1
                },
                {
                    stroke: 'black',
                    strokeWidth: 1,
                },
                10
            );

            const arrowAnimMessageToBlock = ArrowToShapes(
                messageShapes,
                aesBlock,
                {
                    fill: 'black',
                    stroke: 'black'
                },
                Direction.DOWN,
                Direction.UP,
                10
            );
            const dotArrowAnimMessageToBlock = arrowDot(arrowAnimMessageToBlock);

            const arrowAnimKeyToBlock = ArrowToShapes(
                keyShapes,
                aesBlock,
                {
                    fill: 'black',
                    stroke: 'black'
                },
                Direction.RIGHT,
                Direction.LEFT,
                10
            );
            const dotArrowAnimKeyToBlock = arrowDot(arrowAnimKeyToBlock);

            const arrowAnimBlockToCipher = ArrowToShapes(
                aesBlock,
                ciphertextShapes,
                {
                    fill: 'black',
                    stroke: 'black'
                },
                Direction.DOWN,
                Direction.UP,
                10
            )
            const dotArrowAnimBlockToCipher = arrowDot(arrowAnimBlockToCipher);

            const maxLen = Math.max(dotArrowAnimMessageToBlock.length, dotArrowAnimKeyToBlock.length);
            for (let i = 0; i < maxLen; i++) {
                const frame = new Frame();
                frame.frameSpeedMs = 10;

                frame.shapes.push(...messageShapes, ...keyShapes, ...ciphertextShapes, ...aesBlock, ...arrowAnimMessageToBlock, ...arrowAnimKeyToBlock, ...arrowAnimBlockToCipher);
                if (i < dotArrowAnimMessageToBlock.length) frame.shapes.push(dotArrowAnimMessageToBlock[i]);
                if (i < dotArrowAnimKeyToBlock.length) frame.shapes.push(dotArrowAnimKeyToBlock[i]);
                frames.push(frame);
            }
            for (let i = 0; i < dotArrowAnimBlockToCipher.length; i++) {
                const frame = new Frame();
                frame.frameSpeedMs = 10;
                frame.shapes.push(...messageShapes, ...keyShapes, ...ciphertextShapes, ...aesBlock, ...arrowAnimMessageToBlock, ...arrowAnimKeyToBlock, ...arrowAnimBlockToCipher);
                frame.shapes.push(dotArrowAnimBlockToCipher[i]);
                frames.push(frame);
            }
        }

        return AnimationFrames.withFrames(frames);
    }

}
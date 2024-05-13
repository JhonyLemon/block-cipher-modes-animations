
import {arrowDot, ArrowToShapes, Direction, HexTextWithBorder, TextWithBorder} from "../CustomShape";
import {Frame} from "../animation/Frame";
import {AnimationFrames} from "../animation/AnimationFrames";
import CryptoJS from "crypto-js";
import {Mode} from "./Mode";

export const Cbc = class extends Mode {
    constructor() {
        super(CryptoJS.mode.CBC);
    }

    getAnimation(data, cipher) {
        const frames = []
        const paddedArrayBuffer = this.getPaddedContent(data, cipher)
        for (let i = 0; i < this.getNumberOfSlices(paddedArrayBuffer, cipher); i++) {
            const block = this.getBlockSlice(paddedArrayBuffer, cipher, i);
            const message = this.getConvertedBlock(block);
            const ciphertext = this.getEncryption(block, cipher)

            const messageShapes = HexTextWithBorder({
                text: message,
                x: this.getX(0.5),
                y: this.getY(0.2),
                fontSize: 24,
                stroke: 'black',
                strokeWidth: 1
            });

            const keyShapes = HexTextWithBorder({
                text: cipher.key,
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

            const newBlockFrame = new Frame();
            newBlockFrame.shapes.push(...messageShapes, ...keyShapes, ...ciphertextShapes, ...aesBlock, ...arrowAnimMessageToBlock, ...arrowAnimKeyToBlock, ...arrowAnimBlockToCipher);
            newBlockFrame.isNewBlock = true;
            frames.push(newBlockFrame);
            frames.push(...this.getMergedDotAnimation(
                [dotArrowAnimMessageToBlock, dotArrowAnimKeyToBlock],
                10,
                [messageShapes, keyShapes, ciphertextShapes, aesBlock, arrowAnimMessageToBlock, arrowAnimKeyToBlock, arrowAnimBlockToCipher]
            ))
            frames.push(...this.getMergedDotAnimation(
                [dotArrowAnimBlockToCipher],
                10,
                [messageShapes, keyShapes, ciphertextShapes, aesBlock, arrowAnimMessageToBlock, arrowAnimKeyToBlock, arrowAnimBlockToCipher]
            ))
        }
        return AnimationFrames.withFrames(frames);
    }

}
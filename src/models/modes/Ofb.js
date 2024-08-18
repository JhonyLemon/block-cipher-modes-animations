import {arrowDot, ArrowToShapes, Direction, HexTextWithBorder, TextWithBorder} from "../CustomShape";
import {Frame} from "../animation/Frame";
import {AnimationFrames} from "../animation/AnimationFrames";
import CryptoJS from "crypto-js";
import {Mode} from "./Mode";
import {xor} from "../../util/CryptoHelpers";

export const Ofb = class extends Mode {
    constructor() {
        super(CryptoJS.mode.OFB);
    }

    getAnimation(data, cipher) {
        const frames = []
        const paddedArrayBuffer = this.getPaddedContent(data, cipher)
        let iv = cipher.iv;
        for (let i = 0; i < this.getNumberOfSlices(paddedArrayBuffer, cipher); i++) {
            const block = this.getBlockSlice(paddedArrayBuffer, cipher, i);
            const message = this.getConvertedBlock(block);
            const ciphertext = this.getEncryption(block, cipher)

            const ivShapes = HexTextWithBorder({
                text: iv,
                x: this.getX(0.5),
                y: this.getY(0.2),
                fontSize: 24,
                stroke: 'black',
                strokeWidth: 1
            });

            const keyShapes = HexTextWithBorder({
                text: cipher.key,
                x: this.getX(0.2),
                y: this.getY(0.3),
                fontSize: 24,
                stroke: 'black',
                strokeWidth: 1
            });

            const messageShapes = HexTextWithBorder({
                text: message,
                x: this.getX(0.2),
                y: this.getY(0.5),
                fontSize: 24,
                stroke: 'black',
                strokeWidth: 1
            });

            const xoredShapes = HexTextWithBorder({
                text: xor(iv, message),
                x: this.getX(0.5),
                y: this.getY(0.4),
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
                    y: this.getY(0.3),
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

            const xorBlock = TextWithBorder(
                {
                    text: 'XOR',
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

            const newIvBlock = TextWithBorder(
                {
                    text: 'New IV',
                    x: this.getX(0.85),
                    y: this.getY(0.8),
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

            const arrowAnimIvToAesBlock = ArrowToShapes(
                ivShapes,
                aesBlock,
                {
                    fill: 'black',
                    stroke: 'black'
                },
                Direction.DOWN,
                Direction.UP,
                10
            );
            const dotArrowAnimIvToAesBlock = arrowDot(arrowAnimIvToAesBlock);

            const arrowAnimKeyToAesBlock = ArrowToShapes(
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
            const dotArrowAnimKeyToAesBlock = arrowDot(arrowAnimKeyToAesBlock);

            const arrowAnimAesBlockToXorBlock = ArrowToShapes(
                aesBlock,
                xorBlock,
                {
                    fill: 'black',
                    stroke: 'black'
                },
                Direction.DOWN,
                Direction.UP,
                10
            );
            const dotArrowAnimAesBlockToXorBlock = arrowDot(arrowAnimAesBlockToXorBlock);

            const arrowAnimMessageToXorBlock = ArrowToShapes(
                messageShapes,
                xorBlock,
                {
                    fill: 'black',
                    stroke: 'black'
                },
                Direction.RIGHT,
                Direction.LEFT,
                10
            );
            const dotArrowAnimMessageToXorBlock = arrowDot(arrowAnimMessageToXorBlock);

            const arrowAnimXorBlockToCipher = ArrowToShapes(
                xorBlock,
                ciphertextShapes,
                {
                    fill: 'black',
                    stroke: 'black'
                },
                Direction.DOWN,
                Direction.UP,
                10
            );
            const dotArrowAnimXorBlockToCipher = arrowDot(arrowAnimXorBlockToCipher);

            const arrowAnimCipherToNeIv = ArrowToShapes(
                ciphertextShapes,
                newIvBlock,
                {
                    fill: 'black',
                    stroke: 'black'
                },
                Direction.RIGHT,
                Direction.LEFT,
                10
            )
            const dotArrowAnimCipherToNewIv = arrowDot(arrowAnimCipherToNeIv);

            const newBlockFrame = new Frame();
            newBlockFrame.shapes.push(...messageShapes, ...keyShapes, ...ciphertextShapes, ...aesBlock, ...ivShapes, ...xorBlock, ...newIvBlock, ...arrowAnimIvToAesBlock, ...arrowAnimKeyToAesBlock, ...arrowAnimAesBlockToXorBlock, ...arrowAnimMessageToXorBlock, ...arrowAnimXorBlockToCipher, ...arrowAnimCipherToNeIv);
            newBlockFrame.isNewBlock = true;
            frames.push(newBlockFrame);
            frames.push(...this.getMergedDotAnimation(
                [dotArrowAnimIvToAesBlock, dotArrowAnimKeyToAesBlock],
                10,
                [messageShapes, keyShapes, ciphertextShapes, aesBlock, ivShapes, xorBlock, newIvBlock, arrowAnimIvToAesBlock, arrowAnimKeyToAesBlock, arrowAnimAesBlockToXorBlock, arrowAnimMessageToXorBlock, arrowAnimXorBlockToCipher, arrowAnimCipherToNeIv]
            ))
            frames.push(...this.getMergedDotAnimation(
                [dotArrowAnimAesBlockToXorBlock, dotArrowAnimMessageToXorBlock],
                10,
                [messageShapes, keyShapes, ciphertextShapes, aesBlock, ivShapes, xorBlock, newIvBlock, arrowAnimIvToAesBlock, arrowAnimKeyToAesBlock, arrowAnimAesBlockToXorBlock, arrowAnimMessageToXorBlock, arrowAnimXorBlockToCipher, arrowAnimCipherToNeIv]
            ))
            frames.push(...this.getMergedDotAnimation(
                [dotArrowAnimXorBlockToCipher],
                10,
                [messageShapes, keyShapes, ciphertextShapes, aesBlock, ivShapes, xorBlock, newIvBlock, arrowAnimIvToAesBlock, arrowAnimKeyToAesBlock, arrowAnimAesBlockToXorBlock, arrowAnimMessageToXorBlock, arrowAnimXorBlockToCipher, arrowAnimCipherToNeIv]
            ))
            frames.push(...this.getMergedDotAnimation(
                [dotArrowAnimCipherToNewIv],
                10,
                [messageShapes, keyShapes, ciphertextShapes, aesBlock, ivShapes, xorBlock, newIvBlock, arrowAnimIvToAesBlock, arrowAnimKeyToAesBlock, arrowAnimAesBlockToXorBlock, arrowAnimMessageToXorBlock, arrowAnimXorBlockToCipher, arrowAnimCipherToNeIv]
            ))
            iv = ciphertext;
        }
        return AnimationFrames.withFrames(frames);
    }

}
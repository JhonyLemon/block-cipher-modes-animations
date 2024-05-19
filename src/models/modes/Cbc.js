
import {arrowDot, ArrowToShapes, Direction, HexTextWithBorder, TextWithBorder} from "../CustomShape";
import {Frame} from "../animation/Frame";
import {AnimationFrames} from "../animation/AnimationFrames";
import CryptoJS from "crypto-js";
import {Mode} from "./Mode";
import {xor} from "../../util/CryptoHelpers";

export const Cbc = class extends Mode {
    constructor() {
        super(CryptoJS.mode.CBC);
    }

    getAnimation(data, cipher) {
        const frames = []
        const paddedArrayBuffer = this.getPaddedContent(data, cipher)
        let iv = cipher.iv;
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

            const ivShapes = HexTextWithBorder({
                text: iv,
                x: this.getX(0.2),
                y: this.getY(0.3),
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

            const xorBlock = TextWithBorder(
                {
                    text: 'XOR',
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

            const arrowAnimMessageToXorBlock = ArrowToShapes(
                messageShapes,
                xorBlock,
                {
                    fill: 'black',
                    stroke: 'black'
                },
                Direction.DOWN,
                Direction.UP,
                10
            );
            const dotArrowAnimMessageToXorBlock = arrowDot(arrowAnimMessageToXorBlock);

            const arrowAnimXorToXored = ArrowToShapes(
                xorBlock,
                xoredShapes,
                {
                    fill: 'black',
                    stroke: 'black'
                },
                Direction.DOWN,
                Direction.UP,
                10
            );
            const dotArrowAnimXorToXored = arrowDot(arrowAnimXorToXored);

            const arrowAnimXoredToBlock = ArrowToShapes(
                xoredShapes,
                aesBlock,
                {
                    fill: 'black',
                    stroke: 'black'
                },
                Direction.DOWN,
                Direction.UP,
                10
            );
            const dotArrowAnimXoredToBlock = arrowDot(arrowAnimXoredToBlock);

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

            const arrowAnimIvToXor = ArrowToShapes(
                ivShapes,
                xorBlock,
                {
                    fill: 'black',
                    stroke: 'black'
                },
                Direction.RIGHT,
                Direction.LEFT,
                10
            );
            const dotArrowAnimIvToXor = arrowDot(arrowAnimIvToXor);

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

            const arrowAnimCipherToNewIv = ArrowToShapes(
                ciphertextShapes,
                newIvBlock,
                {
                    fill: 'black',
                    stroke: 'black'
                },
                Direction.RIGHT,
                Direction.LEFT,
                10
            );
            const dotArrowAnimCipherToNewIv = arrowDot(arrowAnimCipherToNewIv);

            const newBlockFrame = new Frame();
            newBlockFrame.shapes.push(...messageShapes, ...keyShapes, ...ciphertextShapes, ...aesBlock, ...ivShapes, ...xorBlock, ...xoredShapes, ...newIvBlock, ...arrowAnimMessageToXorBlock, ...arrowAnimXorToXored, ...arrowAnimXoredToBlock, ...arrowAnimKeyToBlock, ...arrowAnimIvToXor, ...arrowAnimBlockToCipher, ...arrowAnimCipherToNewIv);
            newBlockFrame.isNewBlock = true;
            frames.push(newBlockFrame);
            frames.push(...this.getMergedDotAnimation(
                [dotArrowAnimMessageToXorBlock, dotArrowAnimIvToXor],
                10,
                [messageShapes, keyShapes, ciphertextShapes, aesBlock, ivShapes, xorBlock, xoredShapes, newIvBlock, arrowAnimMessageToXorBlock, arrowAnimXorToXored, arrowAnimXoredToBlock, arrowAnimKeyToBlock, arrowAnimIvToXor, arrowAnimBlockToCipher,arrowAnimCipherToNewIv]
            ))
            frames.push(...this.getMergedDotAnimation(
                [dotArrowAnimXorToXored],
                10,
                [messageShapes, keyShapes, ciphertextShapes, aesBlock, ivShapes, xorBlock, xoredShapes, newIvBlock, arrowAnimMessageToXorBlock, arrowAnimXorToXored, arrowAnimXoredToBlock, arrowAnimKeyToBlock, arrowAnimIvToXor, arrowAnimBlockToCipher,arrowAnimCipherToNewIv]
            ))
            frames.push(...this.getMergedDotAnimation(
                [dotArrowAnimXoredToBlock, dotArrowAnimKeyToBlock],
                10,
                [messageShapes, keyShapes, ciphertextShapes, aesBlock, ivShapes, xorBlock, xoredShapes, newIvBlock, arrowAnimMessageToXorBlock, arrowAnimXorToXored, arrowAnimXoredToBlock, arrowAnimKeyToBlock, arrowAnimIvToXor, arrowAnimBlockToCipher,arrowAnimCipherToNewIv]
            ))
            frames.push(...this.getMergedDotAnimation(
                [dotArrowAnimBlockToCipher],
                10,
                [messageShapes, keyShapes, ciphertextShapes, aesBlock, ivShapes, xorBlock, xoredShapes, newIvBlock, arrowAnimMessageToXorBlock, arrowAnimXorToXored, arrowAnimXoredToBlock, arrowAnimKeyToBlock, arrowAnimIvToXor, arrowAnimBlockToCipher,arrowAnimCipherToNewIv]
            ))
                frames.push(...this.getMergedDotAnimation(
                [dotArrowAnimCipherToNewIv],
                10,
                    [messageShapes, keyShapes, ciphertextShapes, aesBlock, ivShapes, xorBlock, xoredShapes, newIvBlock, arrowAnimMessageToXorBlock, arrowAnimXorToXored, arrowAnimXoredToBlock, arrowAnimKeyToBlock, arrowAnimIvToXor, arrowAnimBlockToCipher,arrowAnimCipherToNewIv]
            ))
            iv = ciphertext;
        }
        return AnimationFrames.withFrames(frames);
    }

}
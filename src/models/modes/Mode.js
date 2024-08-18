import {AnimationFrames} from "../animation/AnimationFrames";
import {buf2hex, encrypt} from "../../util/CryptoHelpers";
import {CipherData} from "../CipherData";
import {Data} from "../Data";
import {Frame} from "../animation/Frame";
import {ShapeHolder} from "../animation/ShapeHolder";

export const Mode = class {
    mode;

    constructor(mode) {
        this.mode = mode;
    }

    getPaddedContent(data: Data, cipher: CipherData) {
        return data.getPaddedContent(cipher.padding, cipher.blockSize);
    }

    getNumberOfSlices(data: ArrayBuffer, cipher: CipherData) {
        return data.byteLength * 8 / cipher.blockSize;
    }

    getBlockSlice(data: ArrayBuffer, cipher: CipherData, i: number) {
        return data.slice(i * cipher.blockSize / 8, (i + 1) * cipher.blockSize / 8);
    }

    getEncryption(block: ArrayBuffer, cipher: CipherData) {
        return encrypt(block, this.mode, cipher.key, cipher.iv);
    }

    getEncryption(block: ArrayBuffer, cipher: CipherData, iv) {
        return encrypt(block, this.mode, cipher.key, iv);
    }

    getConvertedBlock(block: ArrayBuffer): string {
        return buf2hex(block);
    }

    getAnimation(data: Data, cipher: CipherData) {
        return new AnimationFrames()
    }

    getMergedDotAnimation(dots: [ShapeHolder[]], animSpeed: number, staticShapes: [ShapeHolder[]]): Frame[] {
        const frames = [];
        for (let i = 0; i < Math.max(...dots.map(dot => dot.length)); i++) {
            const frame = new Frame();
            frame.frameSpeedMs = animSpeed;
            frame.shapes.push(...staticShapes.flat(2));
            dots.forEach(dot => {
                if (i < dot.length) frame.shapes.push(dot[i]);
            });
            frames.push(frame);
        }
        return frames;
    }

    getX(percentage) {
        return percentage * this.getCanvasWidth()
    }

    getY(percentage) {
        return percentage * this.getCanvasHeight()
    }

    getCanvasWidth() {
        return 10
    }

    getCanvasHeight() {
        return 10
    }

}
import {Mode} from "./Mode";
import {AnimationFrames} from "../AnimationFrames";
import {Arrow, Text} from "react-konva";
import {buf2hex, xor} from "../../util/CryptoHelpers";

export const Ecb = class extends Mode {
    constructor() {
        super();
    }

    getAnimation(data, cipher, canvasWidth, canvasHeight) {
        const frames =  []
        const key = cipher.key;
        const paddedArrayBuffer = data.getPaddedContent(cipher.padding, cipher.blockSize);
        const blocks = paddedArrayBuffer.byteLength*8 / cipher.blockSize;
        console.log(blocks)

        for (let i = 0; i < blocks; i++) {
            let ciphertext = ''
            const block = paddedArrayBuffer.slice(i * cipher.blockSize/8, (i + 1) * cipher.blockSize/8)
            frames.push(this.getFrame([
                <Text text={buf2hex(block)} x={this.getX(0.43)} y={this.getY(0.1)}/>,
                <Text text={key} x={this.getX(0.18)} y={this.getY(0.2)}/>,
                <Arrow x={this.getX(0.5)} y={this.getY(0.12)} points={[0, 0, 0, this.getY(0.07)]} fill={'black'} stroke={'black'} />,
                <Arrow x={this.getX(0.4)} y={this.getY(0.205)} points={[0, 0, this.getX(0.07), 0]} fill={'black'} stroke={'black'} />,
            ]));
            let k = 0;
            for (let j = 0; j < block.byteLength; j += 1) {
                frames.push(this.getFrame([
                    <Text text={buf2hex(block)} x={this.getX(0.43)} y={this.getY(0.1)}/>,
                    <Text text={key} x={this.getX(0.18)} y={this.getY(0.2)}/>,
                    <Text text={buf2hex(block.slice(j, j+1))+'⊕'+key.slice(k, k+2)} x={this.getX(0.487)} y={this.getY(0.20)}/>,
                    <Arrow x={this.getX(0.5)} y={this.getY(0.12)} points={[0, 0, 0, this.getY(0.07)]} fill={'black'} stroke={'black'} />,
                    <Arrow x={this.getX(0.4)} y={this.getY(0.205)} points={[0, 0, this.getX(0.07), 0]} fill={'black'} stroke={'black'} />,
                    <Arrow x={this.getX(0.5)} y={this.getY(0.22)} points={[0, 0, 0, this.getY(0.07)]} fill={'black'} stroke={'black'} />,
                    <Text text={ciphertext} x={this.getX(0.43)} y={this.getY(0.30)}/>
                ]));
                ciphertext += xor(buf2hex(block.slice(j, j+1)), key.slice(k, k+2));
                frames.push(this.getFrame([
                    <Text text={buf2hex(block)} x={this.getX(0.43)} y={this.getY(0.1)}/>,
                    <Text text={key} x={this.getX(0.18)} y={this.getY(0.2)}/>,
                    <Text text={buf2hex(block.slice(j, j+1))+'⊕'+key.slice(k, k+2)} x={this.getX(0.487)} y={this.getY(0.20)}/>,
                    <Arrow x={this.getX(0.5)} y={this.getY(0.12)} points={[0, 0, 0, this.getY(0.07)]} fill={'black'} stroke={'black'} />,
                    <Arrow x={this.getX(0.4)} y={this.getY(0.205)} points={[0, 0, this.getX(0.07), 0]} fill={'black'} stroke={'black'} />,
                    <Arrow x={this.getX(0.5)} y={this.getY(0.22)} points={[0, 0, 0, this.getY(0.07)]} fill={'black'} stroke={'black'} />,
                    <Text text={ciphertext} x={this.getX(0.43)} y={this.getY(0.30)}/>
                ]));
                k = k + 2;
            }
        }

        return new AnimationFrames(frames);
    }

}
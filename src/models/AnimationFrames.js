import { Frame } from './Frame';

export const AnimationFrames = class {
    frames: Frame[]

    constructor(frames: Frame[]) {
        this.frames = frames;
    }
}


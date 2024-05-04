import { Frame } from './Frame';

export const AnimationFrames = class {
    frames: Frame[]

    constructor() {
        this.frames = [];
    }

    static withFrames(frames: Frame[]) {
        const animationFrames = new AnimationFrames();
        animationFrames.frames = frames;
        return animationFrames;
    }
}


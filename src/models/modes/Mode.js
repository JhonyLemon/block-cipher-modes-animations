import {AnimationFrames} from "../animation/AnimationFrames";
import {VIRTUAL_CANVAS_HEIGHT, VIRTUAL_CANVAS_WIDTH} from "../../data/Constants";

export const Mode = class {
    constructor() {
    }

    getAnimation(data, cipher) {
        return new AnimationFrames()
    }

    getX(percentage) {
        return percentage * this.getCanvasWidth()
    }

    getY(percentage) {
        return percentage * this.getCanvasHeight()
    }

    getCanvasWidth() {
        return VIRTUAL_CANVAS_WIDTH
    }

    getCanvasHeight() {
        return VIRTUAL_CANVAS_HEIGHT
    }

}
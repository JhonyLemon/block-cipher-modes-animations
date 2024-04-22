import {AnimationFrames} from "../AnimationFrames";
import {Frame} from "../Frame";
import {VIRTUAL_CANVAS_HEIGHT, VIRTUAL_CANVAS_WIDTH} from "../../data/Constants";

export const Mode = class {
    constructor() {
    }

    getAnimation(data, cipher, canvasWidth, canvasHeight) {
        return new AnimationFrames([new Frame([])])
    }

    getFrame(shapes) {
        return new Frame(shapes)
    }

    getX(percentage) {
        return percentage * VIRTUAL_CANVAS_WIDTH
    }

    getY(percentage) {
        return percentage * VIRTUAL_CANVAS_HEIGHT
    }

}
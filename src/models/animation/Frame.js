import {ShapeHolder} from "./ShapeHolder";

export const Frame = class {
    shapes: ShapeHolder[];
    isNewBlock: boolean;
    frameSpeedMs: number;

    constructor() {
        this.shapes = [];
        this.frameSpeedMs = 1000;
        this.isNewBlock = false;
    }

    getFrame() {
        return this.shapes.map(shapeHolder => shapeHolder?.getShapes()).flat(1);
    }

    static withShapes(shapes: ShapeHolder[]) {
        const frame = new Frame();
        frame.shapes = shapes;
        return frame;
    }

    static withShapesAndTime(shapes: ShapeHolder[], frameSpeedMs: number) {
        const frame = new Frame();
        frame.shapes = shapes;
        frame.frameSpeedMs = frameSpeedMs;
        return frame;
    }

}
import {Shape} from "konva/lib/Shape";

export const Frame = class {
    shapes: Shape[];

    constructor(shapes: Shape[]) {
        this.shapes = shapes;
    }
}
import {Shape} from "konva/lib/Shape";
import {HexTextTooltip} from "../CustomShape";
import Konva from "konva";
import {Arrow, Circle, Line, Rect, Text} from "react-konva";

export const ShapeHolder = class {
    onHoverShapes: Shape[];
    shape: Shape;
    callback: function;
    events: {};

    constructor() {
        this.shape = null;
        this.onHoverShapes = [];
        this.events = {};
        this.callback = null;
    }

    onMouseIn(shapeObject) {
        if (this.onHoverShapes.length === 0) {
            this.onHoverShapes.push(
                ...HexTextTooltip(shapeObject)
            );

            if(this.callback) {
                this.callback();
            }
        }
    }

    onMouseOut(shapeObject) {
        if (this.onHoverShapes.length > 0) {
            this.onHoverShapes = []
            if(this.callback) {
                this.callback();
            }
        }
    }

    clearOnHoverShapes() {
        this.onHoverShapes = [];
    }

    getShapes() {
        return [this.convertToHtmlComp(this?.shape, this?.events), ...this?.onHoverShapes]
    }

    convertToHtmlComp(shape: Shape, events: {}) {
        if(shape instanceof Konva.Arrow) {
            return <Arrow {...shape} {...events} key={shape.id()}/>
        } else if(shape instanceof Konva.Line) {
            return <Line {...shape} {...events} key={shape.id()}/>
        } else if(shape instanceof Konva.Circle) {
            return <Circle {...shape} {...events} key={shape.id()}/>
        } else if(shape instanceof Konva.Text) {
            return <Text {...shape} {...events} key={shape.id()}/>
        } else if(shape instanceof Konva.Rect) {
            return <Rect {...shape} {...events} key={shape.id()}/>
        } else {
            return <Shape {...shape} {...events} key={shape.id()}/>
        }
    }

    static withShape(shape) {
        const shapeHolder = new ShapeHolder();
        shapeHolder.shape = shape;
        return shapeHolder;
    }

    static withShapeAndEvents(shape) {
        const shapeHolder = new ShapeHolder();
        shapeHolder.shape = shape;
        shapeHolder.events = {
            onMouseOver: () => shapeHolder.onMouseIn(shape),
            onMouseOut: () => shapeHolder.onMouseOut(shape)
        }
        return shapeHolder;
    }
}
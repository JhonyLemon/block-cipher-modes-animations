import Konva from "konva";
import {Rect, Text} from "react-konva";
import {ShapeHolder} from "./animation/ShapeHolder";

const VIRTUAL_CANVAS_HEIGHT = 10;
const VIRTUAL_CANVAS_WIDTH = 10;

export const HexTextWithBorder = (props): ShapeHolder[] => {
    const text = props.text;
    let x = props.x;
    let y = props.y;
    const texts = splitText(text, 2).map(t => new Konva.Text({ ...props,text: t, id: t}));
    const width = texts.reduce((acc, t) => t.getWidth()+acc, 0);
    const height = texts.reduce((acc, t) => Math.max(t.getHeight(), acc), 0);
    x = x - width/2;
    if(x < 0) x = 0;
    if(x + width > VIRTUAL_CANVAS_WIDTH) x = VIRTUAL_CANVAS_WIDTH - width;
    y = y - height/2;
    if(y < 0) y = 0;
    if (y + height > VIRTUAL_CANVAS_HEIGHT) y = VIRTUAL_CANVAS_HEIGHT - height;
    let cumulatedX = x;
    for (let i = 0; i < texts.length; i++) {
        texts[i].x(cumulatedX);
        texts[i].y(y);
        texts[i].id(texts[i].x()+'-'+texts[i].y()+'-'+texts[i].id())
        cumulatedX += texts[i].getWidth();
    }
    return texts.map(t => ShapeHolder.withShapeAndEvents(t));
}

export const TextWithBorder = (textProps, borderProps, padding): ShapeHolder[] => {

    const str = textProps.text;
    const text = new Konva.Text({ ...textProps, text: str, id: str});
    const width = text.getWidth();
    const height = text.getHeight();
    let x = textProps.x - width/2;
    if(x < 0) x = 0;
    if(x + width > VIRTUAL_CANVAS_WIDTH) x = VIRTUAL_CANVAS_WIDTH - width;
    let y = textProps.y - height/2;
    if(y < 0) y = 0;
    if (y + height > VIRTUAL_CANVAS_HEIGHT) y = VIRTUAL_CANVAS_HEIGHT - height;
    text.x(x);
    text.y(y);
    text.id(text.x()+'-'+text.y()+'-'+text.id())
    const border = new Konva.Rect({
        ...borderProps,
        id: text.id()+'-border',
        x: x-padding,
        y: y-padding,
        width: width+2*padding,
        height: height+2*padding,
    });
    return [ShapeHolder.withShape(border), ShapeHolder.withShape(text)];
}

export const HexTextTooltip = (text: Konva.Text) => {
    const hex = text.text();
    const binary = parseInt(hex, 16).toString(2).padStart(8, '0');
    const str = String.fromCharCode(parseInt(hex, 16));
    const binaryText = new Konva.Text({
        id: 'hex-binary',
        text: binary,
        x: text.x(),
        y: text.y() + text.getHeight(),
        stroke: 'black',
        strokeWidth: 0.5
    });
    binaryText.x(text.x() + text.getWidth()/2 - binaryText.getWidth()/2);

    const strText = new Konva.Text({
        id: 'hex-str',
        text: str,
        x: text.x(),
        y: text.y() + text.getHeight() + binaryText.getHeight(),
        stroke: 'black',
        strokeWidth: 0.5
    });
    strText.x(text.x() + text.getWidth()/2 - strText.getWidth()/2);

    if (binaryText.x() < 0) binaryText.x(0);
    if (binaryText.x() + binaryText.getWidth() > VIRTUAL_CANVAS_WIDTH) binaryText.x(VIRTUAL_CANVAS_WIDTH - binaryText.getWidth());

    if (strText.x() < 0) strText.x(0);
    if (strText.x() + strText.getWidth() > VIRTUAL_CANVAS_WIDTH) strText.x(VIRTUAL_CANVAS_WIDTH - strText.getWidth());

    let x = Math.min(binaryText.x(), strText.x());
    let y = Math.min(binaryText.y(), strText.y());
    let width = Math.max(binaryText.getWidth(), strText.getWidth());
    let height = binaryText.getHeight() + strText.getHeight();

    if (y + height > VIRTUAL_CANVAS_HEIGHT) {
        binaryText.y(text.y() - height);
        strText.y(text.y() - height + binaryText.getHeight());
    }

    x = Math.min(binaryText.x(), strText.x());
    y = Math.min(binaryText.y(), strText.y());
    width = Math.max(binaryText.getWidth(), strText.getWidth());
    height = binaryText.getHeight() + strText.getHeight();

    const border = new Konva.Rect({
        id: 'hex-tooltip-border',
        x: x,
        y: y,
        width: width,
        height: height,
        stroke: 'black',
        strokeWidth: 0.5,
        fill: 'white'
    });
    return [<Rect {...border} key={border.id()}/>, ...[binaryText, strText].map(t => <Text {...t} key={t.id()}/>)];
}

export const ArrowToShapes = (shapes0: ShapeHolder[], shapes1: ShapeHolder[], arrowProp: {}, startDir: Direction, endDir: Direction, animSpeedMs: number): ShapeHolder[] => {
    const shape0XY = {
        x: shapes0.map(s => s.shape.x()).reduce((acc, x) => Math.min(acc, x), Infinity),
        y: shapes0.map(s => s.shape.y()).reduce((acc, y) => Math.min(acc, y), Infinity)
    };

    const width0 = shapes0.map(s => s.shape.getClientRect()).sort((s1,s2) => s1.x-s2.x).reduce(
        (acc, rect) => {
            const lastShapeMaxX = acc.x + acc.width;
            if (rect.x >= lastShapeMaxX) { // If current shape does not collide, sum the width
                acc.width += rect.width;
            } else { // If current rectangle collides, adjust width to encompass it
                const overlap = lastShapeMaxX - rect.x;
                const additionalWidthNeeded = rect.width - overlap;
                acc.width += additionalWidthNeeded;
            }
            return acc; // return an object with x, width, and height
        },
        {...shape0XY, width: 0, height: 0}
    ).width;

    const shape0WH = {
        width: width0,
        height: shapes0.map(s => s.shape.height()).reduce((acc, h) => Math.max(acc, h), 0)
    };
    const shape1XY = {
        x: shapes1.map(s => s.shape.x()).reduce((acc, x) => Math.min(acc, x), Infinity),
        y: shapes1.map(s => s.shape.y()).reduce((acc, y) => Math.min(acc, y), Infinity)
    };

    const width1 = shapes1.map(s => s.shape.getClientRect()).sort((s1,s2) => s1.x-s2.x).reduce(
        (acc, rect) => {
            const lastShapeMaxX = acc.x + acc.width;
            if (rect.x >= lastShapeMaxX) { // If current shape does not collide, sum the width
                acc.width += rect.width;
            } else { // If current rectangle collides, adjust width to encompass it
                const overlap = lastShapeMaxX - rect.x;
                const additionalWidthNeeded = rect.width - overlap;
                acc.width += additionalWidthNeeded;
            }
            return acc; // return an object with x, width, and height
        },
        {...shape1XY, width: 0, height: 0}
    ).width;

    const shape1WH = {
        width: width1,
        height: shapes1.map(s => s.shape.height()).reduce((acc, h) => Math.max(acc, h), 0)
    };

    const point0 = {
        x: startDir === Direction.LEFT ? shape0XY.x : startDir === Direction.RIGHT ? shape0XY.x + shape0WH.width : shape0XY.x + shape0WH.width/2,
        y: startDir === Direction.UP ? shape0XY.y : startDir === Direction.DOWN ? shape0XY.y + shape0WH.height : shape0XY.y + shape0WH.height/2
    };
    const point1 = {
        x: endDir === Direction.LEFT ? shape1XY.x : endDir === Direction.RIGHT ? shape1XY.x + shape1WH.width : shape1XY.x + shape1WH.width/2,
        y: endDir === Direction.UP ? shape1XY.y : endDir === Direction.DOWN ? shape1XY.y + shape1WH.height : shape1XY.y + shape1WH.height/2
    };

    // console.log(shapes1, shape1XY, shape1WH, point1)

    const extraLinePoints = []
    if(startDir[2] === endDir[2]) {
        extraLinePoints.push(
            startDir === Direction.LEFT || startDir === Direction.RIGHT ? point0.x + (point1.x-point0.x)/2 : point0.x,
            startDir === Direction.UP || startDir === Direction.DOWN ? point0.y + (point1.y-point0.y)/2 : point0.y,
            startDir === Direction.LEFT || startDir === Direction.RIGHT ? point0.x + (point1.x-point0.x)/2 : point1.x,
            startDir === Direction.UP || startDir === Direction.DOWN ? point0.y + (point1.y-point0.y)/2 : point1.y,
        );
    } else {
        extraLinePoints.push(
            startDir === Direction.LEFT || startDir === Direction.RIGHT ? point1.x: point0.x,
            startDir === Direction.UP || startDir === Direction.DOWN ? point1.y : point0.y
        );
    }

    let line = new Konva.Line({
        id: point0.x+'-'+point0.y+'-'+point1.x+'-'+point1.y+'-line',
        points: [
            point0.x,
            point0.y,
            ...extraLinePoints,
            point1.x,
            point1.y
        ],
        ...arrowProp
    });

    // Arrow Head
    const arrowHead = new Konva.Arrow({
        id: point1.x+'-'+point1.y+'-arrow-head',
        points: [point1.x + endDir[0], point1.y + endDir[1], point1.x, point1.y],
        ...arrowProp
    });

    const arrowShapeHolder = ShapeHolder.withShape(arrowHead);
    const lineShapeHolder = ShapeHolder.withShape(line);

    return [arrowShapeHolder, lineShapeHolder];

}

export const arrowDot = (arrowShape: ShapeHolder[]): ShapeHolder[] => {

    let line = null;
    let arrowHead = null;
    for (let i = 0; i < arrowShape.length; i++) {
        if (arrowShape[i].shape instanceof Konva.Arrow) {
            arrowHead = arrowShape[i].shape;
        } else if (arrowShape[i].shape instanceof Konva.Line) {
            line = arrowShape[i].shape;
        }
    }
    const dotIndicator = [];
    for (let i = 0; i < line.points().length; i+=2) {
        const currentPoint = {x: line.points()[i], y: line.points()[i+1]};
        const nextPoint = {x: line.points()[i+2], y: line.points()[i+3]};
        if(nextPoint.x !== undefined && nextPoint.y !== undefined) {
            while (Math.abs(nextPoint.x - currentPoint.x) >= 1 || Math.abs(nextPoint.y - currentPoint.y) >= 1) {
                dotIndicator.push(new Konva.Circle({
                    id: currentPoint.x+'-'+currentPoint.y+'-dot-indicator',
                    x: currentPoint.x,
                    y: currentPoint.y,
                    radius: 3,
                    fill: 'red'
                }));
                if (Math.abs(nextPoint.x - currentPoint.x) >= 1) currentPoint.x += Math.sign(nextPoint.x - currentPoint.x);
                if (Math.abs(nextPoint.y - currentPoint.y) >= 1) currentPoint.y += Math.sign(nextPoint.y - currentPoint.y);
            }
        }
    }

    return dotIndicator.map((dot) => {
        return  ShapeHolder.withShape(dot);
    });
}

const splitText = (text, n) => {
    const splitText = [];
    let i = 0;
    while (i < text.length) {
        splitText.push(text.slice(i, i + n));
        i += n;
    }
    return splitText;
}

export const Direction = {
    UP: [0, -1, 'VERTICAL'],
    RIGHT: [1, 0, 'HORIZONTAL'],
    DOWN: [0, 1, 'VERTICAL'],
    LEFT: [-1, 0, 'HORIZONTAL'],
}
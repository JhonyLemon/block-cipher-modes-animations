import {
    getAnimationIndices,
    hex2bin,
    hex2str,
    lengthFromPoints,
    pointOnLine,
    replaceWhiteSpaceChars
} from "../util/Helpers";
import {VIRTUAL_RESOLUTIONS} from "../data/Constants";
import {SIDE} from "./AnimationPlayer";
import {useEffect, useRef} from "react";
import p5 from "p5";

const Sketch = (p) => {
    let elements = {};
    let icon = null;
    let boxes = [];
    let icons = [];
    let texts = [];
    let connections = [];
    let dots = [];
    let animationParameters = {}
    let hoverInfo = {};
    let hoverText = {};
    let canvas = {width: 0, height: 0, scale: {x: 1, y: 1}};
    let isSetup = false;

    const isInside = (box, p) => {
        const mouse = {x: p.mouseX * (1 / canvas.scale.x), y: p.mouseY * (1 / canvas.scale.y)};
        return mouse.x >= box.x && mouse.x <= box.x + box.width && mouse.y >= box.y && mouse.y <= box.y + box.height
    }

    const boxesDraw = (boxes) => {
        p.push();
        boxes[animationParameters.animationCycle].forEach((box, i) => {
            p.fill(255);
            p.rect(box.x, box.y, box.width, box.height);
        });
        p.pop();
    }

    const textsDraw = (texts) => {
        p.push();
        texts[animationParameters.animationCycle].forEach((text, i) => {
            const singleText = text[animationParameters.animationCycle];
            p.fill(0);
            p.textStyle(p.NORMAL);
            p.textSize(elements.boxes[animationParameters.animationCycle][i].content.options.textSize);
            p.text(singleText.data, singleText.x, singleText.y);

            if (singleText.showTitle) {
                p.push();
                const title = elements.boxes[animationParameters.animationCycle][i].title;
                p.textSize(elements.boxes[animationParameters.animationCycle][i].content.options.textSize/2);
                const boxSize = singleText.boxSize
                p.text(title, singleText.x, boxSize.y + p.textAscent());
                p.pop();
            }

            if (singleText.showText) {
                singleText.letters2.forEach((letter2, j) => {
                    const decoded = hex2str(letter2.data);
                    p.fill(0);
                    p.textStyle(p.NORMAL);

                    p.textSize(elements.boxes[animationParameters.animationCycle][i].content.options.textSize/2);
                    p.text(decoded, letter2.boundingBox.x + (letter2.width/2), letter2.boundingBox.y + letter2.height + 5);

                    p.push();
                    p.strokeWeight(0.5);
                    p.stroke('black');
                    p.line(letter2.boundingBox.x + 2, letter2.boundingBox.y + letter2.height-2, letter2.boundingBox.x + letter2.width - 2, letter2.boundingBox.y + letter2.height - 2);
                    p.pop();
                });
            }
        });
        p.pop();
    }

    const iconsDraw = (icons) => {
        icons[animationParameters.animationCycle].forEach((iconParams, i) => {
            if (elements.boxes[animationParameters.animationCycle][i].content.options.onHoverInfo) {
                p.image(icon, iconParams.x, iconParams.y, iconParams.width, iconParams.height);
            }
        });
    }

    const connectionsDraw = (connections) => {
        p.push();
        connections[animationParameters.animationCycle].forEach((conn, i) => {
            const connection = elements.connections[animationParameters.animationCycle][i];
            p.stroke(connection.connectionColor);

            conn.points.forEach((point, j) => {
                if (j !== 0) {
                    p.line(conn.points[j - 1].x, conn.points[j - 1].y, point.x, point.y);
                }
            });

            p.push();
            p.noStroke();
            p.translate(conn.end.x + connection.to.arrowIn.arrowX, conn.end.y + connection.to.arrowIn.arrowY);
            p.rotate(connection.to.arrowIn.arrowAngle);
            p.fill(elements.connections[animationParameters.animationCycle][i].connectionColor);
            p.triangle(0, connection.arrowSize / 2, 0, -connection.arrowSize / 2, connection.arrowSize, 0)
            p.pop()
        });
        p.pop();
    }

    const dotsDraw = (dots) => {
        p.push();
        dots[animationParameters.animationCycle][animationParameters.animationIndex].forEach((dotConnection, i) => {
            const dot = dotConnection[animationParameters.dotFrame];
            if (dot !== undefined) {
                p.stroke(dot.dotColor);
                p.strokeWeight(dot.dotSize);
                p.point(dot.x, dot.y);
            }
        });
        p.pop();
    }

    const tooltipInfoDraw = (hoverInfo) => {
        if (hoverInfo.icon !== undefined && Object.keys(hoverInfo.icon).length > 0) {
            p.push();
            p.fill(255);
            const box = boxes[animationParameters.animationCycle][hoverInfo.icon.box];
            const words = elements.boxes[animationParameters.animationCycle][hoverInfo.icon.box].description.split(' ');
            const lines = [];
            let currentLine = '';

            words.forEach((word) => {
                const newLine = currentLine + ' ' + word;

                if (p.textWidth(newLine) > 180) {
                    lines.push(currentLine);
                    currentLine = word;
                } else {
                    currentLine = newLine;
                }
            });
            lines.push(currentLine);

            const rectWidth = 200;
            let displacementX = 0;
            let displacementY = 0;
            const lineHeight = 15;
            const rectHeight = (lines.length * lineHeight) + 40;

            if (elements.boxes[animationParameters.animationCycle][hoverInfo.icon.box].content.options.hoverInfoPos) {
                const displacement = elements.boxes[animationParameters.animationCycle][hoverInfo.icon.box].content.options.hoverInfoPos(hoverInfo.icon.x, box.y, 10, 10, rectWidth, rectHeight);
                displacementX = displacement.x;
                displacementY = displacement.y;
            }

            p.rect(hoverInfo.icon.x + displacementX, box.y + displacementY, rectWidth, rectHeight);

            p.fill(0);
            p.textStyle(p.BOLD);
            p.text(elements.boxes[animationParameters.animationCycle][hoverInfo.icon.box].title, hoverInfo.icon.x + displacementX + rectWidth / 2, box.y + lineHeight + displacementY);
            p.textStyle(p.NORMAL);
            lines.forEach((line, i) => {
                p.text(line, hoverInfo.icon.x + 100 + displacementX, box.y + (2 * lineHeight) + (i * lineHeight) + displacementY);
            });

            p.pop();
        }
    }

    const tooltipTextDraw = (hoverText) => {
        if (hoverText.index !== undefined && isInside(texts[animationParameters.animationCycle][hoverText.index][animationParameters.animationCycle].boundingBox, p)) {
            p.push();
            p.fill(255);
            const text = texts[animationParameters.animationCycle][hoverText.index][animationParameters.animationCycle];
            const [letter2Set] = text.letters2.filter((letter) => {
                return isInside(letter.boundingBox, p)
            });

            const byteHex = letter2Set.data;
            const binary = hex2bin(byteHex);
            const decoded = hex2str(byteHex);

            const decodedText = `String: ${replaceWhiteSpaceChars(decoded)}`;
            const binaryText = `Binary: ${binary}`;
            const hexText = `Hex: ${byteHex}`;

            const padding = 20;
            const maxWidth = [decodedText, binaryText, hexText].map((text) => p.textWidth(text)).max() + padding;
            const height = (p.textAscent() + p.textDescent());

            let displacementX = 0;
            let displacementY = 0;

            if (elements.boxes[animationParameters.animationCycle][text.box].content.options.hoverTextPos) {
                const displacement = elements.boxes[animationParameters.animationCycle][text.box].content.options.hoverTextPos(
                    letter2Set.boundingBox.x, letter2Set.boundingBox.y,
                    letter2Set.width, letter2Set.height,
                    maxWidth, 3 * ((height)) + padding,
                );
                displacementX = displacement.x;
                displacementY = displacement.y;
            }

            p.rect(letter2Set.boundingBox.x + displacementX, letter2Set.boundingBox.y + displacementY, maxWidth, 3 * ((height)) + padding);

            p.noFill();
            p.rect(letter2Set.boundingBox.x, letter2Set.boundingBox.y, letter2Set.width, letter2Set.height);
            p.fill(0)
            p.text(decodedText, letter2Set.boundingBox.x + displacementX + maxWidth / 2, letter2Set.boundingBox.y + displacementY + height);
            p.text(binaryText, letter2Set.boundingBox.x + displacementX + maxWidth / 2, letter2Set.boundingBox.y + displacementY + 2 * height);
            p.text(hexText, letter2Set.boundingBox.x + displacementX + maxWidth / 2, letter2Set.boundingBox.y + displacementY + 3 * height);
            p.pop();
        }
    }

    const boxesTextIconInit = () => {
        boxes = [];
        texts = [];
        icons = [];
        elements.boxes.forEach((boxesList) => {
            const boxList = [];
            const textList = [];
            const iconList = [];

            boxesList.forEach((box, i) => {

                const x = (box.pos.x * p.width) * (1 / canvas.scale.x);
                const y = (box.pos.y * p.height) * (1 / canvas.scale.y);
                const boxWidth = box.content.data.map((data) => {
                    return p.textWidth(data);
                }).max() + 30;

                const textHeight = p.textAscent() + p.textDescent();

                const boxHeight = textHeight + (35 * (1 / canvas.scale.y));

                boxList.push({
                    x: x - (boxWidth / 2),
                    y: y - (boxHeight / 2),
                    width: boxWidth,
                    height: boxHeight
                });

                textList.push(box.content.data.map((data, j) => {
                    return {
                        data: data,
                        x: x,
                        y: y,
                        width: p.textWidth(data),
                        height: textHeight,
                        box: i,
                        boxSize: {
                            x: x- (boxWidth / 2),
                            y: y - (boxHeight / 2),
                            width: boxWidth,
                            height: boxHeight
                        },
                        showText: box.content.options?.showText,
                        showTitle: box.content.options?.showTitle,
                        boundingBox: {
                            x: x - (p.textWidth(data) / 2),
                            y: y - ((textHeight) / 2),
                            width: p.textWidth(data),
                            height: textHeight
                        },
                        letters: [...data].map((letter, k) => {
                            return {
                                letter: letter,
                                x: x,
                                y: y,
                                width: p.textWidth(letter),
                                height: textHeight
                            }
                        })
                    }
                }));

                textList[i].forEach((text, j) => {
                    const splitData = text.data.match(/.{1,2}/g);
                    text.letters2 = splitData.map((data, k) => {
                        return {
                            data: data,
                            x: x,
                            y: y,
                            width: p.textWidth(data),
                            height: textHeight
                        }
                    });
                });

                textList[i].forEach((text, j) => {
                    text.letters.forEach((letter, k) => {
                        letter.x += text.letters.slice(0, k).reduce((acc, curr) => acc + curr.width, 0);
                        letter.boundingBox = {
                            x: letter.x - text.width / 2,
                            y: letter.y - (text.height / 2),
                            width: letter.width,
                            height: letter.height
                        }
                    });
                    text.letters2.forEach((letter, k) => {
                        letter.x += text.letters2.slice(0, k).reduce((acc, curr) => acc + curr.width, 0);
                        letter.boundingBox = {
                            x: letter.x - text.width / 2,
                            y: letter.y - (text.height / 2),
                            width: letter.width,
                            height: letter.height
                        }
                    });
                });

                const padding = 2;
                const iconSize = 10;
                const iconX = (boxList[i].x + boxList[i].width - iconSize) - padding;
                const iconY = (boxList[i].y) + padding;
                iconList.push({x: iconX, y: iconY, width: iconSize, height: iconSize, box: i});
            });
            boxes.push(boxList);
            texts.push(textList);
            icons.push(iconList);
        });
    }

    const connectionsInit = () => {
        connections = [];
        elements.connections.forEach((connectionsList, i) => {
            const connectionList = [];
            connectionsList.forEach((conn, j) => {
                const fromBox = boxes[i][conn.from.boxId];
                const toBox = boxes[i][conn.to.boxId];
                const startSide = conn.from.arrowOut;
                const endSide = conn.to.arrowIn;
                const start = {
                    x: fromBox.x + (fromBox.width * startSide.x),
                    y: fromBox.y + (fromBox.height * startSide.y)
                };
                const end = {
                    x: toBox.x + (toBox.width * endSide.x),
                    y: toBox.y + (toBox.height * endSide.y)
                };

                const connection = {start: start, end: end, points: []};

                connection.points.push(start);

                if ((startSide === SIDE.UP || startSide === SIDE.DOWN) && (endSide === SIDE.LEFT || endSide === SIDE.RIGHT)) {
                    connection.points.push({x: start.x, y: end.y})
                } else if ((startSide === SIDE.LEFT || startSide === SIDE.RIGHT) && (endSide === SIDE.UP || endSide === SIDE.DOWN)) {
                    connection.points.push({x: end.x, y: start.y})
                }

                connection.points.push(end);

                connectionList.push(connection);
            });
            connections.push(connectionList);
        });
    }

    const connectionsAnimationsInit = () => {
        dots = [];
        elements.connectionAnimation.data.forEach((dataList, i) => {
            const dotList = [];
            dataList.forEach((data, j) => {
                const dotConnection = []
                data.animations.forEach((connectionIndex, k) => {
                    const frames = []
                    for (let k = 0; k <= 1; k = k + elements.connectionAnimation.options.speed) {
                        const line = lengthFromPoints(connections[i][connectionIndex].points)
                        const point = pointOnLine(connections[i][connectionIndex].points, line, line * k)
                        const dot = {
                            x: point.x,
                            y: point.y,
                            dotSize: elements.connections[i][connectionIndex].dotSize,
                            dotColor: elements.connections[i][connectionIndex].dotColor
                        }
                        frames.push(dot);
                    }
                    dotConnection.push(frames);
                });
                dotList.push(dotConnection);
            });
            dots.push(dotList);
        });
    }

    p.preload = () => {
        icon = p.loadImage(new URL('../information.png', import.meta.url).href);
    };

    p.setup = () => {
        p.createCanvas(canvas.width, canvas.height);
        p.background(240);
        p.textAlign(p.CENTER, p.CENTER);
        // p.noLoop()

        boxesTextIconInit();
        connectionsInit()
        connectionsAnimationsInit()
        isSetup = true;
    }

    p.updateWithProps = (props) => {
        elements = props.elements;

        const animationIndeces = getAnimationIndices(elements, props.frame);
        animationParameters = {animationCycle: animationIndeces.cycleIndex, animationIndex: animationIndeces.connectionIndex, dotFrame: animationIndeces.dotIndex};
        const size = Math.min(props.viewport.width / 16, props.viewport.height / 9);
        canvas = {width: 16 * size * 0.85, height: 9 * size * 0.85};
        const canvasResolution = VIRTUAL_RESOLUTIONS["480p"]
        canvas.scale = {x: canvas.width / canvasResolution.width, y: canvas.height / canvasResolution.height};

        if (isSetup) {
            boxesTextIconInit()
            connectionsInit()
            connectionsAnimationsInit()
        }
    }

    p.mouseMoved = () => {
        let hovered = {}
        icons[animationParameters.animationCycle]?.forEach((icon, i) => {
            if (isInside(icon, p) && elements.boxes[animationParameters.animationCycle][i].content.options.onHoverInfo) {
                hovered = icon
            }
        });
        hoverInfo = {mouseX: p.mouseX, mouseY: p.mouseY, icon: hovered};
        hovered = {}
        texts[animationParameters.animationCycle]?.forEach((allTexts, i) => {
            const text = allTexts[animationParameters.animationCycle];
            if (isInside(text.boundingBox, p) && elements.boxes[animationParameters.animationCycle][i].content.options.onHoverText) {
                hovered = {index: i};
            }
        });
        hoverText = {mouseX: p.mouseX, mouseY: p.mouseY, ...hovered};
    }

    p.draw = () => {
        p.resizeCanvas(canvas.width, canvas.height, 1);
        p.scale(canvas.scale.x, canvas.scale.y);
        p.background(240);

        boxesDraw(boxes);
        textsDraw(texts);
        iconsDraw(icons);
        connectionsDraw(connections)
        dotsDraw(dots)
        tooltipInfoDraw(hoverInfo)
        tooltipTextDraw(hoverText)
    }
}

export const Canvas = ({elements, frame, viewport}) => {
    const canvasRef = useRef();
    const p5Ref = useRef();

    useEffect(() => {
        p5Ref.current = new p5(Sketch, canvasRef.current);
        return () => {
            p5Ref.current.remove();
        }
    }, []);

    useEffect(() => {
        if (p5Ref) {
            p5Ref.current.updateWithProps({elements, frame, viewport});
        }
    }, [elements, frame, viewport]);

    return <div ref={canvasRef}/>
}

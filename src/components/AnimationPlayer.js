import {hex2bin, hex2str, replaceWhiteSpaceChars} from "../util/Helpers";
import {VIRTUAL_RESOLUTIONS} from "../data/Constants";
import React, {useEffect, useState} from "react";
import useWindowSize from "../hooks/WindowSize";
import useInterval from "../hooks/Interval";
import {ReactP5Wrapper} from "@p5-wrapper/react";

export const SIDE = {
    UP: {x: 0.5, y: 0, arrowX: 0, arrowY: -10, arrowAngle: Math.PI / 2},
    RIGHT: {x: 1, y: 0.5, arrowX: 10, arrowY: 0, arrowAngle: Math.PI},
    DOWN: {x: 0.5, y: 1, arrowX: 0, arrowY: 10, arrowAngle: -Math.PI / 2},
    LEFT: {x: 0, y: 0.5, arrowX: -10, arrowY: 0, arrowAngle: 0}
}

export const TOOLTIP_POSITION = {
    TOP: {
        LEFT: (parentX, parentY, parentWidth, parentHeight, tooltipWidth, tooltipHeight) => {
            return {x: 0, y: -(tooltipHeight + (parentHeight))}
        },
        MIDDLE: (parentX, parentY, parentWidth, parentHeight, tooltipWidth, tooltipHeight) => {
            return {x: -(tooltipWidth / 2) + parentWidth / 2, y: -(tooltipHeight + parentHeight)}
        },
        RIGHT: (parentX, parentY, parentWidth, parentHeight, tooltipWidth, tooltipHeight) => {
            return {x: -(tooltipWidth) + parentWidth, y: -(tooltipHeight + parentHeight)}
        }
    },
    BOTTOM: {
        LEFT: (parentX, parentY, parentWidth, parentHeight, tooltipWidth, tooltipHeight) => {
            return {x: 0, y: 2 * parentHeight}
        },
        MIDDLE: (parentX, parentY, parentWidth, parentHeight, tooltipWidth, tooltipHeight) => {
            return {x: -(tooltipWidth / 2) + parentWidth / 2, y: 2 * parentHeight}
        },
        RIGHT: (parentX, parentY, parentWidth, parentHeight, tooltipWidth, tooltipHeight) => {
            return {x: -(tooltipWidth) + parentWidth, y: 2 * parentHeight}
        }
    },
    LEFT: {
        TOP: (parentX, parentY, parentWidth, parentHeight, tooltipWidth, tooltipHeight) => {
            return {x: -(tooltipWidth + parentWidth), y: 0}
        },
        MIDDLE: (parentX, parentY, parentWidth, parentHeight, tooltipWidth, tooltipHeight) => {
            return {x: -(tooltipWidth + parentWidth), y: -(tooltipHeight / 2) + parentHeight / 2}
        },
        BOTTOM: (parentX, parentY, parentWidth, parentHeight, tooltipWidth, tooltipHeight) => {
            return {x: -(tooltipWidth + parentWidth), y: -(tooltipHeight) + parentHeight}
        }
    },
    RIGHT: {
        TOP: (parentX, parentY, parentWidth, parentHeight, tooltipWidth, tooltipHeight) => {
            return {x: 2 * parentWidth, y: 0}
        },
        MIDDLE: (parentX, parentY, parentWidth, parentHeight, tooltipWidth, tooltipHeight) => {
            return {x: 2 * parentWidth, y: -(tooltipHeight / 2) + parentHeight / 2}
        },
        BOTTOM: (parentX, parentY, parentWidth, parentHeight, tooltipWidth, tooltipHeight) => {
            return {x: 2 * parentWidth, y: -(tooltipHeight) + parentHeight}
        }
    }
}

const canvasInit = (p) => {
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

    const isInside = (box, p) => {
        const mouse = {x: p.mouseX * (1 / canvas.scale.x), y: p.mouseY * (1 / canvas.scale.y)};
        return mouse.x >= box.x && mouse.x <= box.x + box.width && mouse.y >= box.y && mouse.y <= box.y + box.height
    }

    const boxesDraw = (boxes) => {
        p.push();
        boxes.forEach((box, i) => {
            p.fill(255);
            p.rect(box.x, box.y, box.width, box.height);
        });
        p.pop();
    }

    const textsDraw = (texts) => {
        p.push();
        texts.forEach((text, i) => {
            const singleText = text[animationParameters.animationCycle];
            p.fill(0);
            p.textStyle(p.NORMAL);
            p.textSize(elements.boxes[i].content.options.textSize);
            p.text(singleText.data, singleText.x, singleText.y);
        });
        p.pop();
    }

    const iconsDraw = (icons) => {
        icons.forEach((iconParams, i) => {
            if (elements.boxes[i].content.options.onHoverInfo) {
                p.image(icon, iconParams.x, iconParams.y, iconParams.width, iconParams.height);
            }
        });
    }

    const connectionsDraw = (connections) => {
        p.push();
        connections.forEach((conn, i) => {
            const connection = elements.connections[i];
            p.stroke(connection.connectionColor);
            p.line(conn.start.x, conn.start.y, conn.end.x, conn.end.y);

            p.push();
            p.noStroke();
            p.translate(conn.end.x + connection.to.arrowIn.arrowX, conn.end.y + connection.to.arrowIn.arrowY);
            p.rotate(connection.to.arrowIn.arrowAngle);
            p.fill(elements.connections[i].connectionColor);
            p.triangle(0, connection.arrowSize / 2, 0, -connection.arrowSize / 2, connection.arrowSize, 0)
            p.pop()
        });
        p.pop();
    }

    const dotsDraw = (dots) => {
        p.push();
        dots[animationParameters.animationIndex].forEach((dotConnection, i) => {
            const dot = dotConnection[animationParameters.dotFrame];
            p.stroke(dot.dotColor);
            p.strokeWeight(dot.dotSize);
            p.point(dot.x, dot.y);
        });
        p.pop();
    }

    const tooltipInfoDraw = (hoverInfo) => {
        if (hoverInfo.icon !== undefined && Object.keys(hoverInfo.icon).length > 0) {
            p.push();
            p.fill(255);
            const box = boxes[hoverInfo.icon.box];
            const words = elements.boxes[hoverInfo.icon.box].description.split(' ');
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

            if (elements.boxes[hoverInfo.icon.box].content.options.hoverInfoPos) {
                const displacement = elements.boxes[hoverInfo.icon.box].content.options.hoverInfoPos(hoverInfo.icon.x, box.y, 10, 10, rectWidth, rectHeight);
                displacementX = displacement.x;
                displacementY = displacement.y;
            }

            p.rect(hoverInfo.icon.x + displacementX, box.y + displacementY, rectWidth, rectHeight);

            p.fill(0);
            p.textStyle(p.BOLD);
            p.text(elements.boxes[hoverInfo.icon.box].title, hoverInfo.icon.x + displacementX + rectWidth / 2, box.y + lineHeight + displacementY);
            p.textStyle(p.NORMAL);
            lines.forEach((line, i) => {
                p.text(line, hoverInfo.icon.x + 100 + displacementX, box.y + (2 * lineHeight) + (i * lineHeight) + displacementY);
            });

            p.pop();
        }
    }

    const tooltipTextDraw = (hoverText) => {
        if (hoverText.index !== undefined && isInside(texts[hoverText.index][animationParameters.animationCycle].boundingBox, p)) {
            p.push();
            p.fill(255);
            const text = texts[hoverText.index][animationParameters.animationCycle];
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

            if (elements.boxes[text.box].content.options.hoverTextPos) {
                const displacement = elements.boxes[text.box].content.options.hoverTextPos(
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
        elements.boxes.forEach((box, i) => {
            const x = (box.pos.x * p.width) * (1 / canvas.scale.x);
            const y = (box.pos.y * p.height) * (1 / canvas.scale.y);
            const boxWidth = box.content.data.map((data) => {
                return p.textWidth(data);
            }).max() + 30;

            const textHeight = p.textAscent() + p.textDescent();

            const boxHeight = textHeight + (35 * (1 / canvas.scale.y));

            boxes.push({
                x: x - (boxWidth / 2),
                y: y - (boxHeight / 2),
                width: boxWidth,
                height: boxHeight
            });

            texts.push(box.content.data.map((data, j) => {
                return {
                    data: data,
                    x: x,
                    y: y,
                    width: p.textWidth(data),
                    height: textHeight,
                    box: i,
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

            texts[i].forEach((text, j) => {
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

            texts[i].forEach((text, j) => {
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
            const iconX = (boxes[i].x + boxes[i].width - iconSize) - padding;
            const iconY = (boxes[i].y) + padding;
            icons.push({x: iconX, y: iconY, width: iconSize, height: iconSize, box: i});
        });
    }

    const connectionsInit = () => {
        connections = [];
        elements.connections.forEach((conn, i) => {
            const fromBox = boxes[conn.from.boxId];
            const toBox = boxes[conn.to.boxId];
            const startSide = conn.from.arrowOut;
            const endSide = conn.to.arrowIn;
            const start = {
                x: fromBox.x + (fromBox.width * startSide.x),
                y: fromBox.y + (fromBox.height * startSide.y)
            };
            const end = {x: toBox.x + (toBox.width * endSide.x), y: toBox.y + (toBox.height * endSide.y)};
            connections.push({start: start, end: end});
        });
    }

    const connectionsAnimationsInit = () => {
        dots = [];
        elements.connectionAnimation.data.forEach((data, i) => {
            const dotConnection = []
            data.animations.forEach((connectionIndex, j) => {
                const frames = []
                for (let k = 0; k <= 1; k = k + elements.connectionAnimation.options.speed) {
                    const dot = {
                        x: p.lerp(connections[connectionIndex].start.x, connections[connectionIndex].end.x, k),
                        y: p.lerp(connections[connectionIndex].start.y, connections[connectionIndex].end.y, k),
                        dotSize: elements.connections[connectionIndex].dotSize,
                        dotColor: elements.connections[connectionIndex].dotColor
                    }
                    frames.push(dot);
                }
                dotConnection.push(frames);
            });
            dots.push(dotConnection);
        });
    }

    p.preload = () => {
        icon = p.loadImage(new URL('../information.png', import.meta.url).href);
    };

    p.setup = () => {
        p.createCanvas(canvas.width, canvas.height);
        p.background(240);
        p.textAlign(p.CENTER, p.CENTER);

        boxesTextIconInit();
        connectionsInit()
        connectionsAnimationsInit()

    }

    p.updateWithProps = (props) => {
        elements = props.elements;

        const frame = props.frame;
        const dot = frame % ((1 / elements.connectionAnimation.options.speed) + 1);
        const connection = Math.floor(frame / ((1 / elements.connectionAnimation.options.speed) + 1)) % elements.connectionAnimation.data.length;
        const cycle = Math.floor(frame / ((1 / elements.connectionAnimation.options.speed) + 1) / elements.connectionAnimation.data.length) % elements.contents;
        animationParameters = {animationCycle: cycle, animationIndex: connection, dotFrame: dot};
        const size = Math.min(props.viewport.width / 16, props.viewport.height / 9);
        canvas = {width: 16 * size * 0.85, height: 9 * size * 0.85};
        const canvasResolution = VIRTUAL_RESOLUTIONS["480p"]
        canvas.scale = {x: canvas.width / canvasResolution.width, y: canvas.height / canvasResolution.height};
    }

    p.mouseMoved = () => {
        let hovered = {}
        icons.forEach((icon, i) => {
            if (isInside(icon, p) && elements.boxes[i].content.options.onHoverInfo) {
                hovered = icon
            }
        });
        hoverInfo = {mouseX: p.mouseX, mouseY: p.mouseY, icon: hovered};
        hovered = {}
        texts.forEach((allTexts, i) => {
            const text = allTexts[animationParameters.animationCycle];
            if (isInside(text.boundingBox, p) && elements.boxes[i].content.options.onHoverText) {
                hovered = {index: i};
            }
        });
        hoverText = {mouseX: p.mouseX, mouseY: p.mouseY, ...hovered};
    }

    p.draw = () => {
        p.resizeCanvas(canvas.width, canvas.height, 1);
        p.scale(canvas.scale.x, canvas.scale.y);
        p.background(240);

        boxesTextIconInit()
        connectionsInit()
        connectionsAnimationsInit()

        boxesDraw(boxes);
        textsDraw(texts);
        iconsDraw(icons);
        connectionsDraw(connections)
        dotsDraw(dots)
        tooltipInfoDraw(hoverInfo)
        tooltipTextDraw(hoverText)
    }
};

export const AnimationPlayer = ({elements}) => {
    const [frameCount, setFrameCount] = useState(0);
    const [frame, setFrame] = useState(0);
    const viewport = useWindowSize();
    const [isPlaying, setPlaying] = useState(false);

    useEffect(() => {
        let frames = 0;
        for (let i = 0; i < elements.contents; i++) {
            for (let j = 0; j < elements.connectionAnimation.data.length; j++) {
                for (let k = 0; k < (1 / elements.connectionAnimation.options.speed) + 1; k++) {
                    frames++;
                }
            }
        }
        frames--;
        setFrameCount(frames);
    }, [elements]);

    useInterval(() => {
        if (isPlaying) {
            if (frame < frameCount) {
                setFrame(prevFrame => prevFrame + 1);
            } else {
                setFrame(0);
            }
        }
    }, []);

    return <div style={
        {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
        }
    }>
        <ReactP5Wrapper
            sketch={canvasInit}
            elements={elements}
            frame={frame}
            viewport={viewport}
        />
        <div style={
            {
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%"
            }
        }>
            <input style={
                {
                    width: "85%"
                }
            }
                   type="range"
                   min="0" max={frameCount}
                   value={frame}
                   onChange={(e) => {
                       const newFrame = parseInt(e.target.value);
                       setFrame(newFrame)
                   }}
                   step="1"/>
            <div>
                <button
                    onClick={() => {
                        let cycle = Math.floor(frame / ((1 / elements.connectionAnimation.options.speed) + 1) / elements.connectionAnimation.data.length) % elements.contents;
                        const dotCon = (((1 / elements.connectionAnimation.options.speed) + 1) * elements.connectionAnimation.data.length);
                        if (cycle === 0) {
                            cycle = elements.contents - 1;
                        } else {
                            cycle--;
                        }
                        setFrame(dotCon * cycle)
                    }}
                >Previous
                </button>
                <button
                    onClick={() => {
                        setPlaying(!isPlaying);
                    }}
                >{isPlaying ? 'Stop' : 'Play'}</button>
                <button
                    onClick={() => {
                        let cycle = Math.floor(frame / ((1 / elements.connectionAnimation.options.speed) + 1) / elements.connectionAnimation.data.length) % elements.contents;
                        const dotCon = (((1 / elements.connectionAnimation.options.speed) + 1) * elements.connectionAnimation.data.length);
                        if (cycle === elements.contents - 1) {
                            cycle = 0;
                        } else {
                            cycle++;
                        }
                        setFrame(dotCon * cycle)
                    }}
                >Next
                </button>
            </div>
        </div>
    </div>;
}
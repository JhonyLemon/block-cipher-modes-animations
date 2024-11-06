import {
    getAnimationIndices, getFrame,
} from "../util/Helpers";
import React, {useEffect, useState} from "react";
import useWindowSize from "../hooks/WindowSize";
import useInterval from "../hooks/Interval";
import {Canvas} from "./Canvas"

export const SIDE = {
    UP: {
        x: 0.5,
        y: 0,
        arrowX: 0,
        arrowY: -10,
        arrowAngle: Math.PI / 2
    },
    RIGHT: {
        x: 1,
        y: 0.5,
        arrowX: 10,
        arrowY: 0,
        arrowAngle: Math.PI
    },
    DOWN: {
        x: 0.5,
        y: 1,
        arrowX: 0,
        arrowY: 10,
        arrowAngle: -Math.PI / 2
    },
    LEFT: {
        x: 0,
        y: 0.5,
        arrowX: -10,
        arrowY: 0,
        arrowAngle: 0
    }
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

export const AnimationPlayer = ({elements, elementsHash}) => {
    const [frameCount, setFrameCount] = useState(0);
    const [frame, setFrame] = useState(0);
    const viewport = useWindowSize();
    const [isPlaying, setPlaying] = useState(false);

    useEffect(() => {
        let frames = 0;
        for (let i = 0; i < elements.contents; i++) {
            for (let j = 0; j < elements.connectionAnimation.data[i].length; j++) {
                for (let k = 0; k < (1 / elements.connectionAnimation.options.speed) + 1; k++) {
                    frames++;
                }
            }
        }
        setFrameCount(frames);
    }, [elementsHash, elements.connectionAnimation.data, elements.connectionAnimation.options.speed, elements.contents]);

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
        <Canvas
            elements={elements}
            elementsHash={elementsHash}
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
            <div style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                gap: "5px"
            }}>
                <button
                    onClick={() => {
                        const animIndices = getAnimationIndices(elements, frame);
                        if (animIndices.cycleIndex === 0) {
                            setFrame(getFrame(elements, elements.contents - 1, 0, 0))
                        } else {
                            setFrame(getFrame(elements, animIndices.cycleIndex - 1, 0, 0))
                        }
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
                        const animIndices = getAnimationIndices(elements, frame);
                        if (animIndices.cycleIndex === elements.contents - 1) {
                            setFrame(getFrame(elements, 0, 0, 0))
                        } else {
                            setFrame(getFrame(elements, animIndices.cycleIndex + 1, 0, 0))
                        }
                    }}
                >Next
                </button>
            </div>
        </div>
    </div>;
}
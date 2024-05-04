import {Layer, Stage} from "react-konva";
import PropTypes from "prop-types";
import React, {useState} from "react";
import useInterval from "../hooks/Interval";
import useWindowSize from "../hooks/WindowSize";
import {VIRTUAL_CANVAS_HEIGHT, VIRTUAL_CANVAS_WIDTH} from "../data/Constants";

const AnimationPlayer = (props) => {
    const {animation} = props;
    const [currentFrame, setCurrentFrame] = useState(0);
    const [isPlaying, setPlaying] = useState(false);

    const viewport = useWindowSize();
    const canvasWidth = viewport.width * 0.95;
    const canvasHeight = viewport.height * 0.85;

    const [frame, setFrame] = useState(animation?.frames[currentFrame]?.getFrame());
    const [frameSpeed, setFrameSpeed] = useState(animation?.frames[currentFrame]?.frameSpeedMs);

    const updateFrameCallback = (newFrame) => {
        const currFrame = newFrame!==null && newFrame!==undefined ? newFrame : currentFrame;
        setFrame(animation?.frames[currFrame]?.getFrame());
        setFrameSpeed(animation?.frames[currFrame]?.frameSpeedMs);
    };

    const clearState = (newFrame: number) => {
        const eventShapes = {};
        animation?.frames[currentFrame]?.shapes.forEach((shape) => {
            if(shape.onHoverShapes.length > 0) {
                eventShapes[shape.shape.id()] = shape.onHoverShapes;
                shape.clearOnHoverShapes();
            }
        });
        animation?.frames[newFrame]?.shapes.forEach((shape) => {
            if(eventShapes[shape.shape.id()]) {
                shape.onHoverShapes = eventShapes[shape.shape.id()];
            }
        });
    };

    animation?.frames[currentFrame]?.shapes.forEach((shape) => {
        shape.callback = updateFrameCallback;
    });

    useInterval(() => {
        if(!isPlaying) return;
        if (currentFrame < animation.frames.length - 1) {
            const newFrame = currentFrame + 1;
            clearState(newFrame);
            setCurrentFrame(newFrame)
            updateFrameCallback(newFrame);
        } else {
            clearState(0);
            setCurrentFrame(0)
            updateFrameCallback(0)
        }
    }, frameSpeed);

    return (
        <div
            style={
                {
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center"
                }
            }
        >
            <Stage
                style={
                    {
                        border: "1px solid black"
                    }
                }
                width={canvasWidth}
                height={canvasHeight}
                scale={
                    {
                        x: canvasWidth / VIRTUAL_CANVAS_WIDTH,
                        y: canvasHeight / VIRTUAL_CANVAS_HEIGHT
                    }
                }
            >
                <Layer>
                    {
                        frame
                    }
                </Layer>
            </Stage>
            <div style={
                {
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%"
                }
            }>
                <input
                    style={
                        {
                            width: "85%"
                        }
                    }
                    type="range"
                    min="0" max={animation.frames.length-1}
                    value={currentFrame}
                    onChange={(e) => {
                        const newFrame = parseInt(e.target.value);
                        clearState(newFrame);
                        setCurrentFrame(newFrame)
                        updateFrameCallback(newFrame);
                    }}
                    step="1"
                />
                <div>
                    <button
                        onClick={() => {
                            if (currentFrame > 0) {
                                const newFrame = currentFrame - 1;
                                clearState(newFrame);
                                setCurrentFrame(newFrame)
                                updateFrameCallback(newFrame);
                            } else {
                                clearState(0);
                                setCurrentFrame(0)
                                updateFrameCallback(0);
                            }
                        }}
                    >Previous</button>
                    <button
                        onClick={() => {
                            setPlaying(!isPlaying);
                        }}
                    >{isPlaying ? 'Stop' : 'Play'}</button>
                    <button
                        onClick={() => {
                            if (currentFrame < animation.frames.length - 1) {
                                const newFrame = currentFrame + 1;
                                clearState(newFrame);
                                setCurrentFrame(newFrame)
                                updateFrameCallback(newFrame);
                            } else {
                                const newFrame = animation.frames.length - 1;
                                clearState(newFrame);
                                setCurrentFrame(newFrame)
                                updateFrameCallback(newFrame);
                            }
                        }}
                    >Next</button>
                </div>
            </div>
        </div>
    )
}

AnimationPlayer.propTypes = {
    animation: PropTypes.object.isRequired
}

export default AnimationPlayer;
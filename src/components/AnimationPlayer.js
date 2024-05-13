import {Layer, Stage} from "react-konva";
import React, {useEffect, useState} from "react";
import useInterval from "../hooks/Interval";
import useWindowSize from "../hooks/WindowSize";
import {VIRTUAL_CANVAS_HEIGHT, VIRTUAL_CANVAS_WIDTH} from "../data/Constants";
import {Frame} from "../models/animation/Frame";
import {AnimationFrames} from "../models/animation/AnimationFrames";

const CustomLayer = (props: {frame: Frame}) => {
    const [eventShapes, setEventShapes] = useState(props.frame?.shapes?.map(shape => shape?.onHoverShapes?.length).reduce((a, b) => a + b, 0));
    props.frame?.shapes.forEach((shape) => {
        shape.callback = () => {
            setEventShapes(props.frame?.shapes?.map(shape => shape?.onHoverShapes?.length).reduce((a, b) => a + b, 0))
        }
    })

    return (
        <Layer>
            {props.frame?.getFrame()}
        </Layer>
    )
}

const CustomStage = (props) => {
    const viewport = useWindowSize();

    const canvasWidth = viewport.width * 0.95;
    const canvasHeight = viewport.height * 0.85;

    return (
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
        >{props.children}</Stage>
    )
}

const AnimationPlayer = (props:{animation: AnimationFrames}) => {
    const [currentFrame, setCurrentFrame] = useState(0);
    const [isPlaying, setPlaying] = useState(false);
    const [frame, setFrame] = useState(props.animation?.frames[currentFrame]);
    const [newBlockFrames, setNewBlockFrames] = useState([0]);

    const findNewBlock = (currFrame: number, frameChange: number) => {
        let newFrame = currFrame;

        for (let i = 0; i < newBlockFrames.length; i++) {
            if (frameChange > 0 && newBlockFrames[i] > currFrame) {
                newFrame = newBlockFrames[i];
                break;
            } else if (frameChange < 0 && newBlockFrames[newBlockFrames.length-1-i] < currFrame) {
                newFrame = newBlockFrames[newBlockFrames.length-1-i];
                break;
            }
        }
        return newFrame;
    };


    useEffect(() => {
        setCurrentFrame(0)
        setPlaying(false)
        clearState(0)
        setFrame(props.animation?.frames[currentFrame])
        const newBlockFrames = [];
        props.animation?.frames.forEach((fr, index) => {
            if(fr.isNewBlock) {
                newBlockFrames.push(index)
            }
        })
        setNewBlockFrames(newBlockFrames)
    }, [props.animation])

    useEffect(() => {
        setFrame(props.animation?.frames[currentFrame])
        setDelay(frame?.frameSpeedMs)
    }, [currentFrame])

    const clearState = (newFrame: number) => {
        const eventShapes = {};
        frame?.shapes?.forEach((shape) => {
            if(shape?.onHoverShapes.length > 0) {
                eventShapes[shape?.shape?.id()] = shape.onHoverShapes;
                shape?.clearOnHoverShapes();
            }
        });
        props.animation?.frames[newFrame]?.shapes.forEach((shape) => {
            if(eventShapes[shape?.shape?.id()]) {
                shape.onHoverShapes = eventShapes[shape.shape.id()];
            }
        });
    };

    const setDelay = useInterval(() => {
        if(!isPlaying) return;
        if (currentFrame < props.animation.frames.length - 1) {
            const newFrame = currentFrame + 1;
            clearState(newFrame);
            setCurrentFrame(newFrame)
        } else {
            clearState(0);
            setCurrentFrame(0)
        }
    });

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
            <CustomStage>
                <CustomLayer frame={frame}/>
            </CustomStage>
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
                    min="0" max={props.animation.frames.length-1}
                    value={currentFrame}
                    onChange={(e) => {
                        const newFrame = parseInt(e.target.value);
                        clearState(newFrame);
                        setCurrentFrame(newFrame)
                    }}
                    step="1"
                />
                <div>
                    <button
                        onClick={() => {
                            if (currentFrame > 0) {
                                const newFrame = findNewBlock(currentFrame, -1)
                                clearState(newFrame);
                                setCurrentFrame(newFrame)
                            } else {
                                clearState(0);
                                setCurrentFrame(0)
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
                            if (currentFrame < props.animation.frames.length - 1) {
                                const newFrame = findNewBlock(currentFrame, 1);
                                clearState(newFrame);
                                setCurrentFrame(newFrame)
                            } else {
                                const newFrame = props.animation.frames.length - 1;
                                clearState(newFrame);
                                setCurrentFrame(newFrame)
                            }
                        }}
                    >Next</button>
                </div>
            </div>
        </div>
    )
}

export default AnimationPlayer;
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

    useInterval(() => {
        if(!isPlaying) return;
        if (currentFrame < animation.frames.length - 1) {
            setCurrentFrame(currentFrame + 1)
        } else {
            setCurrentFrame(0)
        }
    }, 1000);
    const viewport = useWindowSize();
    const canvasWidth = viewport.width * 0.95;
    const canvasHeight = viewport.height * 0.85;
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
                        animation?.frames[currentFrame]?.shapes.map((shape, index) => {
                            return (
                                React.cloneElement(shape, {
                                    key: index
                                })
                            )
                        })
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
                        setCurrentFrame(parseInt(e.target.value))
                    }}
                    step="1"
                />
                <div>
                    <button
                        onClick={() => {
                            if (currentFrame > 0) {
                                setCurrentFrame(currentFrame - 1)
                            } else {
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
                            if (currentFrame < animation.frames.length - 1) {
                                setCurrentFrame(currentFrame + 1)
                            } else {
                                setCurrentFrame(animation.frames.length - 1)
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
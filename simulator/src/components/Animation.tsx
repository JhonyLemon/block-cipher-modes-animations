import { useSpring, animated, useChain } from '@react-spring/web'
import {useRef} from "react";

// @ts-ignore
const Animation = ({ frames }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const animationRefs = useRef(frames.map(() => useRef()));

    // @ts-ignore
    const animations = frames.map((frame, index) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        return useSpring({
            ...frame.animationProps,
            config: { duration: 1000 },
            ref: animationRefs.current[index]
        });
    });

    useChain(animationRefs.current);

    return (
        <>
            {// @ts-ignore
                frames.map((_, index) => (
                <animated.div key={index} style={animations[index]}>
                    {frames[index].content}
                </animated.div>
            ))}
        </>
    )
};
export default  Animation;

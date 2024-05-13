import {useEffect, useRef, useState} from "react";

const useInterval = (callback) => {
    const [delay, setDelay] = useState(1000);
    const savedCallback = useRef();

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);
    useEffect(() => {
        const tick = () => savedCallback.current();
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
    return (d) => setDelay(d);
};

export default useInterval;

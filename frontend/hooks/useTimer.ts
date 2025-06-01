import React, {useState, useEffect, useCallback, useRef} from "react"

function useTime() {
    const [isRunning, setIsRunning] = useState(false);
    const [remaining, setRemaining] = useState(0);

    const animationFrameRef = useRef<number | null>(null);
    const startTimeRef = useRef<number>(0);

    const durationRef = useRef<number>(0);

    const updateRemaining = useCallback(() => {
        const now = Date.now();
        const elapsed = now - startTimeRef.current;
        const newRemaining = Math.max(0, durationRef.current - elapsed)

        setRemaining(newRemaining);

        if (newRemaining > 0) {
            animationFrameRef.current = requestAnimationFrame(updateRemaining);
        } else {
            setIsRunning(false);
            animationFrameRef.current = null;
        }
    }, [isRunning]);

    const startTimer = useCallback((newDuration: number) => {
        if (isRunning) return;

        setIsRunning(true);
        setRemaining(newDuration);
        startTimeRef.current = Date.now();
        durationRef.current = newDuration;
        animationFrameRef.current = requestAnimationFrame(updateRemaining);
    }, [isRunning, updateRemaining])

    const getDuration = useCallback(()=>{
        return durationRef.current
    }, [])


    return {
        startTimer,
        updateRemaining,
        getDuration,
        isRunning,
        remaining
    }
}

export default useTime;
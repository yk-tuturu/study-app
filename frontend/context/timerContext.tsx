import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

type TimerContextType = {
    startTimer: (newDuration: number)=> void;
    getDuration: ()=>number;
    isRunning: boolean;
    remaining: number;
    pauseTimer: ()=>void;
    unpauseTimer: ()=>void;
    getPaused: ()=>boolean;
};

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isRunning, setIsRunning] = useState(false);
    const [remaining, setRemaining] = useState(0);

    const animationFrameRef = useRef<number | null>(null);
    const startTimeRef = useRef<number>(0);

    const durationRef = useRef<number>(0);
    const pausedRef = useRef<boolean>(false);

    const timeStartedPause = useRef<number>(0);

    const updateRemaining = useCallback(() => {
        if (pausedRef.current) {
            animationFrameRef.current = requestAnimationFrame(updateRemaining);
            return
        }

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
    }, []);

    const startTimer = useCallback((newDuration: number) => {
        if (isRunning) return;

        setIsRunning(true);
        setRemaining(newDuration);
        startTimeRef.current = Date.now();
        durationRef.current = newDuration;
        animationFrameRef.current = requestAnimationFrame(updateRemaining);
    }, [isRunning, updateRemaining])

    const pauseTimer = useCallback(()=> {
        pausedRef.current = true
        timeStartedPause.current = Date.now();
    }, [])

    const unpauseTimer = useCallback(()=>{
        pausedRef.current = false

        var pausedTimeElapsed = Date.now() - timeStartedPause.current;
        startTimeRef.current += pausedTimeElapsed;
    }, [])

    const getDuration = useCallback(()=>{
        return durationRef.current
    }, [])

    const getPaused = useCallback(()=>{
        return pausedRef.current;
    }, [])

  return (
    <TimerContext.Provider value={{ startTimer,
        getDuration,
        isRunning,
        remaining,
        pauseTimer,
        unpauseTimer,
        getPaused }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) throw new Error("useTimer must be used within a TimerProvider");
  return context;
};
import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';

import axios, { AxiosError } from 'axios';
import config from '@/config';

import { useAuth } from './authContext';
import { ParseError } from '@/util';

type EndStatsType = {
    currentTime: number,
    totalTime: number,
    coinAmount: number
}

type SubjectInfoType = {
    id: string,
    name: string
}

type TimerContextType = {
    startTimer: (newDuration: number, subjectId: string, subjectName: string)=> void;
    getDuration: ()=>number;
    isRunning: boolean;
    remaining: number;
    isEnded: boolean;
    endStats: EndStatsType;
    pauseTimer: ()=>void;
    unpauseTimer: ()=>void;
    getPaused: ()=>boolean;
    getElapsedInMins: ()=>number;
    clearTimer: ()=>void;
    endTimer: ()=>void;
    getCurrentSubject: ()=>SubjectInfoType;
    wasPausedByAppBackground: boolean;
    clearWasPausedByAppBackground: () => void;
    isPaused: boolean; 
};

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isRunning, setIsRunning] = useState(false);
    const [remaining, setRemaining] = useState(0);
    const [isPaused, setIsPaused] = useState(false); 
 
    const [isEnded, setIsEnded] = useState(false); // when this is true, show the modal that appears at the end of the timer
    const [endStats, setEndStats] = useState<EndStatsType>({
        currentTime: 0,
        totalTime: 0,
        coinAmount: 0
    }) 
    
    const animationFrameRef = useRef<number | null>(null); 
    const elapsedRef = useRef(0); // time elapsed 

    const durationRef = useRef<number>(0); // the total duration that the timer is set to countdown
    const pausedRef = useRef<boolean>(false); 
    const pausedAtRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const subjectRef = useRef<SubjectInfoType>({
        id: "",
        name: ""
    })
    const [wasPausedByAppBackground, setWasPausedByAppBackground] = useState(false);

    const {token} = useAuth()

    const updateRemaining = () => {
        if (!startTimeRef.current) return;

        if (pausedRef.current) {
            animationFrameRef.current = requestAnimationFrame(updateRemaining);
            return;
        }

        const now = Date.now();
        elapsedRef.current = now - startTimeRef.current;
        const newRemaining = Math.max(0, durationRef.current - elapsedRef.current);

        setRemaining(newRemaining);

        if (newRemaining > 0) {
            animationFrameRef.current = requestAnimationFrame(updateRemaining);
        } else {
            console.log("timer end");
            setIsEnded(true);
            submitTime(Math.floor(elapsedRef.current / 1000 / 60));
            animationFrameRef.current = null;
        }
    };

    const startTimer = useCallback((newDuration: number, subjectId: string, subjectName: string) => {
        if (isRunning) return;

        setIsRunning(true);
        setRemaining(newDuration);
        setIsPaused(false); 
        
        startTimeRef.current = Date.now();
        elapsedRef.current = 0;
        durationRef.current = newDuration;

        pausedRef.current = false;
        pausedAtRef.current = null;

        subjectRef.current = {
            id: subjectId,
            name: subjectName
        };

        animationFrameRef.current = requestAnimationFrame(updateRemaining);
    }, [isRunning]);

    // called when timer ends 
    // submits results to backend
    const submitTime = async(mins: number) => {
        try {
            const res = await axios.post(`${config.BACKEND_URL}/api/subject/update`, {
                subjectId: subjectRef.current.id,
                mins: Math.max(1, mins) // clamp min of 1 for testing, since i often use a 0.1 min timer for testing
            }, {headers: {
                Authorization: `Bearer ${token}`
            }})

            const coinRes = await axios.post(`${config.BACKEND_URL}/api/user/addCoins`, {
                coinAmount: Math.max(Math.floor(mins / 5), 1)
            }, {headers: {
                Authorization: `Bearer ${token}`
            }})

            setEndStats({
                currentTime: mins,
                totalTime: res.data?.data?.totalMins,
                coinAmount: Math.floor(mins / 5)
            })

            setIsEnded(true);
            
        } catch(err) {
            console.log("error")
            console.log(ParseError(err as AxiosError))
        }
    }

    // resets all the variables after the timer is run out and the end modal is dismissed
    const clearTimer = useCallback(()=> {
        setIsEnded(false);
        setIsRunning(false);
        setIsPaused(false);
        setRemaining(0);
        setEndStats({
            currentTime: 0,
            totalTime: 0,
            coinAmount: 0
        });

        pausedRef.current = false;
        durationRef.current = 0;
        elapsedRef.current = 0;
        subjectRef.current = {
            id: "",
            name: ""
        }
    }, [])

    const pauseTimer = useCallback(() => {
        pausedRef.current = true;
        setIsPaused(true);

        if (animationFrameRef.current !== null) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }

        pausedAtRef.current = Date.now(); // save when we paused
        }, []);

    const unpauseTimer = useCallback(() => {
        if (!startTimeRef.current) return;

        if (pausedRef.current && pausedAtRef.current !== null) {
            const pausedDuration = Date.now() - pausedAtRef.current;
            startTimeRef.current += pausedDuration;
        }
        setIsPaused(false); 
        pausedRef.current = false;
        pausedAtRef.current = null;

        if (animationFrameRef.current === null) {
            animationFrameRef.current = requestAnimationFrame(updateRemaining);
        }
    }, []);

    // for the stop button when the timer is terminated early
    const endTimer = useCallback(async()=>{
        if (animationFrameRef.current !== null) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        animationFrameRef.current = null;
        await submitTime(Math.floor(elapsedRef.current / 1000 / 60));
        setIsPaused(false); 

    }, [submitTime])

    const getDuration = useCallback(()=>{
        return durationRef.current
    }, [])

    const getPaused = useCallback(()=>{
        return pausedRef.current;
    }, [])

    const getElapsedInMins = useCallback(()=>{
        return Math.floor(elapsedRef.current / 1000 /60);
    }, [])

    const getCurrentSubject = useCallback(()=> {
        return subjectRef.current;
    }, [])

    const clearWasPausedByAppBackground = useCallback(() => {
        setWasPausedByAppBackground(false);
    }, []);

    useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
        if (nextAppState === 'background' || nextAppState === 'inactive') {
        if (isRunning && !getPaused()) {
            pauseTimer();
            console.log("Timer paused as app is inactive");
        }
        } else if (nextAppState === 'active') {
        if (isRunning && getPaused()) {
            console.log("App is active but timer remains paused");
            setWasPausedByAppBackground(true);
        }
        }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
        subscription.remove();
    };
    }, [isRunning, pauseTimer, getPaused]);


  return (
    <TimerContext.Provider value={{
    startTimer,
    getDuration,
    isRunning,
    remaining,
    isEnded,
    endStats,
    isPaused, 
    pauseTimer,
    unpauseTimer,
    getPaused,
    getElapsedInMins,
    clearTimer,
    endTimer,
    getCurrentSubject,
    wasPausedByAppBackground,
    clearWasPausedByAppBackground
    }}>
    {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) throw new Error("useTimer must be used within a TimerProvider");
  return context;
};
import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

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
};

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isRunning, setIsRunning] = useState(false);
    const [remaining, setRemaining] = useState(0);

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
    const subjectRef = useRef<SubjectInfoType>({
        id: "",
        name: ""
    })

    const {token} = useAuth()

    const prevFrameRef = useRef<number>(0); // used to calculate delta time per frame

    const updateRemaining = () => {
        if (pausedRef.current) {
            animationFrameRef.current = requestAnimationFrame(updateRemaining);
            prevFrameRef.current = Date.now();
            return
        }

        const now = Date.now();
        const deltaTime = now - prevFrameRef.current;
        elapsedRef.current += deltaTime;

        const newRemaining = Math.max(0, durationRef.current - elapsedRef.current)

        setRemaining(newRemaining);

        if (newRemaining > 0) {
            prevFrameRef.current = Date.now();
            animationFrameRef.current = requestAnimationFrame(updateRemaining);
        } else {
            console.log("timer end");
            setIsEnded(true);
            submitTime(Math.floor(elapsedRef.current / 1000 / 60))
            animationFrameRef.current = null;
        }
    }

    const startTimer = useCallback((newDuration: number, subjectId: string, subjectName: string) => {
        if (isRunning) return;

        setIsRunning(true);
        setRemaining(newDuration);
        prevFrameRef.current = Date.now();
        durationRef.current = newDuration;
        subjectRef.current = {
            id: subjectId,
            name: subjectName
        }
        animationFrameRef.current = requestAnimationFrame(updateRemaining);

    }, [isRunning, updateRemaining])

    // called when timer ends 
    // submits results to backend
    const submitTime = async(mins: number) => {
        try {
            const res = await axios.post(`${config.BACKEND_URL}/api/subject/update`, {
                subjectId: subjectRef.current.id,
                mins: Math.max(1, mins) // clamp min of 1 for testing, since i often use a 0.1 min timer for testing
            }, {headers: {
                Authorization: `Bearer: ${token}`
            }})

            const coinRes = await axios.post(`${config.BACKEND_URL}/api/user/addCoins`, {
                coinAmount: Math.max(Math.floor(mins / 5), 1)
            }, {headers: {
                Authorization: `Bearer: ${token}`
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

    

    const pauseTimer = useCallback(()=> {
        pausedRef.current = true
    }, [])

    const unpauseTimer = useCallback(()=>{
        pausedRef.current = false
    }, [])
    
    // for the stop button when the timer is terminated early
    const endTimer = useCallback(async()=>{
        if (animationFrameRef.current !== null) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        animationFrameRef.current = null;
        await submitTime(Math.floor(elapsedRef.current / 1000 / 60));

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

  return (
    <TimerContext.Provider value={{ startTimer,
        getDuration,
        isRunning,
        remaining,
        isEnded,
        endStats,
        pauseTimer,
        unpauseTimer,
        getPaused,
        getElapsedInMins,
        clearTimer,
        endTimer,
        getCurrentSubject }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) throw new Error("useTimer must be used within a TimerProvider");
  return context;
};
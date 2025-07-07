import {View, StyleSheet, StyleProp, ViewStyle, Dimensions} from "react-native";
import { Image } from "expo-image";
import React, {useState} from "react";
import { CircularProgress } from 'react-native-circular-progress';
import colors from "@/constants/Colors";
import ThemedText from "./text/ThemedText";
import TextOutline from "./text/TextOutline";
import IconButton from "./buttons/IconButton";
import { useEffect } from "react";

import {useTimer} from "@/context/timerContext";
import ThemedModal from "./general/ThemedModal";
import TextButton from "./buttons/TextButton";

interface Props {
    time: number
    duration: number
    style?: StyleProp<ViewStyle>
}

const { width, height } = Dimensions.get('window');


const TimerDisplay: React.FC<Props> = ({time, duration, style}) => {
    const mins = Math.floor(time / 1000 / 60);
    const secs = Math.floor(time/1000 - mins * 60);

    const paddedMins = String(mins).padStart(2, '0'); 
    const paddedSecs = String(secs).padStart(2, '0'); 

    const {
    pauseTimer,
    unpauseTimer,
    getPaused,
    endTimer,
    wasPausedByAppBackground,
    clearWasPausedByAppBackground, 
    isPaused, 
    } = useTimer();

    const [showConfirmStopModal, setShowConfirmStopModal] = useState(false);
    const [showAppInactiveModal, setShowAppInactiveModal] = useState(false);

    function handlePause() {
        if (isPaused) {
            unpauseTimer();
        } else {
            pauseTimer();
        }
    }

    function handleStop() {
        pauseTimer();
        setShowConfirmStopModal(true);
    }

    function dontStop() {
        setShowConfirmStopModal(false);
        unpauseTimer();
    }

    function hideModal() {
        setShowConfirmStopModal(false);
    }

    function stopTimer() {
        if (!getPaused()) return;
        
        endTimer()
    }

    function dismissAppInactiveModal() {
    setShowAppInactiveModal(false);
    clearWasPausedByAppBackground();
    }

    useEffect(() => {
    if (wasPausedByAppBackground) {
        setShowAppInactiveModal(true);
    }
    }, [wasPausedByAppBackground]);

    return (
        <View style={style}>
            <CircularProgress
                size={Math.min(Math.floor(width*0.8), 500)}
                width={32}
                fill={time/duration * 100}
                arcSweepAngle={340}
                rotation={10}
                lineCap="round"
                tintColor={colors.accent}
                backgroundColor="#FFF4EA"
                style={{transform: [{scaleX: -1}]}} />
            
            <View style={styles.timerUIContainer}>
                
                <View style={{height: "100%", justifyContent: "center", alignItems:"center"}}>
                    <TextOutline
                        stroke={2}
                        color="#FFFFFF"
                    ><ThemedText type="font_xxl" style={{fontSize: 110, marginBottom: 8}}>{paddedMins + ":" + paddedSecs}</ThemedText>
                    </TextOutline>
                </View> 

                <View style={{position: "absolute", alignSelf: "center", bottom: "20%"}}>
                    <View style={{flexDirection: "row"}}>
                        <IconButton style={{marginHorizontal: 16}} onPress={handlePause}>
                        <Image source={isPaused? require("../assets/images/play.png") : require("../assets/images/pause.png")} style={styles.timerButton} />
                        </IconButton>
                        <IconButton style={{marginHorizontal: 16}} onPress={handleStop}>
                        <Image source={require("../assets/images/stop.png")} style={styles.timerButton} />
                        </IconButton>
                    </View>
                </View>
            </View>
            <ThemedModal
                isVisible={showConfirmStopModal}
                onDismiss={dontStop}
                style={{marginHorizontal: 16}}
                onModalHide={stopTimer}
            >
                <View style={{alignItems: "center", padding: 16}}>
                    <ThemedText type="font_md">Confirm Stop?</ThemedText>
                    <TextButton onPress={hideModal}>
                        <ThemedText type="font_md">Yes</ThemedText>
                    </TextButton>
                </View>
            </ThemedModal>
            <ThemedModal
                isVisible={showAppInactiveModal}
                onDismiss={dismissAppInactiveModal}
                style={{marginHorizontal: 16}}
                >
                <View style={{alignItems: "center", padding: 16}}>
                    <ThemedText type="font_md">Timer Paused due to Inactivity</ThemedText>
                    <TextButton onPress={dismissAppInactiveModal}>
                    <ThemedText type="font_md">OK</ThemedText>
                    </TextButton>
                </View>
            </ThemedModal>
        </View>
    )
}

const styles = StyleSheet.create({
    timerUIContainer: {
        position: "absolute",
        width: "100%",
        height: "100%"
    },
    timerButton: {
        width: 24,
        height: 24
    }

})

export default TimerDisplay;
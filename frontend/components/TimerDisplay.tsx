import {View, StyleSheet, Image, StyleProp, ViewStyle, Dimensions} from "react-native";
import React, {useEffect} from "react";
import { CircularProgress } from 'react-native-circular-progress';
import colors from "@/constants/Colors";
import ThemedText from "./ThemedText";
import TextOutline from "./TextOutline";
import IconButton from "./buttons/IconButton";

import {useTimer} from "@/context/timerContext";

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

    const {pauseTimer, unpauseTimer, getPaused} = useTimer();

    function handlePause() {
        console.log("pausing");
        console.log(getPaused());
        if (getPaused()) {
            unpauseTimer();
        } else {
            pauseTimer();
        }
    }

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
                        <Image source={require("../assets/images/pause.png")} style={styles.timerButton} />
                        </IconButton>
                        <IconButton style={{marginHorizontal: 16}} onPress={() => console.log("stop")}>
                        <Image source={require("../assets/images/stop.png")} style={styles.timerButton} />
                        </IconButton>
                    </View>
                </View>
            </View>
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
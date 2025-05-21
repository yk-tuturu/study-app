import {View, StyleSheet, Image, StyleProp, ViewStyle, Dimensions} from "react-native";
import React from "react";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import colors from "@/constants/Colors";
import ThemedText from "./ThemedText";
import TextOutline from "./TextOutline";
import IconButton from "./IconButton";

interface Props {
    style?: StyleProp<ViewStyle>
}

const { width, height } = Dimensions.get('window');

const TimerDisplay: React.FC<Props> = ({style}) => {
    return (
        <View style={style}>
            <AnimatedCircularProgress
                size={Math.min(Math.floor(width*0.8), 500)}
                width={32}
                fill={90}
                arcSweepAngle={340}
                rotation={10}
                lineCap="round"
                tintColor={colors.accent}
                onAnimationComplete={() => console.log('onAnimationComplete')}
                backgroundColor="#FFF4EA"
                style={{transform: [{scaleX: -1}]}} />
            <View style={styles.timerUIContainer}>
                <View style={{height: "100%", justifyContent: "center", alignItems:"center"}}>
                    <TextOutline
                        stroke={2}
                        color="#FFFFFF"
                    ><ThemedText type="font_xxl" style={{fontSize: 110, marginBottom: 12}}>30:00</ThemedText>
                    </TextOutline>
                </View>
                <View style={{position: "absolute", alignSelf: "center", bottom: "20%"}}>
                    <View style={{flexDirection: "row"}}>
                         <IconButton style={{marginHorizontal: 16}}>
                            <Image
                                source={require("../assets/images/pause.png")}
                                style={styles.timerButton}
                            />
                        </IconButton>
                        <IconButton style={{marginHorizontal: 16}}>
                            <Image
                                source={require("../assets/images/stop.png")}
                                style={styles.timerButton}
                            />
                        </IconButton>
                    </View>
                    
                       
                    
                </View>
            </View>
            
            <View style={{position: "absolute", width: "100%", height: "100%"}}>
                <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                    
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
        width: 16,
        height: 16
    }

})

export default TimerDisplay;
import {Text, View, StyleSheet, TouchableOpacity, Image} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import React, {useState, useEffect} from "react"
import { useRouter } from 'expo-router';
import {Toggle} from "@/components/Toggle";
import ThemedText from "@/components/ThemedText";
import colors from "@/constants/Colors";

import IconButton from "@/components/buttons/IconButton";
import SubjectTag from "@/components/SubjectTag";
import CircularButton from "@/components/buttons/CircularButton";
import {useTimer} from "@/context/timerContext"

export default function Timer() {
    const router = useRouter();
    const [timerOption, setTimerOption] = useState(0);

    const [duration, setDuration] = useState(30);

    const {startTimer} = useTimer();

    function addDuration() {
        setDuration(prev=> prev + 10);
    }

    function minusDuration() {
        setDuration(prev=>Math.max(0, prev - 10));
    }

    function updateTimerOption(index: number): void {
        setTimerOption(index);
    }

    function start() {
        startTimer(duration * 60 * 1000);
        router.push("./home")
    }

    return(
        <View style={styles.container}>
            <SafeAreaView style={styles.uiContainer}>
                <TouchableOpacity onPress={()=> {router.push("./")}}>
                    <Image
                        source={require("../../assets/images/close.png")}
                        style={styles.closeButton}
                    />
                </TouchableOpacity>
                <ThemedText type="font_md" style={styles.header}>Start Timer</ThemedText>
                <Toggle
                    currentOption={timerOption}
                    toggleElements={[
                        <Image 
                            source={require("../../assets/images/timer.png")}
                            style={styles.toggleImage}
                        />,
                        <Image
                            source={require("../../assets/images/stopwatch.png")}
                            style={styles.toggleImage}
                        />
                    ]}
                    onUpdate={updateTimerOption}
                    style={{marginBottom: 28}}
                ></Toggle>
                <View style={styles.timerDiv}>
                    <IconButton onPress={minusDuration}>
                        <Image
                            source={require("../../assets/images/minus.png")}
                            style={styles.timerButton}
                        />
                    </IconButton>
                    <ThemedText type="font_xxl" style={{marginHorizontal: 16, fontSize: 100}}>
                        {String(duration).padStart(2, '0') + ":00"}
                    </ThemedText>
                    <IconButton onPress={addDuration}>
                        <Image
                            source={require("../../assets/images/add.png")}
                            style={styles.timerButton}
                        />
                    </IconButton>
                </View>
                <View style={{marginBottom: 32}}>
                    <ThemedText type="font_sm">Mode: Countdown</ThemedText>
                    <ThemedText type="subtitle">Study until the timer runs out!</ThemedText>
                </View>

                <View style={{marginBottom: 16}}>
                    <ThemedText type="font_sm">Subjects</ThemedText>
                    <ThemedText type="subtitle">Select your subject goal</ThemedText>
                </View>
                <View style={styles.subjectContainer}>
                    <SubjectTag>
                        <ThemedText type="subtitle">CS1101S</ThemedText>
                    </SubjectTag>
                    <SubjectTag>
                        <ThemedText type="subtitle">CS1101S</ThemedText>
                    </SubjectTag>
                    <SubjectTag>
                        <ThemedText type="subtitle">CS1101Sa</ThemedText>
                    </SubjectTag>
                    <SubjectTag>
                        <ThemedText type="subtitle">CS1101S</ThemedText>
                    </SubjectTag>
                    <SubjectTag>
                        <ThemedText type="subtitle">CS1101Sasa</ThemedText>
                    </SubjectTag>
                </View>
                <CircularButton style={styles.playButton} onPress={start}>
                    <Image
                        source={require("../../assets/images/play.png")}
                        style={styles.playButtonImage}
                    />
                </CircularButton>
                
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.bg,
        flex: 1
    },
    uiContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        flex: 1
    },
    centerContainer: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center"
    },
    header: {
        textAlign: "center",
        marginBottom: 16
    },
    closeButton: {
        width: 20,
        height: 20,
        marginBottom: 32,
        marginTop: 10
    },
    timerText: {
        fontSize: 100,
        textAlign: "center",
        lineHeight: 110
    },
    timerDiv: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 32
    },
    timerButton: {
        width: 16,
        height: 16
    },
    toggleImage: {
        width: 28,
        height: 28,
        marginHorizontal: 16,
        marginVertical: 6
    },
    subjectContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        width: "100%",
    },
    playButton: {
        position: "absolute",
        alignSelf: "center",
        bottom: "8%"
    },
    playButtonImage: {
        width: 48,
        height: 48
    }
})
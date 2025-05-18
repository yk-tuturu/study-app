import {Text, View, StyleSheet, TouchableOpacity, Image} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import React, {useState} from "react"
import { useRouter } from 'expo-router';
import {Toggle} from "@/components/Toggle";
import ThemedText from "@/components/ThemedText";
import colors from "@/constants/Colors";

import gs from "../../constants/GlobalStyles"
import IconButton from "@/components/IconButton";

export default function Timer() {
    const router = useRouter();
    const [timerOption, setTimerOption] = useState(0);

    function updateTimerOption(index: number): void {
        setTimerOption(index);
    }

    return(
        <View style={styles.container}>
            <SafeAreaView style={styles.uiContainer}>
                <TouchableOpacity onPress={()=> {router.push("./home")}}>
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
                    <IconButton>
                        <Image
                            source={require("../../assets/images/minus.png")}
                            style={styles.timerButton}
                        />
                    </IconButton>
                    <ThemedText type="font_xxl" style={{marginHorizontal: 16}}>30:00</ThemedText>
                    <IconButton>
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

                <View style={{marginBottom: 24}}>
                    <ThemedText type="font_sm">Subjects</ThemedText>
                    <ThemedText type="subtitle">Select your subject goal</ThemedText>
                </View>
                
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
        paddingVertical: 10
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
    }
})
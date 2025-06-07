import {View, StyleSheet, TouchableOpacity, Image, Modal, TouchableWithoutFeedback, Keyboard, ScrollView} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import React, {useState, useEffect} from "react"
import { useRouter } from 'expo-router';

import ThemedText from "@/components/text/ThemedText";
import IconButton from "@/components/buttons/IconButton";
import SubjectTag from "@/components/SubjectTag";
import CircularButton from "@/components/buttons/CircularButton";
import ThemedModal from "@/components/general/ThemedModal";
import StyledTextInput from "@/components/general/StyledTextInput";
import SubjectColor from "@/components/SubjectColor";
import {Toggle} from "@/components/general/Toggle";
import TextButton from "@/components/buttons/TextButton";

import colors from "@/constants/Colors";
import config from "@/config";

import {useTimer} from "@/context/timerContext";
import { useAuth } from "@/context/authContext";

import axios, {Axios, AxiosError} from "axios";
import { ParseError } from "@/util";

type SubjectType = {
    id: string,
    name: string,
    color: number
}

export default function Timer() {
    // this is for when i originally wanted two timer modes: countdown and stopwatch, but I gave up
    const [timerOption, setTimerOption] = useState(0); 
    
    const [subjects, setSubjects] = useState<SubjectType[]>([]);

    const [selectedSubject, setSelectedSubject] = useState(-1);
    const [showSubjectModal, setShowSubjectModal] = useState(false);
    const [newSubjectInput, setNewSubjectInput] = useState({
        name: "",
        color: -1
    })
    const [inputFocused, setInputFocused] = useState(false);
    const [error, setError] = useState("");
    
    const [duration, setDuration] = useState(1);

    const {startTimer} = useTimer();
    const {token, isLoggedIn} = useAuth();

    const router = useRouter();

    useEffect(()=> {
        fetchSubjectInfo();
    }, [])

    const fetchSubjectInfo = async() => {
        // not logged in (just a sanity check)
        if (!isLoggedIn || !token) {
            console.log("Authentication error")
            router.push("./login")
            return
        }

        console.log("fetching subjects")
        
        // if there was previously a subject selected, maintain the selection
        var prevSelectedSubjectId = ""
        if (selectedSubject != -1) {
            prevSelectedSubjectId = subjects[selectedSubject].id;
            setSelectedSubject(-1);
        }

        // get all subjects under this user
        try {
            const res = await axios.get(`${config.BACKEND_URL}/api/subject/getAll`, {
                headers: { Authorization: `Bearer ${token}` },
            })

            const newSubjects = res.data.data.map((subject: any, index: number) => {
                if (subject._id === prevSelectedSubjectId) {
                    setSelectedSubject(index);
                }

                return {
                    id: subject._id,
                    name: subject.name,
                    color: Math.max(subject.color, 0) // accidentally created a color of -1 in the backend one time, just a check for that
                }
            })

            setSubjects(newSubjects);
        } catch(err) {
            console.log(err);
        }
    }

    // changes the selected subject
    // we mark the selected subject by index, but this approach may not account for when the index changes, so this is lowkey kinda bad
    // but comparing ids sounds a bit inefficient...
    function handleSelectSubject(index: number) {
        setSelectedSubject(index);
    }

    // close the new subject modal 
    function handleCloseModal() {
        if (inputFocused) {
            Keyboard.dismiss()
            return;
        }

        setShowSubjectModal(false);
        setNewSubjectInput({
            name: "",
            color: -1
        })
        setError("");
    }

    // updates subject color in the new subject modal
    function selectColor(index: number) {
        setNewSubjectInput(prev => ({...prev, color: index}))
    }

    // axios request to create the new subject
    const createNewSubject = async() => {
        if (newSubjectInput.name === "") {
            setError("Subject name cannot be empty")
            return;
        } 

        if (newSubjectInput.color === -1) {
            setError("A color must be selected")
            return;
        }
        
        try {
            await axios.post(`${config.BACKEND_URL}/api/subject/new`, {
                name: newSubjectInput.name,
                color: newSubjectInput.color
            }, {headers: {
                Authorization: `Bearer: ${token}`
            }})

            await fetchSubjectInfo();
            handleCloseModal();

        } catch(err) {
            console.log(ParseError(err as AxiosError));
            setError(ParseError(err as AxiosError))
        }
        
    }

    function addDuration() {
        setDuration(prev=> prev + 10);
    }

    function minusDuration() {
        setDuration(prev=>Math.max(0, prev - 10));
    }

    // for the toggle that controls the timer mode: countdown and stopwatch, 
    // but as of rn i havent actually implemented that yet so this just updates the toggle graphic
    function updateTimerOption(index: number): void {
        setTimerOption(index);
    }

    // starts the timer and navs back to main page
    function start() {
        if (selectedSubject === -1) {
            console.log("a subject must be selected"); // change this to some sort of notif later
            return;
        }

        startTimer(duration * 60 * 1000, subjects[selectedSubject].id, subjects[selectedSubject].name);
        router.push("./")
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
                    {
                        subjects.map((subject, index) => {
                            return <SubjectTag
                                key={index}
                                name={subject.name}
                                color={subject.color}
                                onSelect={() => handleSelectSubject(index)}
                                isSelected={selectedSubject === index}
                            />
                        })
                    }
                    <TouchableOpacity onPress={()=>setShowSubjectModal(true)} style={styles.subjectAddButton}>
                        <Image
                            source={require("../../assets/images/add.png")}
                            style={{width: 16, height: 16}}
                        />
                    </TouchableOpacity>
                </View>
                <CircularButton style={styles.playButton} onPress={start}>
                    <Image
                        source={require("../../assets/images/play.png")}
                        style={styles.playButtonImage}
                    />
                </CircularButton>
                <ThemedModal 
                    isVisible={showSubjectModal}
                    onDismiss={handleCloseModal}
                    style={{marginHorizontal: 20}}
                >
                    <View style={styles.subjectModalContainer}>
                        <ThemedText type="font_md" style={{marginBottom: 16}}>New Subject</ThemedText>
                        <ThemedText type="font_sm">Name</ThemedText>
                        <StyledTextInput
                            value={newSubjectInput.name}
                            onChangeText={(e)=>setNewSubjectInput(prev=>({...prev, name: e}))}
                            placeholder="Enter subject name"
                            onFocus={()=>setInputFocused(true)}
                            onBlur={()=>setInputFocused(false)}
                            changeColor={false}
                            style={{marginBottom: 16}}
                        />
                        <ThemedText type="font_sm" style={{marginBottom: 8}}>Select color</ThemedText>
                        <View style={[styles.subjectContainer, {marginBottom: 32}]}>
                            {colors.subjects.map((color, index) => {
                                return (
                                    <SubjectColor 
                                        key={index}
                                        colorType={index} 
                                        selected={index===newSubjectInput.color}
                                        onPress={()=>selectColor(index)}
                                        style={{marginRight: 8, marginBottom: 8}}/>
                                )
                            })}
                        </View>
                        <ThemedText type="error">{error}</ThemedText>
                        <TextButton onPress={createNewSubject}>
                            <ThemedText type="font_md" style={{marginTop: 4}}>Create</ThemedText>
                        </TextButton>
                    </View>
                    
                </ThemedModal>
                
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
    },
    subjectAddButton: {
        borderRadius: 8,
        backgroundColor: colors.primary,
        borderColor: colors.accent,
        borderWidth: 2,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
        paddingVertical: 4,
        paddingHorizontal: 6
    }, 
    subjectModalContainer: {
        padding: 8,
        paddingTop: 16
    }
})
import {TextInput, ViewStyle, StyleProp, StyleSheet, View, TouchableWithoutFeedback, Keyboard} from "react-native"
import React, {useState} from "react"
import colors from "@/constants/Colors";
import ThemedText from "../text/ThemedText";

interface Props {
    value: string;
    label?: string;
    placeholder?: string;

    onChangeText?: (e: string) => void;
    onFocus?: ()=>void;
    onBlur?: ()=>void;

    secureTextEntry?: boolean;
    changeColor?: boolean;
    style?: StyleProp<ViewStyle>;
}

interface DismissProps {
    active: boolean
}

const KeyboardDismiss: React.FC<DismissProps> = ({active}) => {
    if (active) {
        return (
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}  >
                <View style={styles.overlay}></View>
            </TouchableWithoutFeedback>
        )
    } else {
        return <></>
    }
}

const StyledTextInput: React.FC<Props> = ({
    value, 
    label, 
    placeholder, 
    onChangeText, 
    onFocus, 
    onBlur, 
    secureTextEntry,
    changeColor=true, // whether the input changes color on focus
    style, 
}) => {
    const [focused, setFocused] = useState(false);

    function handleFocus() {
        setFocused(true);
        onFocus?.();
    }

    function handleBlur() {
        setFocused(false);
        onBlur?.()
    }
    return (
        <>
            <View style={[styles.wrapper, style]}>
                {label ? <ThemedText type="default">{label}</ThemedText> : <></>}
                <TextInput
                    placeholder={placeholder}
                    placeholderTextColor={colors.accent}
                    value={value}
                    onChangeText={onChangeText}
                    style={[styles.input, {backgroundColor: !changeColor || !focused ? colors.lightBg : colors.bg}]}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    secureTextEntry={secureTextEntry}
                />
            </View>
            <KeyboardDismiss active={focused}></KeyboardDismiss>
        </>
        
    )
}

const styles = StyleSheet.create({
    wrapper: {
        width: "100%"
    },
    input: {
        borderWidth: 2,
        borderRadius: 8,
        borderColor: colors.accent,
        marginVertical: 3,
        marginBottom: 10,
        padding: 16,
        width: "100%",
        color: colors.accent
    }, 
    overlay: {
        ...StyleSheet.absoluteFillObject, // shorthand for top: 0, left: 0, right: 0, bottom: 0
        backgroundColor: 'rgba(0, 0, 0, 0)', // example
        zIndex: 999
    }
})

export default StyledTextInput;
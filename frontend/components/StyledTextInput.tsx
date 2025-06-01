import {TextInput, ViewStyle, StyleProp, StyleSheet, View} from "react-native"
import React, {useState} from "react"
import colors from "@/constants/Colors";
import ThemedText from "./ThemedText";

interface Props {
    onChangeText?: (e: string) => void;
    style?: StyleProp<ViewStyle>;
    placeholder?: string;
    value: string;
    label?: string;
    onFocus?: ()=>void;
    onBlur?: ()=>void;
    secureTextEntry?: boolean
}

const StyledTextInput: React.FC<Props> = ({onChangeText, style, placeholder, value, label, onFocus, onBlur, secureTextEntry}) => {
    const [focused, setFocused] = useState(false);
    return (
        <View style={[styles.wrapper, style]}>
            {label ? <ThemedText type="default">{label}</ThemedText> : <></>}
            <TextInput
                placeholder={placeholder}
                placeholderTextColor={colors.accent}
                value={value}
                onChangeText={onChangeText}
                style={[styles.input, {backgroundColor: focused ? colors.bg : colors.lightBg}]}
                onFocus={()=>setFocused(true)}
                onBlur={()=>setFocused(false)}
                secureTextEntry={secureTextEntry}
            />
        </View>
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
    }
})

export default StyledTextInput;
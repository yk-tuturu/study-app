import {View, StyleSheet, Image, StyleProp, ViewStyle, TouchableOpacity} from "react-native"
import React from "react"
import colors from "@/constants/Colors"

interface Props {
    children?: React.ReactNode
    onPress?: () => void
    style?: StyleProp<ViewStyle>
}

const TextButton: React.FC<Props> = ({children, onPress, style}) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
            {children}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 8,
        backgroundColor: colors.primary,
        borderColor: colors.accent,
        borderWidth: 3,
        paddingVertical: 4,
        paddingHorizontal: 16,
        flexShrink: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    icon: {

    }
})

export default TextButton;
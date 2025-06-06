import {View, StyleSheet, Image, StyleProp, ViewStyle, TouchableOpacity} from "react-native"
import React from "react"
import colors from "@/constants/Colors"

interface Props {
    children?: React.ReactNode
    style?: StyleProp<ViewStyle>
}

const IconButtonStatic: React.FC<Props> = ({children, style}) => {
    return (
        <View style={[styles.button, style]}>
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 8,
        backgroundColor: colors.primary,
        borderColor: colors.accent,
        borderWidth: 3,
        padding: 8,
        flexShrink: 1
    },
    icon: {

    }
})

export default IconButtonStatic;
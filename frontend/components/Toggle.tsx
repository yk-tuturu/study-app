import {View, Text, Image, StyleSheet, TouchableWithoutFeedback, ViewStyle, StyleProp} from "react-native";
import React, {useState} from "react"
import colors from "@/constants/Colors";

interface ToggleProps {
    currentOption: number,
    toggleElements: React.ReactNode[],
    onUpdate: (index: number) => void, 
    style?: StyleProp<ViewStyle>; // Allow additional styles
}

export const Toggle: React.FC<ToggleProps> = ({
    currentOption,
    toggleElements,
    onUpdate,
    style
}) => {
    return (
        <View style={[styles.toggleParent, style]}>
            {toggleElements.map((item, index)=> (
                <TouchableWithoutFeedback 
                    key={index} 
                    onPress={()=>{onUpdate(index)}}>
                    <View style={[
                        index < toggleElements.length - 1 ? styles.toggleBorder : {},
                        index === 0 ? styles.roundLeft : {},
                        index === toggleElements.length - 1 ? styles.roundRight : {},
                        index === currentOption ? styles.toggleActive : {}
                    ]}>
                        {item}
                    </View>
                </TouchableWithoutFeedback>
            )
            )}
        </View>

    )
}

const styles = StyleSheet.create({
    toggleParent: {
        flexDirection: "row",
        justifyContent: "center",
        alignSelf: "center",
        borderRadius: 12,
        borderColor: colors.accent,
        borderWidth: 3,
    },
    toggleBorder: {
        borderRightWidth: 3,
        borderColor: colors.accent
    },
    roundLeft: {
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8
    },
    roundRight: {
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8
    },
    toggleActive: {
        backgroundColor: colors.primary
    }

})
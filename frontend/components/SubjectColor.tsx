import React, {useState} from "react"
import {View, StyleSheet, Touchable, TouchableOpacity, StyleProp, ViewStyle} from "react-native"

import colors from "@/constants/Colors"

type Props = {
    colorType: number
    selected: boolean
    onPress: ()=>void
    style?: StyleProp<ViewStyle>
}

const SubjectColor: React.FC<Props> = ({colorType, selected, onPress, style}) => {
    return (
        <View style={style}>
            <TouchableOpacity onPress={onPress} style={[styles.subjectColor, {
                backgroundColor: colors.subjects[colorType].main,
                borderColor: colors.subjects[colorType].outline,
                borderWidth: selected ? 3 : 0
            }]}>
                <View></View>
            </TouchableOpacity>
        </View>
        
    )
}

const styles = StyleSheet.create({
    subjectColor: {
        width: 36,
        height: 36
    }
})

export default SubjectColor;
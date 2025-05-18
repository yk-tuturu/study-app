import {View, StyleSheet, Text} from "react-native"
import React from "react"
import ThemedText from "./ThemedText"
import colors from "@/constants/Colors"

interface Props {
    children?: React.ReactNode
}

const SubjectTag: React.FC<Props> = ({children}) => {
    return (
        <View style={styles.container}>
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 8,
        borderWidth: 2,
        borderColor: colors.accent,
        backgroundColor: colors.primary,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginRight: 12,
        marginBottom: 12
    }
})

export default SubjectTag;
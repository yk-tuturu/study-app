import {View, StyleSheet, Image} from "react-native"
import React from "react"
import colors from "@/constants/Colors"

interface Props {
    children: React.ReactNode
}

const IconButton: React.FC<Props> = ({children}) => {
    return (
        <View style={styles.button}>
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
        padding: 8
    },
    icon: {

    }
})

export default IconButton;
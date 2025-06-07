import {View, StyleSheet, Text, TouchableOpacity} from "react-native"
import {Image} from "expo-image"
import React, {useState} from "react"
import ThemedText from "./text/ThemedText"
import colors from "@/constants/Colors"
import IconMap from "@/constants/Icons"

interface Props {
    filename: string,
    onSelect: ()=>void,
    isSelected: boolean
}

const AccessoryIcon: React.FC<Props> = ({filename, onSelect, isSelected}) => {
    return (
        <>
        <TouchableOpacity onPress={onSelect}>
            <View style={styles.container}>
                <Image
                    source={IconMap[filename]}
                    style={styles.iconImage}
                />
                <View style={[styles.overlay, {opacity: isSelected ? 0.5 : 0}]}></View>
                <View style={[styles.overlay, {backgroundColor: "transparent", opacity: isSelected ? 1 : 0}]}>
                    <ThemedText type="font_sm" style={styles.overlayText}>Equipped</ThemedText>
                </View>
                
            </View>
        </TouchableOpacity>
        
        </>
        
        
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 8,
        backgroundColor: "#D7AF87",
        width: 100,
        height: 100,
        marginBottom: 16,
        padding: 4
    },
    iconImage: {
        width: "100%",
        height: "100%"
    },
    overlay: {
        position: "absolute", 
        top: 0, 
        left: 0, 
        bottom: 0, 
        right: 0, 
        backgroundColor: "black",
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center"
    },
    overlayText: {
        alignSelf: "center",
        color: "white",
        lineHeight: 24
    }
})

export default AccessoryIcon;
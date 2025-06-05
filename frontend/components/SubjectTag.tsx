import {View, StyleSheet, Text, TouchableOpacity} from "react-native"
import React, {useState} from "react"
import ThemedText from "./text/ThemedText"
import colors from "@/constants/Colors"

interface Props {
    name: string,
    color: number,
    onSelect: ()=>void,
    isSelected: boolean
}

const SubjectTag: React.FC<Props> = ({name, color, onSelect, isSelected}) => {
    const styles = StyleSheet.create({
        container: {
            borderRadius: 8,
            borderWidth: isSelected ? 4 : 2,
            backgroundColor: colors.subjects[color].main,
            borderColor: colors.subjects[color].outline,
            paddingHorizontal: 8,
            paddingVertical: 4,
            marginRight: 12,
            marginBottom: 12
        }
    })
    
    return (
        <TouchableOpacity onPress={onSelect}>
            <View style={styles.container}>
                <ThemedText type="subtitle" style={{fontSize: 20}}>{name}</ThemedText>
            </View>
        </TouchableOpacity>
        
    )
}



export default SubjectTag;
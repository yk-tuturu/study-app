import React from "react"
import Modal from "react-native-modal"
import { View, ViewStyle, StyleProp, StyleSheet, TouchableWithoutFeedback, Keyboard } from "react-native"
import colors from "@/constants/Colors"

type Props = {
    children?: React.ReactNode,
    isVisible: boolean,
    onDismiss: ()=> void,
    style?: StyleProp<ViewStyle>,
    onModalHide?: ()=>void
}

const ThemedModal: React.FC<Props> = ({children, isVisible, onDismiss, style, onModalHide}) => {
    return (
        <Modal
            animationIn="fadeInUp"
            animationOut="fadeOutDown"
            backdropOpacity={0.5}
            isVisible={isVisible}
            avoidKeyboard={true}
            onBackButtonPress={onDismiss}
            onBackdropPress={onDismiss}
            onModalHide={onModalHide}
        >
        <View style={[styles.modalContent, style]}>
            {children}
        </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalContent: {
        borderColor: colors.accent,
        borderRadius: 16,
        borderWidth: 6,
        padding: 8,
        backgroundColor: colors.bg,
        
    }
})

export default ThemedModal;
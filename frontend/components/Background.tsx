import {View, StyleSheet, Image, Image as RNImage, Dimensions} from "react-native"
import React, {forwardRef, useEffect, useState} from "react"

type Props = {
  children?: React.ReactNode;
};

const { width, height } = Dimensions.get('window');

const Background = forwardRef<RNImage, Props>(({ children }, ref) => {
    return (
        <View style={styles.container}>
            <View style={styles.ground}></View>
            <Image
                source={require("../assets/images/window.png")}
                style={styles.window}
            />
            <Image
                source={require("../assets/images/rug.png")}
                style={styles.rug}
                ref={ref}
                resizeMode="contain"
            />
        </View>
    )
})

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#F0C0BF",
        flex: 1,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: -1,
        position: "absolute"
    },
    ground: {
        backgroundColor: "#F6E5CB",
        width: "100%",
        height: 700,
        position: "absolute",
        top: "75%"
    },
    rug: {
        width: Math.min(width * 1.6, 900),
        height: Math.min(width * 1.6, 900) * 334 / 1414,
        position: "absolute",
        bottom: "15%",
        alignSelf: "center"
    },
    window: {
        width: Math.min(width * 0.7, 500),
        height: Math.min(width * 0.7, 500) / 817 * 947,
        position: "absolute",
        top: "10%",
        left: "3%",
        opacity: 0.7
    }
})

export default Background;
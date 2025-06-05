import {View, Image, StyleSheet, Dimensions} from "react-native"
import React, {useEffect} from "react"
import Animated, { useSharedValue, withSequence, withTiming, withRepeat, useAnimatedStyle } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

type Props = {
    bottomPosition: number
}

const Cat: React.FC<Props> = ({bottomPosition}) => {
    const scaleY = useSharedValue(1.1);
    const TIME = 1500;

    const catHeight = Math.min(500, width * 0.5) / 264 * 235;

    const tweenCat = () => {
        console.log('starting tween')
        scaleY.value = withRepeat(withSequence(
            withTiming(1.02, {duration: TIME}),
            withTiming(0.95, {duration: TIME}),
        ), -1, true)
    }
    
      const animatedStyle = useAnimatedStyle(() => {
            const scale = scaleY.value;
            const translateY = (1 - scale) * catHeight / 2; // Adjust based on scaling

            return {
                transform: [
                    { translateY },
                    { scaleY: scale }
                ]
            };
      });

    useEffect(()=> {
        tweenCat();
    }, [])

    return (
        <Animated.Image
        source={require("../assets/images/cat-transparent.png")}
        style={[styles.cat, animatedStyle, {bottom: bottomPosition}]}
        />
    )
}

const styles = StyleSheet.create({
    cat: {
        width: Math.min(500, width * 0.6),
        height: Math.min(500, width * 0.6) / 264 * 235,
        position: 'absolute',
        alignSelf: "center",
        resizeMode: "cover"
    }
})

export default Cat;
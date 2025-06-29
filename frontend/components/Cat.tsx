import {View, StyleSheet, Dimensions} from "react-native"
import React, {useEffect} from "react"
import Animated, { useSharedValue, withSequence, withTiming, withRepeat, useAnimatedStyle } from 'react-native-reanimated';
import { Image } from "expo-image";

import SpriteMap from "@/constants/Sprites";

const { width, height } = Dimensions.get('window');

type Props = {
    bottomPosition: number,
    accessories: string[]
}

const Cat: React.FC<Props> = ({bottomPosition, accessories}) => {
    
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

    // starts the anim
    useEffect(()=> {
        tweenCat();
    }, [])

    return (
        <>
        <Animated.View style={[styles.cat, animatedStyle, {bottom: bottomPosition, zIndex: 0}]}>
            <Image
                style={StyleSheet.absoluteFill}
                source={require("../assets/images/cat.png")}
                contentFit="fill" // important
            />
        </Animated.View>
        {
            accessories.map((filename, index) => {
                return (
                    <Animated.View key={index} style={[styles.cat, animatedStyle, {bottom: bottomPosition, zIndex: 1}]}>
                        <Image
                            style={StyleSheet.absoluteFill}
                            source={SpriteMap[filename]}
                            contentFit="fill" // important
                        />
                    </Animated.View>
                )
            })
        }
        </>
    )
}

const styles = StyleSheet.create({
    cat: {
        width: Math.min(700, width * 0.7),
        height: Math.min(700, width * 0.7) / 264 * 235,
        position: 'absolute',
        alignSelf: "center",
        resizeMode: "cover"
    }
})

export default Cat;
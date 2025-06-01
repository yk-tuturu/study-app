import {View, Text, StyleSheet, StyleProp, ViewStyle} from "react-native";
import React, { ReactNode, Children, cloneElement, isValidElement, AnyActionArg } from "react";
import ThemedText from "./ThemedText";
interface Props {
    stroke: number,
    color: string,
    children?: any,
    style?: StyleProp<ViewStyle>
}

const TextOutline: React.FC<Props> = ({
    stroke,
    color,
    children,
    style
}) => {
    const createClones = (w: number, h: number, color?: string) => {
        return Children.map(children, child => {
        if (isValidElement(child)) {
            const currentProps = child.props as any;
            const currentStyle = currentProps ? (currentProps.style || {}) : {};

            const newProps = {
            ...currentProps,
            style: {
                ...currentStyle,
                textShadowOffset: {
                width: w,
                height: h
                },
                textShadowColor: color,
                textShadowRadius: 1
            }
            }
            return cloneElement(child, newProps)
        }
        return child;
        });
    }

    const top = createClones(0, -stroke * 1.2, color);
    const topLeft = createClones(-stroke, -stroke, color);
    const topRight = createClones(stroke, -stroke, color);
    const right = createClones(stroke, 0, color);
    const bottom = createClones(0, stroke, color);
    const bottomLeft = createClones(-stroke, stroke, color);
    const bottomRight = createClones(stroke, stroke, color);
    const left = createClones(-stroke * 1.2, 0, color);

    return (
        <View style={style}>
        <View style={{position: "absolute"}}>{top}</View>
        <View style={{position: "absolute"}}>{topLeft}</View>
        <View style={{position: "absolute"}}>{topRight}</View>
        <View style={{position: "absolute"}}>{left}</View>
        <View style={{position: "absolute"}}>{right}</View>
        <View style={{position: "absolute"}}>{bottomLeft}</View>
        <View style={{position: "absolute"}}>{bottomRight}</View>
        <View>{bottom}</View>
      </View>
    )
}

const styles = StyleSheet.create({
    outline: {
        position: "absolute"
    },
})

export default TextOutline;
import {View, StyleSheet, Image, TouchableOpacity, StyleProp, ViewStyle} from "react-native"
import React, {useState, useEffect, useRef} from "react"
import colors from "@/constants/Colors";

interface Props {
    children?: React.ReactNode;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
}


const CircularButton: React.FC<Props> = ({children, onPress=()=>{}, style}) => {
  const buttonRef = useRef<React.ComponentRef<typeof TouchableOpacity>>(null);
  const [dims, setDims] = useState({width: 0, height: 0})
  useEffect(() => {
    if (buttonRef.current) {
        buttonRef.current.measure((fx, fy, width, height, px, py)=> {
            console.log("circular")
            setDims({width: width, height: height})
        })
    }
  }, [buttonRef])

  return (
    <TouchableOpacity 
    style={[styles.button, 
        {borderRadius: Math.max(dims.width, dims.height) / 2},
        style]} 
    onPress={onPress} ref={buttonRef}>
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.primary,
        alignSelf: "flex-start",
        padding: 32,
        borderColor: colors.accent,
        borderWidth: 5
    }
})

export default CircularButton
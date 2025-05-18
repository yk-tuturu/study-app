import { Platform, StyleSheet, View, Dimensions, Text, ImageBackground, Image, Image as RNImage } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {Link} from "expo-router"

import {MenuOption, DropdownMenu} from '@/components/Dropdown';
import Background from "@/components/Background";
import IconButton from "@/components/IconButton";
import ThemedText from "@/components/ThemedText";

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [catPosition, setCatPosition] = useState(0);
  const rugRef = useRef<RNImage>(null)

  useEffect(() => {
      if (rugRef.current) {
        rugRef.current.measure((fx, fy, imageWidth, imageHeight, px, py) => {
          setCatPosition(height - py - imageHeight * 0.4)
        });
      }
    }, [rugRef]);

  return (
    <Background ref={rugRef}>
        <SafeAreaView style={styles.uiContainer}>
          <DropdownMenu
            visible={menuVisible}
            handleOpen={() => setMenuVisible(true)}
            handleClose={() => setMenuVisible(false)}
            trigger={
              <IconButton>
                <Image
                  source={require("../../assets/images/menu.png")}
                  style={{width: 32, height: 32}}
                />
              </IconButton>
            }
          >
            <MenuOption onSelect={() => {setMenuVisible(false)}}>
              <ThemedText type="font_sm">
                <Link href="/timer">Timer</Link>
              </ThemedText>
            </MenuOption>
            <MenuOption onSelect={() => {setMenuVisible(false);}}>
              <ThemedText type="font_sm">
                <Link href="/timer">Shop</Link>
              </ThemedText>
            </MenuOption>
          </DropdownMenu>
        </SafeAreaView>
        <Image
        source={require("../../assets/images/cat-transparent.png")}
        style={[styles.cat, {bottom: catPosition}]}
        />
    </Background>
  );
}

const styles = StyleSheet.create({
  cat: {
    width: Math.min(500, width * 0.7),
    height: Math.min(500, width * 0.7),
    position: 'absolute',
    alignSelf: "center"
  },
  uiContainer: {
    padding: 10
  }, 
  triggerStyle: {
    backgroundColor: "white",
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    width: 60,
    height: 60,
    alignSelf: "flex-end"
  },
  menuIcon: {
    width: 32,
    height: 32
  },
  triggerText: {
    fontSize: 16,
  }
});

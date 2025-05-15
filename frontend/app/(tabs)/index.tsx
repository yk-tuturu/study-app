import { Image } from 'expo-image';
import { Platform, StyleSheet, View, Dimensions, Text, ImageBackground } from 'react-native';
import React, { useState } from 'react';

import {MenuOption, DropdownMenu} from '@/components/Dropdown';
import { SafeAreaView } from 'react-native-safe-area-context';

import {Link} from "expo-router"


const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View>
      <ImageBackground
        source={require("../../assets/images/3000.png")}
        style={styles.background}
      >
        <SafeAreaView style={styles.uiContainer}>
          <DropdownMenu
          visible={menuVisible}
          handleOpen={() => setMenuVisible(true)}
          handleClose={() => setMenuVisible(false)}
          trigger={
            <View style={styles.triggerStyle}>
              <Image
                source={require("../../assets/images/menu.png")}
                style={styles.menuIcon}
              />
            </View>
          }
        >
          <MenuOption onSelect={() => {
            setMenuVisible(false);
          }}>
            <Link href="/timer">
              Timer
            </Link>
          </MenuOption>
          <MenuOption onSelect={() => {
            
            setMenuVisible(false);
          }}>
            <Link href="/shop">
              Shop
            </Link>
          </MenuOption>
        </DropdownMenu>
        </SafeAreaView>
        <Image
        source={require("../../assets/images/cat-transparent.png")}
        style={styles.cat}
        />
        
      </ImageBackground>
      
      
    </View>
  );
}

const styles = StyleSheet.create({
  cat: {
    width: 400,
    height: 400,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [
      { translateX: -200 }, // Half of width
      { translateY: -100}, // Half of height
    ],
  },
  background: {
    width: width,
    height: height,
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

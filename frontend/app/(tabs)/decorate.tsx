import { Platform, StyleSheet, View, Dimensions, Text, ImageBackground, Image, LayoutChangeEvent, TouchableOpacity} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {Link} from "expo-router"

import {MenuOption, DropdownMenu} from '@/components/general/Dropdown';
import Background from "@/components/Background";
import IconButtonStatic from "@/components/buttons/IconButtonStatic"
import ThemedText from "@/components/text/ThemedText";
import TimerDisplay from "@/components/TimerDisplay";
import Cat from '@/components/Cat';
import ThemedModal from '@/components/general/ThemedModal';
import colors from '@/constants/Colors';

import {useTimer} from "@/context/timerContext";
import { useAuth } from '@/context/authContext';
import { useRouter } from 'expo-router';
import TextButton from '@/components/buttons/TextButton';

import axios, { AxiosError } from 'axios';
import config from '@/config';
import { ParseError } from '@/util';
import AccessoryIcon from '@/components/AccessoryIcon';

const { width, height } = Dimensions.get('window');

type Accessory = {
  type: string,
  filename: string,
  equipped: boolean
}

export default function Decorate() {
  const [catPosition, setCatPosition] = useState(0);

  const [accessories, setAccessories] = useState<Accessory[]>([
    {
      type: "head",
      filename: "ribbon",
      equipped: false
    },
    {
      type: "body",
      filename: "suit",
      equipped: false
    }
  ])

  const [currentType, setCurrentType] = useState<string>("head");
  const types = ["Head", "Body"]

  const rugRef = useRef<Image>(null)

  const {token} = useAuth();
  
  const router = useRouter();

  const equipAccessory = (filename: string) => {
    setAccessories(prev => prev.map(acc=>acc.filename===filename ? {...acc, equipped: !acc.equipped} : acc));
  }
  
  const updateDisplayedType = (type: string) => {
    setCurrentType(type.toLowerCase());
  }

  const handleRugLayout = (event: LayoutChangeEvent) => {
    const { y, height: rugHeight } = event.nativeEvent.layout;
    setCatPosition(height - y - rugHeight * 0.5);
  };

  // calculates the cat position by finding the position of the rug, so that cat is always in the middle of the rug
  // useEffect(() => {
  //   if (rugRef.current) {
  //     rugRef.current.measure((fx, fy, imageWidth, imageHeight, px, py) => {
  //       setCatPosition(height - py - imageHeight * 0.5)
  //     });
  //   }
  // }, [rugRef.current]);

  return (
    <SafeAreaView style={styles.uiContainer}>
      <View style={styles.background}></View>
      <Image
        source={require("../../assets/images/rug.png")}
        style={styles.rug}
        ref={rugRef}
        onLayout={handleRugLayout}
        resizeMode="contain"
      />
      <Cat bottomPosition={catPosition} accessories={accessories.filter(a => a.equipped && a.filename !== undefined).map(a => a.filename as string)}/>
      <View style={styles.panel}>
        <View style={styles.sidebar}>
          {
            types.map((type, index) => {
              return (
                <TouchableOpacity key={index} onPress={() => updateDisplayedType(type)}>
                  <View style={styles.sidebarButton}>
                    <ThemedText type="font_sm">{type}</ThemedText>
                  </View>
                </TouchableOpacity>
                
              )
            })
          }
        </View>
        <View style={styles.accessoryList}>
          {
            accessories.filter(a=>a.type===currentType).map((acc, index) => {
              return (
                <AccessoryIcon
                  key={index}
                  filename={acc.filename}
                  onSelect={()=>equipAccessory(acc.filename)}
                  isSelected={acc.equipped}
                />
              )
            })
          }
        </View>
      </View>
      <TouchableOpacity onPress={()=>router.navigate("/(tabs)")}>
        <View style={styles.backButton}>
          <Image
            source={require("../../assets/images/back.png")}
            style={{width: 32, height: 32}}
          />
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#F0C0BF",
    zIndex: -1
  },
  uiContainer: {
    flex: 1
  },
  rug: {
    width: Math.min(width * 1.6, 900),
    height: Math.min(width * 1.6, 900) * 334 / 1414,
    position: "absolute",
    bottom: "55%",
    alignSelf: "center"
  },
  panel: {
    top: "52%",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#F6E5CB",
    position: "absolute",
    borderTopWidth: 3,
    borderColor: colors.accent_lighter,
    flexDirection: "row"
  },
  sidebar: {
    width: "25%",
    height: "100%",
    borderRightWidth: 3,
    borderRightColor: colors.accent_lighter
  },
  sidebarButton: {
    width: "100%",
    padding: 4,
    paddingTop: 12,
    paddingLeft: 6,
    borderBottomColor: colors.accent_lighter,
    borderBottomWidth: 3
  },
  accessoryList: {
    width: "75%",
    height: "100%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    alignItems: "flex-start"
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: "3%"

  }
});

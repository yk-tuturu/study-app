import { Platform, StyleSheet, View, Dimensions, Text, ImageBackground, Image, Image as RNImage } from 'react-native';
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

import {useTimer} from "@/context/timerContext";
import { useAuth } from '@/context/authContext';
import { useRouter } from 'expo-router';
import TextButton from '@/components/buttons/TextButton';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [catPosition, setCatPosition] = useState(0);
  const rugRef = useRef<RNImage>(null)

  const { remaining, isRunning, isEnded, endStats, getDuration, clearTimer, getCurrentSubject} = useTimer();

  const [showStatsModal, setShowStatsModal] = useState(false);

  const {logout} = useAuth();
  
  const router = useRouter();

  // calculates the cat position by finding the position of the rug, so that cat is always in the middle of the rug
  useEffect(() => {
    if (rugRef.current) {
      rugRef.current.measure((fx, fy, imageWidth, imageHeight, px, py) => {
        setCatPosition(height - py - imageHeight * 0.4)
      });
    }
  }, [rugRef]);

  useEffect(()=> {
    if (isRunning && isEnded) {
      setShowStatsModal(true);
    }
  }, [isEnded, isRunning])

  const dismissStatsModal = () => {
    clearTimer();
    setShowStatsModal(false);
  }

  const handleLogout = async() => {
    await logout();
    router.push("./login")
  }

  return (
    <SafeAreaView style={styles.uiContainer}>
      <Background ref={rugRef}/>
      {isRunning ? <TimerDisplay time={remaining} duration={getDuration()} style={styles.timerDisplay}/> : <></>}
      <DropdownMenu
        visible={menuVisible}
        handleOpen={() => setMenuVisible(true)}
        handleClose={() => setMenuVisible(false)}
        trigger={
          <IconButtonStatic>
            <Image
              source={require("../../assets/images/menu.png")}
              style={{width: 32, height: 32}}
            />
          </IconButtonStatic>
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
        <MenuOption onSelect={handleLogout}>
          <ThemedText type="font_sm">
            Logout
          </ThemedText>
        </MenuOption>
      </DropdownMenu>
      <Cat bottomPosition={catPosition}/>
      <ThemedModal
        isVisible={showStatsModal}
        onDismiss={dismissStatsModal}
        style={{marginHorizontal: 16}}
      > 
      <View style={{alignItems: "center", padding: 16}}>
        <ThemedText type="font_lg" style={{fontSize: 42}}>Finished Session</ThemedText>
        <View style={{alignItems: "center", marginBottom: 16}}>
          <ThemedText type="font_sm">Time spent: {endStats.currentTime} mins</ThemedText>
          <ThemedText type="font_sm">Time spent on {getCurrentSubject().name}: {endStats.totalTime} mins</ThemedText>
          <ThemedText type="font_sm">Coins earned: {Math.floor(endStats.currentTime / 5)}</ThemedText>
        </View>
        
        <TextButton onPress={dismissStatsModal}>
          <ThemedText type="font_md">Return</ThemedText>
        </TextButton>
      </View>
        
      </ThemedModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  uiContainer: {
    padding: 10,
    flex: 1
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
  timerDisplay: {
    position: "absolute",
    alignSelf: "center",
    top: "20%"
  }
});

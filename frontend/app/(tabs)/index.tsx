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

import axios, { AxiosError } from 'axios';
import config from '@/config';
import { ParseError } from '@/util';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [catPosition, setCatPosition] = useState(0);
  const [coins, setCoins] = useState(0);
  const rugRef = useRef<RNImage>(null)

  const { remaining, isRunning, isEnded, endStats, getDuration, clearTimer, getCurrentSubject} = useTimer();

  const [showStatsModal, setShowStatsModal] = useState(false);

  const {logout, token} = useAuth();
  
  const router = useRouter();

  // calculates the cat position by finding the position of the rug, so that cat is always in the middle of the rug
  useEffect(() => {
    if (rugRef.current) {
      rugRef.current.measure((fx, fy, imageWidth, imageHeight, px, py) => {
        setCatPosition(height - py - imageHeight * 0.5)
      });
    }
  }, [rugRef]);

  useEffect(()=> {
    if (isRunning && isEnded) {
      setShowStatsModal(true);
    }
  }, [isEnded, isRunning])

  useEffect(()=> {
    fetchCoins()
  }, [token, isRunning])

  const fetchCoins = async() => {
    try {
      const res = await axios.get(`${config.BACKEND_URL}/api/user/getInfo`, {
        headers: {
          Authorization: `Bearer: ${token}`
        }
      })

      setCoins(res.data.data.coins)
    } catch(err) {
      console.log(ParseError(err as AxiosError));
    }
    
  }

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
        <MenuOption onSelect={() => {
          router.push("/(tabs)/timer");
          setMenuVisible(false);
        }}>
          <View>
            <ThemedText type="font_sm">
            Timer
          </ThemedText>
          </View>
          
        </MenuOption>
        <MenuOption onSelect={() => {
          router.push("/(tabs)/shop");
          setMenuVisible(false);}}>
          <ThemedText type="font_sm">
            Shop
          </ThemedText>
        </MenuOption>
        <MenuOption onSelect={handleLogout}>
          <ThemedText type="font_sm">
            Logout
          </ThemedText>
        </MenuOption>
      </DropdownMenu>

      <Cat bottomPosition={catPosition}/>

      <View style={styles.coinPanel}>
          <Image
            source={require("../../assets/images/coin.png")}
            style={{width: 32, height: 32, marginRight: 8}}
          />
          <ThemedText type="font_md">{coins}</ThemedText>
      </View>
      <ThemedModal
        isVisible={showStatsModal}
        onDismiss={dismissStatsModal}
        style={{marginHorizontal: 16}}
      > 
      <View style={{alignItems: "center", padding: 16}}>
        <ThemedText type="font_lg" style={{fontSize: 42}}>Finished Session</ThemedText>
        <View style={{alignItems: "center", marginBottom: 16}}>
          <ThemedText type="font_sm">Time spent: {endStats.currentTime} mins</ThemedText>
          <ThemedText type="font_sm">Time spent on {getCurrentSubject().name}:</ThemedText>
          <ThemedText type="font_sm">{endStats.totalTime} mins</ThemedText>
          <ThemedText type="font_sm">Coins earned: {endStats.coinAmount}</ThemedText>
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
  },
  coinPanel: {
    position: "absolute",
    bottom: 30,
    left: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  }
});

import { Platform, StyleSheet, View, Dimensions, Text, ImageBackground, LayoutChangeEvent, TouchableOpacity} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {Link} from "expo-router"
import { Image } from 'expo-image';

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

// type Accessory = {
//   type: string,
//   filename: string,
//   equipped: boolean
// }

const ACCESSORY_TYPES = ["head", "body"] as const;

type AccessoryType = typeof ACCESSORY_TYPES[number];

type Accessory = {
  filename: string;
  type: AccessoryType;
};

type EquippedAccessories = {
  [key in AccessoryType]?: Accessory; // Optional per slot
};

type APIData = {
  name: string, 
  type: string,
  description: string,
  price: number
}

export default function Decorate() {
  const [catPosition, setCatPosition] = useState(0);

  const [accessories, setAccessories] = useState<Accessory[]>([])
  const [equipped, setEquipped] = useState<EquippedAccessories>({
    head: undefined,
    body: undefined
  })

  const [currentType, setCurrentType] = useState<AccessoryType>("head");

  const rugRef = useRef<Image>(null)

  const {token} = useAuth();
  
  const router = useRouter();

  useEffect(()=> {
    fetchData();
  }, [])

  const fetchData = async() => {
    try {
      const res = await axios.get(`${config.BACKEND_URL}/api/item/listAll`, {headers: {Authorization: `Bearer: ${token}`}})
      const data = res.data.data; 

      setAccessories(data.map((acc: APIData)=>{
        return {
          type: acc.type,
          filename: acc.name,
          // equipped: false 
        }
      }))
    } catch(err) {
      console.log(err)
      console.log(ParseError(err as AxiosError))
    }
  }

  const toggleEquipped = (item: Accessory) => {
    if (equipped[item.type]?.filename === item.filename) {
      setEquipped((prev)=>({
        ...prev,
        [item.type]: undefined
      }))
    } else {
        setEquipped((prev)=>({
        ...prev,
        [item.type]: item
      }))
    }
  }
  
  const updateDisplayedType = (type: AccessoryType) => {
    setCurrentType(type);
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
      <Cat bottomPosition={catPosition} accessories={Object.values(equipped).filter(
        (item): item is Accessory => item !== undefined
      ).map(a => a.filename)}/>
      <View style={styles.panel}>
        <View style={styles.sidebar}>
          {
            ACCESSORY_TYPES.map((type, index) => {
              return (
                <TouchableOpacity key={index} onPress={() => updateDisplayedType(type)}>
                  <View style={styles.sidebarButton}>
                    <ThemedText type="font_sm">{type.charAt(0).toUpperCase() + type.slice(1)}</ThemedText>
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
                  onSelect={()=>toggleEquipped(acc)}
                  isSelected={equipped[acc.type]?.filename === acc.filename}
                />
              )
            })
          }
        </View>
      </View>
      <TouchableOpacity onPress={()=>router.push("/(tabs)")}>
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

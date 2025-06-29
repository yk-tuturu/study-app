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

type Accessory = {
  _id: string; 
  type: string;
  imageFile: string;
  equipped: boolean;
};

export default function Decorate() {
  const [catPosition, setCatPosition] = useState(0);
  const [accessories, setAccessories] = useState<Accessory[]>([])
  const [accessoriesWorn, setAccessoriesWorn] = useState({})
  const [currentType, setCurrentType] = useState<string>("head");
  const types = ["Head", "Body"]
  const rugRef = useRef<Image>(null)
  const {token} = useAuth();
  const router = useRouter();

  // fetch accessories owned by the user
  const fetchAccessories = async () => {
    try {
      const res = await axios.get(`${config.BACKEND_URL}/api/user/ownedAccessories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAccessories(res.data.data);
    } catch (err) {
      console.log("error fetching owned accessories");
    }
  };
  
  // fetch accessories user's cat is currently wearing 
  const fetchAccessoriesWorn = async () => {
    try {
      const res = await axios.get(`${config.BACKEND_URL}/api/user/accessories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAccessoriesWorn(res.data.data); 
    } catch (err) {
      console.log("error fetching accessories currently being worn");
    }
  };

  useEffect(() => {
    fetchAccessories();
  }, [token]);

  useEffect(() => {
    fetchAccessoriesWorn();
  }, [token]);

// if accessory is currently worn - uses takeOff endpoint
// if accessory is not being worn - uses wear endpoint 
const toggleAccessory = async (itemId: string, isSelected: boolean) => {
  try {
    const endpoint = isSelected ? "takeOff" : "wear";
    await axios.post(`${config.BACKEND_URL}/api/item/${endpoint}`, { 
      itemId: itemId 
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    await fetchAccessoriesWorn();
  } catch (err) {
    console.error("Failed to sync accessory with backend", err);
  }
};

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
      <Cat bottomPosition={catPosition} accessories={Object.values(accessoriesWorn).filter(a => a !== null).map(a => a.imageFile as string)}/>
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
          accessories
            .filter(a => a.type.toLowerCase() === currentType)
            .map((acc, index) => {
              const isSelected = accessoriesWorn?.[acc.type]?.imageFile === acc.imageFile;

              return (
                <AccessoryIcon
                  key={index}
                  imageFile={acc.imageFile}
                  onSelect={() => toggleAccessory(acc._id, isSelected)}
                  isSelected={isSelected}
                />
              );
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

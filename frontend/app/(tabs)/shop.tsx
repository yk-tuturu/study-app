import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import config from "@/config";
import { useAuth } from "@/context/authContext";
import ThemedText from "@/components/text/ThemedText";
import ThemedModal from "@/components/general/ThemedModal";
import TextButton from "@/components/buttons/TextButton";
import IconMap from "@/constants/Icons";
import { useRouter } from "expo-router";
import axios, {Axios, AxiosError} from "axios";
import { ParseError } from "@/util";

import colors from "@/constants/Colors";

const Shop = () => {
  const { token } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("")
  const [accessories, setAccessories] = useState([]);
  const [coins, setCoins] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("head");
  const [selectedItem, setSelectedItem] = useState(null); 
  const [showConfirm, setShowConfirm] = useState(false); 
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [ownedAccessories, setOwnedAccessories] = useState([])

  const buyAccessory = async () => {
    if (!selectedItem) {
      setFeedbackMessage("Please select an item to purchase");
      setShowFeedback(true);
      return;
    }

    try {
      await axios.post(`${config.BACKEND_URL}/api/item/buy`, {
        itemId: selectedItem._id,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }); 

      await fetchAccessories();
      await fetchOwnedAccessories(); 
      await fetchCoins();
      setShowConfirm(false);
      setSelectedItem(null);
      setFeedbackMessage("Purchase made successfully!");
      setShowFeedback(true);
    } catch (err) {
      const parsedError = ParseError(err as AxiosError);
      setFeedbackMessage(parsedError || "Something went wrong.");
      setShowFeedback(true);
      console.log(parsedError);
    }
  };

  const fetchCoins = async () => {
    try {
      const res = await axios.get(`${config.BACKEND_URL}/api/user/getInfo`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCoins(res.data.data.coins);
    } catch (err) {
      console.log("error fetching coins");
    }
  };

  const fetchAccessories = async () => {
    try {
      const res = await axios.get(`${config.BACKEND_URL}/api/item/listAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAccessories(res.data.data);
    } catch (err) {
      console.log("Error fetching accessories:", err);
    }
  }; 

  const fetchOwnedAccessories = async () => {
    try {
      const res = await axios.get(`${config.BACKEND_URL}/api/user/ownedAccessories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOwnedAccessories(res.data.data);
    } catch (err) {
      console.log("Error fetching accessories:", err);
    }
  }; 

  useEffect(() => {
    fetchAccessories();
    fetchOwnedAccessories(); 
  }, [token]);

  useEffect(() => {
    fetchCoins();
  }, [token]);

  return (
    <SafeAreaView style={styles.uiContainer}>
      <View style={styles.background}></View>
      <TouchableOpacity onPress={() => router.push("./")}>
        <Image
          source={require("../../assets/images/close.png")}
          style={styles.closeButton}
        />
      </TouchableOpacity>
      <View style={styles.coinPanel}>
        <Image
          source={require("../../assets/images/coin.png")}
          style={{ width: 32, height: 32, marginRight: 8 }}
        />
        <ThemedText type="font_md">{coins}</ThemedText>
      </View>
      <ThemedText type="font_md" style={styles.header}>
        Shop
      </ThemedText>
      
      <View style={styles.containers}>
      <View style={styles.categoryContainer}>
      {["head", "body", "skin", "room"].map((category) => (
        <TouchableOpacity
          key={category}
          style={[
            styles.categoryButton,
            selectedCategory === category && styles.categoryButtonSelected,
          ]}
          onPress={() => setSelectedCategory(category)}
          >
        <ThemedText type="font_md"
          style={[
            styles.categoryText,
            selectedCategory === category && styles.categoryTextSelected,
          ]}
        >
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </ThemedText>
    </TouchableOpacity>
  ))}
</View>
  <ScrollView contentContainerStyle={styles.itemContainer}>
    {accessories
      .filter((acc) => acc.type === selectedCategory)
      .filter((acc) => !ownedAccessories.some((owned) => owned._id === acc._id))
      .map((acc) => (
        <TouchableOpacity
          key={acc._id}
          style={styles.itemCard}
          onPress={() => {
            setSelectedItem(acc);
            setShowConfirm(true);
          }}
        >
          <Image
            source={IconMap[acc.imageFile]}
            style={styles.itemImage}
          />
          <View style={styles.priceDisplay}>
          <Image
            source={require("../../assets/images/coin.png")}
            style={{ width: 16, height: 16}}
          />
          <Text style={styles.itemPrice}>  {acc.price}</Text>
          </View>
        </TouchableOpacity>
      ))}
      {selectedItem && (
      <ThemedModal
        isVisible={showConfirm}
        style={{ marginHorizontal: 16 }}
      >
        <View style={{ alignItems: "center", padding: 16 }}>
          <ThemedText type="font_md">Confirm Purchase?</ThemedText>
          <Image
            source={IconMap[selectedItem.imageFile]}
            style={styles.itemImageModal}
          />
          <View style={styles.priceDisplay}>
            <Image
              source={require("../../assets/images/coin.png")}
              style={{ width: 16, height: 16 }}
            />
            <Text style={styles.itemPriceModal}>  {selectedItem.price}</Text>
          </View>
          <View style={styles.modalButtons}>
            <TextButton style={styles.yesButton}>
              <ThemedText type="font_md" onPress={buyAccessory}>Yes</ThemedText>
            </TextButton>
            <TextButton style={styles.noButton} onPress={() => { setShowConfirm(false); }}>
              <ThemedText type="font_md">No</ThemedText>
            </TextButton>
          </View>
        </View>
      </ThemedModal>
    )}
  </ScrollView>
  {showFeedback && (
    <ThemedModal 
    isVisible={showFeedback} 
    style={{ marginHorizontal: 16 }}
    >
      <View style={{ padding: 16, alignItems: "center" }}>
        <ThemedText type="font_md" style={{ marginBottom: 16, textAlign: "center" }}>
          {feedbackMessage}
        </ThemedText>
        <TextButton onPress={() => setShowFeedback(false)}>
          <ThemedText type="font_md">Return</ThemedText>
        </TextButton>
      </View>
    </ThemedModal>
  )}
</View>
    </SafeAreaView>
  );
};

export default Shop;

const styles = StyleSheet.create({
  uiContainer: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  background: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.bg,
    zIndex: -1
  },
  containers:{
    flexDirection: 'row',
    flex: 1,
    paddingHorizontal: 12,
    paddingBottom: 12,          
  }, 
  card: {
    flexDirection: "row",
    marginVertical: 8,
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  categoryContainer: {
    flexDirection: "column",
    justifyContent: 'flex-start', 
    backgroundColor: "#F6E5CB", 
    paddingVertical: 20, 
    width: "auto",
  },
  categoryButton: {
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: colors.primary,
    marginBottom: 12,
    marginLeft: 12, 
    marginRight: 12, 
    alignItems: "center", 
    alignSelf: 'flex-start'
  },
  categoryButtonSelected: {
    backgroundColor: colors.accent,
  },
  categoryText: {
    fontSize: 20,
    color: colors.accent, 
  },
  categoryTextSelected: {
    fontWeight: "bold",
    color: colors.primary, 
  },
  itemContainer: {
    flexGrow: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#F6E5CB", 
    marginLeft: 12, 
    marginRight: 12, 
    gap: 12,
  }, 
  image: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 12,
  },
  closeButton: {
    top: 8, 
    width: 20,
    height: 20,
    marginBottom: 32,
    marginTop: 10,
  },
  header: {
    textAlign: "center",
    marginBottom: 16,
  },
  coinPanel: {
    position: 'absolute',
    top: 8,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  itemCard: {
    width: 80,
    height: 100,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    margin: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  itemImage: {
    width: 48,
    height: 48,
    marginBottom: 6,
  },
  itemPrice: {
    fontSize: 14,
    fontFamily: "font_md",
    color: colors.accent,
    fontWeight: "bold", 
  },
  itemPriceModal: {
    fontSize: 20,
    fontFamily: "font_md",
    color: colors.accent,
    fontWeight: "bold", 
  },
  itemImageModal: {
    width: 80,
    height: 80,
    marginBottom: 6,
  },
  priceDisplay: {
    flexDirection: "row"
  }, 
  modalButtons:{
    marginTop: 12, 
    flexDirection: "row"
  }, 
  yesButton:{
    marginRight: 12, 
  }, 
  noButton:{
    marginRight: 12, 
  }
});
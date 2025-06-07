import { Tabs, Slot } from 'expo-router';
import React, {useEffect} from 'react';
import { Platform, View, StyleSheet, ActivityIndicator} from 'react-native';
import {Redirect, Stack} from 'expo-router'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/template/HapticTab';
import { IconSymbol } from '@/components/template/ui/IconSymbol';
import TabBarBackground from '@/components/template/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';
import {useAuth} from "@/context/authContext"
import { useRouter } from 'expo-router';
import { TimerProvider } from '@/context/timerContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const {loading, isLoggedIn} = useAuth();

  const router = useRouter()

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.replace('/login');
    }
  }, [loading, isLoggedIn]);

  if (loading || !isLoggedIn) {
    return (
      <SafeAreaView>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    // <Tabs
    //   screenOptions={{
    //     tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
    //     headerShown: false,
    //     tabBarButton: HapticTab,
    //     tabBarBackground: TabBarBackground,
    //     tabBarStyle: Platform.select({
    //       ios: {
    //         // Use a transparent background on iOS to show the blur effect
    //         position: 'absolute',
    //       },
    //       default: {},
    //     }),
    //   }}>
    //   <Tabs.Screen
    //     name="index"
    //     options={{
    //       title: 'Home',
    //       tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
    //     }}
    //   />
    //   <Tabs.Screen
    //     name="explore"
    //     options={{
    //       title: 'Explore',
    //       tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
    //     }}
    //   />
    // </Tabs>
    <TimerProvider>
      <Stack>
        <Stack.Screen name="index" options={{headerShown: false}} />
        <Stack.Screen name="timer" options={{headerShown: false}} />
        <Stack.Screen name="shop" options={{headerShown: false}} />
        <Stack.Screen name="decorate" options={{headerShown: false}} />
      </Stack>
    </TimerProvider>
      
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensures the container takes up full screen
  },
});

import React from "react";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { initializeApp, getApps } from "firebase/app";

import { useColorScheme } from "@/hooks/useColorScheme";

const firebaseConfig = {
  apiKey: "AIzaSyDqStRiWoR5-EH8viVjo-nB__6UDdFw9XE",
  authDomain: "blackpooltours-64293.firebaseapp.com",  // Default format: "projectId.firebaseapp.com"
  projectId: "blackpooltours-64293",
  storageBucket: "blackpooltours-64293.appspot.com",   // Default format: "projectId.appspot.com"
  messagingSenderId: "451015266080",  // Your project number usually matches this
  appId: "1:451015266080:android:8306f5606842733c151145",
};


// Ensure Firebase is initialized
if (getApps().length === 0) {
  initializeApp(firebaseConfig);
  console.log("Firebase initialized!");
} else {
  console.log("Firebase already initialized!");
}

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }

    const checkAuth = async () => {
      const user = false; // Replace with actual auth check later
      setIsLoggedIn(user);
      setAuthChecked(true);

      if (!user) {
        router.replace("/login");
      }
    };

    checkAuth();
  }, [loaded]);

  if (!loaded || !authChecked) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack initialRouteName="login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
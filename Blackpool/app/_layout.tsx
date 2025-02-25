import React, { createContext, useState, useEffect } from "react";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";
import { useColorScheme } from "@/hooks/useColorScheme";
import { getDocs } from "firebase/firestore";

//Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDqStRiWoR5-EH8viVjo-nB__6UDdFw9XE",
  authDomain: "blackpooltours-64293.firebaseapp.com",
  projectId: "blackpooltours-64293",
  storageBucket: "blackpooltours-64293.appspot.com",
  messagingSenderId: "451015266080",
  appId: "1:451015266080:android:8306f5606842733c151145",
};

//Firestone Config
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);

export const getBookedToursCollection = () => collection(db, "BookedTours");

const fetchBookedTours = async () => {
  try {
    const querySnapshot = await getDocs(getBookedToursCollection());
    console.log("Booked Tours:", querySnapshot);
  } catch (error) {
    console.error(error);
  }
};

fetchBookedTours();


export const UserContext = createContext(null);

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const router = useRouter();
  const [activeUser, setActiveUser] = useState(null);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }

    //Authenticate Users
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setActiveUser(user.uid);
        console.log("User is signed in:", user.uid);
      } else {
        console.log("No user signed in");
        router.replace("/login");
      }
    });

    return () => unsubscribe(); // Cleanup function
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <UserContext.Provider value={activeUser}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack initialRouteName="login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="login" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </UserContext.Provider>
  );
}

import { Stack, Slot } from "expo-router";
import { useFonts } from "expo-font";
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import "@/global.css";
import SafeScreen from "@/src/components/SafeScreen";
import { ClerkProvider } from '@clerk/clerk-expo'
import { StatusBar } from "expo-status-bar";


export default function RootLayout() {
  const [loaded, error] = useFonts({
    poppins: require("@/src/assets/fonts/Poppins-Regular.ttf"),
  });
  return (
    <ClerkProvider>
      <SafeScreen>
        <Slot />
      </SafeScreen>
      <StatusBar style="dark" />
      </ClerkProvider>
  );
}

import type { JSX } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { HeroUINativeProvider } from "heroui-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PortfolioProvider } from "@/lib/portfolio-context";

import "../global.css";

export default function RootLayout(): JSX.Element {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HeroUINativeProvider>
        <PortfolioProvider>
          <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          </Stack>
          <StatusBar style="auto" />
        </PortfolioProvider>
      </HeroUINativeProvider>
    </GestureHandlerRootView>
  );
}

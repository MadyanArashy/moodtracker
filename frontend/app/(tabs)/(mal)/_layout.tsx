import { Stack } from "expo-router";

export default function MyAnimeLayout() {
 return (
 <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="index"/>
    <Stack.Screen name="anime"/>
  </Stack>
 )
}
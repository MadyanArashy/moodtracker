import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { Platform } from 'react-native';
import { Colors } from '@/constants/Colors'; // assuming you use a color palette
import { useColorScheme } from '@/hooks/useColorScheme';

export default function MarvelLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='allSeries'/>
        <Stack.Screen name='series' options={{ headerShown: true }}/>
        <Stack.Screen name='comic'/>
      </Stack>
    </ThemeProvider>
  );
}

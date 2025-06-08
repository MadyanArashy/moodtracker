import React, { ReactNode } from 'react';
import { Text, View, Image, ViewStyle, StyleProp, TextStyle } from 'react-native';
import { useRouter } from 'expo-router';
import tw from 'twrnc';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

type HeaderProps = {
  title: string,
  subtitle: string,
  style?: StyleProp<ViewStyle>,
  titleStyle?: StyleProp<TextStyle>,
  subtitleStyle?: StyleProp<TextStyle>,
  children?: ReactNode
}

const HeaderView = ({title, subtitle, style, children, titleStyle, subtitleStyle, ...otherProps}: HeaderProps) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const navigation = useRouter();
  return (
    <ThemedView style={[tw`pt-8 w-full px-4 flex-col items-start pb-2`, style]} {...otherProps}>
      <View style={tw`flex-row gap-2 items-end`}>
        <ThemedText style={tw`text-3xl font-bold p-2 -m-2`} onPress={() => navigation.back()}>&#x3c;</ThemedText>
        <ThemedText style={[titleStyle]}>
          {title}
        </ThemedText>
      </View>
      <ThemedText style={[subtitleStyle]}>{subtitle}</ThemedText>
      {children}
    </ThemedView>
  );
};

export default HeaderView;

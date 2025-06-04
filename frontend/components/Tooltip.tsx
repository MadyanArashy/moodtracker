import React, { useState } from 'react';
import { Text, View, Image } from 'react-native';
import tw from 'twrnc';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import AnimatedButton from './AnimatedButton';

const Tooltip = ({ visible = false, editFunction, deleteFunction, close }:
  {
    visible: boolean,
    editFunction: () => void,
    deleteFunction: () => void,
    close: () => void
  }
) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  if (!visible) return null;

  return (
    <ThemedView
      style={[
        tw`absolute px-4 py-2 rounded shadow shadow-lg w-25 flex-row items-center gap-2 z-200 justify-center`,
        {
          backgroundColor: colors.gray1,
          top: -30, // Adjust this based on height of button
          left: 10, // Optional: horizontal offset
          zIndex: 10,
        },
      ]}
    >
      <AnimatedButton onPress={editFunction} animationType='opacity'>
        <Text style={tw`text-blue-500`}>Edit</Text>
      </AnimatedButton>
      <AnimatedButton onPress={deleteFunction} animationType='opacity'>
        <Text style={tw`text-red-500`}>Delete</Text>
      </AnimatedButton>
      <AnimatedButton onPress={close} animationType='opacity'>
        <Text style={{ color: colors.icon }}>X</Text>
      </AnimatedButton>
    </ThemedView>
  );
};


export default Tooltip;

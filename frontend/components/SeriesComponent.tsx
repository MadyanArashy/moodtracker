import React from 'react';
import { View, Image } from 'react-native';
import tw from 'twrnc';

import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Series } from '@/types/marvelSeries';
import { ThemedText } from './ThemedText';

const IMAGE_WIDTH = 180;
const IMAGE_HEIGHT = 270;

const SeriesComponent = ({ item }: { item: Series }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const thumbnailUrl = `${item.thumbnail.path}.${item.thumbnail.extension}`;

  return (
    <View style={[tw`w-1/2 px-4 py-2`, { height: 360 }]} key={item.id}>
      {item.thumbnail && (
        <Image
          source={{ uri: thumbnailUrl }}
          style={{
            width: IMAGE_WIDTH,
            height: IMAGE_HEIGHT,
            borderRadius: 4,
            alignSelf: 'center',
          }}
          resizeMode="cover"
        />
      )}
      <ThemedText
        numberOfLines={1}
        style={[tw`text-sm mt-1`, { color: colors.disabledText }]}
      >
        Comics: {item.comics.returned}
      </ThemedText>
      <ThemedText
        numberOfLines={2}
        ellipsizeMode="tail"
        style={tw`font-semibold`}
      >
        {item.title}
      </ThemedText>
    </View>
  );
};

// Memo with custom comparison to prevent re-renders on same ID
function areEqual(prev: { item: Series }, next: { item: Series }) {
  return prev.item.id === next.item.id;
}

export default React.memo(SeriesComponent, areEqual);

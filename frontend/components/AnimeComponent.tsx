import React from 'react';
import { View, Image, ImageBackground, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import tw from 'twrnc';

import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { ThemedText } from './ThemedText';
import { Anime } from '@/types/anime';

const AnimeComponent = ({ item }: { item: Anime }) => {
  const navigation = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-GB', {
      month: 'short',
      year: 'numeric',
    });
  };

  const start = formatDate(item.start_date);
  const end = formatDate(item.end_date);

  return (
    <Pressable style={[tw`w-1/2 p-1`]} key={item.id}
      onPress={() =>
        navigation.push(`/anime?id=${encodeURIComponent(item.id)}`)
      }>
      {item.main_picture?.medium && (
        <ImageBackground
          source={{ uri: item.main_picture.medium }}
          style={{
            width: '100%',
            height: 240,
            borderRadius: 4,
            alignSelf: 'center',
          }}
          resizeMode="cover"
        >
          <View style={tw`absolute bottom-0 w-full left-0`}>
            { item.rank &&
            <View style={tw`flex-row`}>
              <ThemedText style={[tw`text-xs text-white px-1 py-0.5`, {backgroundColor: colors.tint}]}>
                {item.rank}
              </ThemedText>
            </View>
            }
            <View style={tw`bg-black bg-opacity-50 w-full p-1`}>
              <ThemedText numberOfLines={1} ellipsizeMode="tail" style={tw`font-semibold text-white text-sm`}>
                {item.title}
              </ThemedText>
              {(start || end) && (
                <ThemedText style={[tw`text-xs mt-1 text-gray-300`]}>
                  {start} – {end ? end : ''}
                </ThemedText>
              )}
            </View>
          </View>
        </ImageBackground>
      )}

    </Pressable>
  );
};

function areEqual(prev: { item: Anime }, next: { item: Anime }) {
  return prev.item.id === next.item.id;
}

export default React.memo(AnimeComponent, areEqual);

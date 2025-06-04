import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import tw from 'twrnc';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import AnimatedButton from './AnimatedButton';
import { ArticleItem } from '@/types/article';

const ArticleComponent = ({ item }: { item: ArticleItem }) => {
  const navigation = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <AnimatedButton
      onPress={() =>
        navigation.push(`/articleDetail?articleParams=${encodeURIComponent(JSON.stringify(item))}`)
      }
    >
      <View style={[tw`flex-col w-full mx-auto shadow mb-2 rounded-xl pb-4`, {backgroundColor: colors.gray2}]}>
        <View style={tw`flex-col gap-2`}>
          <Image source={{ uri: item.urlToImage }} style={tw`w-full h-50 rounded-t-xl`} />
          <View style={tw`px-4 gap-1`}>
            <ThemedText style={tw`font-bold mb-1`}>{item.title || 'loading title...'}</ThemedText>
            <ThemedText style={{ color: colors.icon }}>
              <Text style={tw`font-bold text-sm`}>Author:</Text> {item.author}
            </ThemedText>
            <ThemedText style={{ color: colors.icon }}>
              <Text style={tw`font-bold text-sm`}>Source:</Text> {item.source.name}
            </ThemedText>
            <ThemedText style={{ color: colors.icon }}>
              <Text style={tw`font-bold text-sm`}>Published:</Text>{' '}
              {new Date(item.publishedAt).toLocaleString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </ThemedText>
          </View>
        </View>
      </View>
    </AnimatedButton>
  );
};

export default React.memo(ArticleComponent);
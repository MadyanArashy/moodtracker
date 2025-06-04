import React from 'react';
import { Text, View, Image, ScrollView, Dimensions, Linking } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import tw from 'twrnc';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { AntDesign, FontAwesome, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

type ArticleItem = {
  source: {
    id: string;
    name: string;
  };
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
};

export default function ArticleDetail() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const screenWidth = Dimensions.get('window').width;

  const params = useLocalSearchParams();
  const article: ArticleItem | null = params.articleParams
    ? JSON.parse(decodeURIComponent(params.articleParams.toString()))
    : null;

  if (!article) {
    return (
      <ThemedView style={tw`flex-1 justify-center items-center`}>
        <ThemedText>Article not found.</ThemedText>
      </ThemedView>
    );
  }
  
  let cleanedDescription = article.description?.split(' [+')[0] ?? '';
  cleanedDescription = cleanedDescription.replace(/[\r\n]+/g, ' ');

  let cleanedContent = article.content?.split(' [+')[0] ?? '';
  const uniqueLines = [...new Set(cleanedContent.split(/\r\n/))];
  cleanedContent = uniqueLines.join('\r\n');
  cleanedContent = cleanedContent.replace('\n', '');


  return (
    <ThemedView darkColor="#151515" lightColor="white" style={tw`flex-1`}>
      <SafeAreaView style={tw`flex-1`}>
        <ScrollView contentContainerStyle={[tw`flex-1 mx-auto px-4`, {width: screenWidth}]}>
          <Image
            source={{ uri: article.urlToImage }}
            style={tw`h-64 rounded-lg mb-4 w-full`}
            resizeMode="cover"
          />
          <ThemedText style={tw`text-xl font-bold mb-2`}>
            {article.title}
          </ThemedText>
          <ThemedText style={tw`text-justify`}>
            {'   '}{cleanedDescription}{'\n'}
            {'   '}{cleanedContent}
            <Text
              style={{ color: colors.tint }}
              onPress={() => Linking.openURL(article.url)}
            >
              Read more
            </Text>
          </ThemedText>
          <View style={tw`flex-col items-start mt-4 gap-1`}>
            <ThemedText style={{ color: colors.icon }}>
              <FontAwesome name='user-circle' size={18} /> <Text style={tw`font-bold`}>Author: </Text>{article.author}
            </ThemedText>
            <ThemedText style={{ color: colors.icon }}>
              <AntDesign name='earth' size={18}/> <Text style={tw`font-bold`}>Source: </Text>{article.source.name}
            </ThemedText>
            <ThemedText style={{ color: colors.icon }}>
              <AntDesign name='calendar' size={18}/> <Text style={tw`font-bold`}>Published: </Text>
               {new Date(article.publishedAt).toLocaleString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
            </ThemedText>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

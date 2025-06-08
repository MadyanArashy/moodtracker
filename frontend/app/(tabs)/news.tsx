import React, { useEffect, useState } from 'react';
import { Text, View, Image, ScrollView, FlatList, ActivityIndicator, Linking, Pressable } from 'react-native';
import tw from 'twrnc';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Environment } from '@/constants/Environment';
import axios from 'axios';
import AnimatedButton from '@/components/AnimatedButton';
import { useRouter } from 'expo-router';
import ArticleComponent from '@/components/ArticleComponent';
import { ArticleItem, Article } from '@/types/article';

export default function News() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const API_KEY = Environment.NEWS_API_KEY;
  const [refreshing, setRefreshing] = useState(false);
  
  const [articleData, setArticleData] = useState<Article | null>(null);
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 10;

  useEffect(() => {
    getArticles(1);
  }, []);

  const getArticles = async (pageNumber: number) => {
  try {
    if (pageNumber === 1) setIsLoaded(false);
    else setIsLoadingMore(true);

    const response = await axios.get<Article>(
      'https://newsapi.org/v2/everything', {
        params: {
          q: 'anime',
          sortBy: 'relevancy',
          page: pageNumber,
          pageSize: pageSize,
        },
        headers: {
          'X-Api-Key': API_KEY
        }
      }
    );

    if (pageNumber === 1) setArticles(response.data.articles);
    else setArticles(prev => [...prev, ...response.data.articles]);
    

    setArticleData(response.data);
    setPage(pageNumber);

    // Calculate max pages with a max limit of 100 articles due to API
    const maxPages = Math.ceil(Math.min(response.data.totalResults, 100) / pageSize);
    setHasMore(pageNumber < maxPages);

  } catch (err) {
    console.error(err);
  } finally {
    setIsLoaded(true);
    setIsLoadingMore(false);
  }
  };
  
  const refreshFunction = async () => {
    setRefreshing(true);
    await getArticles(1);
    setRefreshing(false);
  };

  const loadMore = () => {
    if (hasMore && !isLoadingMore) {
      getArticles(page + 1);
    }
  };

  return (
    <ThemedView style={tw`flex-1 px-4`}>
      <SafeAreaView style={tw`flex-1`}>
        <ThemedText style={tw`font-bold text-3xl`}>Articles</ThemedText>
        {articleData && (
          <ThemedText style={tw`text-lg`}>
            Found {articleData.totalResults} articles
          </ThemedText>
        )}

        {isLoaded ? (
          <FlatList
            data={articles}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
             <ArticleComponent item={item}/>
            )}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isLoadingMore ? <ActivityIndicator size="small" style={tw`my-4`} /> : null
            }
            refreshing={refreshing}
            onRefresh={refreshFunction}
            initialNumToRender={5}
            maxToRenderPerBatch={pageSize}
            windowSize={5}

          />
        ) : (
          <ActivityIndicator size={"large"} />
        )}
      </SafeAreaView>
    </ThemedView>
  );
};

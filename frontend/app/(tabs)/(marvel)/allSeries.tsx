import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, Image, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import tw from 'twrnc';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Environment } from '@/constants/Environment';
import { MarvelSeriesResponse, Series } from '@/types/marvelSeries';
import md5 from 'md5';
import axios from 'axios';
import SeriesComponent from '@/components/SeriesComponent';
import AnimatedButton from '@/components/AnimatedButton';

export default function Trivia() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const PUBLIC_KEY = Environment.MARVEL_PUBLIC_KEY;
  const PRIVATE_KEY = Environment.MARVEL_PRIVATE_KEY;

  const [seriesItems, setSeriesItems] = useState<Series[]>([]);
  const [response, setResponse] = useState<MarvelSeriesResponse | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const marvelURL = 'https://gateway.marvel.com/v1/public/series';
  const pageSize = 16;

  useEffect(() => {
    fetchSeries(1);
  }, []);

  const fetchSeries = async (pageNumber: number) => {
    const ts = new Date().getTime().toString();
    const hash = md5(ts + PRIVATE_KEY + PUBLIC_KEY).toString();

    try {
      setIsLoading(true);
      let pagedSeries = [];
      let res;
      let limit = 50;
      do
      {
        res = await axios.get<MarvelSeriesResponse>(marvelURL, {
        params: {
          ts,
          apikey: PUBLIC_KEY,
          hash,
          limit: limit += 10,
          offset: (pageNumber - 1) * limit,
        },
      });

      const filteredSeries = res.data.data.results.filter(
        (series) => !series.thumbnail.path.includes('image_not_available')
      );

      pagedSeries = filteredSeries.slice(0, pageSize);
      } while (pagedSeries.length < pageSize)

      // Replace seriesItems completely with new page data
      setSeriesItems(pagedSeries);

      const totalAvailable = res.data.data.total;
      const newOffset = pageNumber * pageSize;
      setHasMore(newOffset < totalAvailable);

      setPage(pageNumber);
      setResponse(res.data);
    } catch (error: any) {
      console.error('❌ Marvel API error:', error.response?.data || error.message);
    } finally {
      setIsLoaded(true);
      setIsLoading(false);
    }
  };

  const onNextPage = () => {
    if (hasMore && !isLoading) {
      fetchSeries(page + 1);
    }
  };

  const onPrevPage = () => {
    if (page > 1 && !isLoading) {
      fetchSeries(page - 1);
    }
  };

  return (
    <ThemedView style={tw`flex-1`}>
      <SafeAreaView style={tw`flex-1 relative`}>
        {/* Header */}
        <ThemedText style={tw`mx-4 text-3xl font-bold`}>Marvel Series</ThemedText>
        <ThemedText style={tw`mx-4 mb-2`}>Find series from Marvel (Page: {page})</ThemedText>

        {/* List */}
        <View style={tw`flex-1`}>
          {isLoaded && !isLoading ? (
            <>
              <FlatList
                data={seriesItems}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <SeriesComponent item={item} />}
                numColumns={2}
                initialNumToRender={10}
                maxToRenderPerBatch={pageSize}
                windowSize={5}
                removeClippedSubviews={true}
                getItemLayout={(data, index) => {
                  const rowHeight = 360; // each row has 2 items, height fixed
                  const rowIndex = Math.floor(index / 2);
                  return {
                    length: rowHeight,
                    offset: rowHeight * rowIndex,
                    index,
                  };
                }}
                style={tw`px-1`}
                columnWrapperStyle={tw`justify-between`}
              />

              {/* Pagination Controls */}
              <View style={tw`flex-row justify-center items-center my-3`}>
                <AnimatedButton
                  disabled={page === 1 || isLoading}
                  onPress={onPrevPage}
                  style={tw.style(
                    'px-4 py-2 rounded-lg mr-4',
                    page === 1 || isLoading ? 'bg-gray-300' : 'bg-blue-600'
                  )}
                >
                  <Text style={tw`text-white`}>Previous</Text>
                </AnimatedButton>

                <AnimatedButton
                  disabled={!hasMore || isLoading}
                  onPress={onNextPage}
                  style={tw.style(
                    'px-4 py-2 rounded-lg',
                    !hasMore || isLoading ? 'bg-gray-300' : 'bg-blue-600'
                  )}
                >
                  <Text style={tw`text-white`}>Next</Text>
                </AnimatedButton>
              </View>
            </>
          ) : (
            <ActivityIndicator size="large" />
          )}
        </View>

        {/* Attribution */}
        <ThemedView style={[tw`bottom-0 w-full p-2`, { backgroundColor: colors.gray1 }]}>
          <ThemedText style={tw`text-center`}>
            {response?.attributionText || 'Content loading...'}
          </ThemedText>
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}

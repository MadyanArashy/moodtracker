import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import tw from 'twrnc';

import AnimatedButton from '@/components/AnimatedButton';
import SeriesComponent from '@/components/SeriesComponent';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { Environment } from '@/constants/Environment';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MarvelSeriesResponse, Series } from '@/types/marvelSeries';
import axios from 'axios';
import md5 from 'md5';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  const pageSize = 12;

  useEffect(() => {
    fetchSeries(1);
  }, []);

  const fetchSeries = async (pageNumber: number) => {
    const ts = new Date().getTime().toString();
    const hash = md5(ts + PRIVATE_KEY + PUBLIC_KEY).toString();

    try {
      setIsLoading(true);

      const res = await axios.get<MarvelSeriesResponse>(marvelURL, {
        params: {
          ts,
          apikey: PUBLIC_KEY,
          hash,
          limit: 100, // Use 100 to reduce number of calls overall
          offset: (pageNumber - 1) * 100,
        },
      });

      const filtered = res.data.data.results.filter(
        (series) => !series.thumbnail.path.includes('image_not_available')
      );

      // Accept whatever number we get
      setSeriesItems(filtered.slice(0, pageSize));
      setHasMore((pageNumber * pageSize) < res.data.data.total);
      setPage(pageNumber);
      setResponse(res.data);
    } catch (error: any) {
      console.error('❌ Marvel API error:', error.response?.data || error.message);
    } finally {
      setIsLoading(false);
      setIsLoaded(true);
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
              style={tw`px-1 mb-18`}
              columnWrapperStyle={tw`justify-between`}
            />
            ) : (
            <ActivityIndicator size="large" />
          )}

              {/* Pagination Controls */}
              <View style={[tw`flex-row justify-center items-center mt-3 mb-6 py-3 relative gap-3 absolute bottom-0 w-full`, {backgroundColor: colors.gray4}]}>
                <AnimatedButton
                  disabled={page === 1 || isLoading}
                  onPress={onPrevPage}
                  animationType='opacity'
                >
                  <ThemedText style={[tw`underline text-center`, {color: (page === 1 || isLoading) ? colors.disabledText : colors.tint}]}>Prev</ThemedText>
                </AnimatedButton>

                <AnimatedButton
                  disabled={!hasMore || isLoading}
                  onPress={onNextPage}
                  animationType='opacity'
                >
                  <ThemedText style={[tw`underline text-center`, {color: (!hasMore || isLoading) ? colors.disabledText : colors.tint}]}>Next</ThemedText>
                </AnimatedButton>
              </View>
          
        </View>

        {/* Attribution */}
        <ThemedView style={[tw`absolute bottom-0 w-full p-2`, { backgroundColor: colors.gray1 }]}>
          <ThemedText style={tw`text-center`}>
            {response?.attributionText || 'Content loading...'}
          </ThemedText>
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}

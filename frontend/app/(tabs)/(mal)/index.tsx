// MAL.tsx
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, View, BackHandler  } from 'react-native';
import tw from 'twrnc';
import axios from 'axios';

import AnimatedButton from '@/components/AnimatedButton';
import AnimeComponent from '@/components/AnimeComponent';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Environment } from '@/constants/Environment'
import { Anime, AnimeData } from '@/types/anime';
import { AntDesign } from '@expo/vector-icons';

export default function MalIndex() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const CLIENT_ID = Environment.MAL_CLIENT_ID;

  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [pageHistory, setPageHistory] = useState<number[]>([]);
  const pageSize = 16;

  const fetchAnimes = async (pageNumber: number, trackHistory: boolean = true) => {
  try {
    setIsLoading(true);
    const offset = (pageNumber - 1) * pageSize;

    const res = await axios.get('https://api.myanimelist.net/v2/anime/ranking', {
      headers: {
        'X-MAL-CLIENT-ID': CLIENT_ID,
      },
      params: {
        limit: pageSize,
        offset,
        fields: 'mean,num_episodes,start_date,end_date,genres,rank',
        ranking_type: 'all',
      },
    });

    setAnimeList(res.data.data.map((item: AnimeData) => item.node));
    setHasMore(res.data.data.length === pageSize);

    if (trackHistory && pageNumber !== page) {
      setPageHistory((prev) => [...prev, page]);
    }

    setPage(pageNumber);
  } catch (error: any) {
    console.error('❌ MAL API error:', error.response?.data || error.message);
  } finally {
    setIsLoading(false);
  }
  };


  useEffect(() => {
    fetchAnimes(1);
  }, []);

  useEffect(() => {
  const onBackPress = () => {
    if (pageHistory.length > 0) {
      const lastPage = pageHistory[pageHistory.length - 1];
      setPageHistory((prev) => prev.slice(0, -1));
      fetchAnimes(lastPage, false); // don't re-track history
    }
    return true;
  };

  const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

  return () => backHandler.remove();
}, [pageHistory]);


  return (
    <ThemedView style={tw`flex-1 pt-8`}>
      <ThemedText style={tw`mx-4 text-3xl font-bold`}>Top Anime</ThemedText>
      <ThemedText style={tw`mx-4 mb-2`}>Discover MAL's Top animes of all time</ThemedText>

      <View style={tw`flex-1`}>
        {isLoading ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList
            data={animeList}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <AnimeComponent item={item} />}
            numColumns={2}
            columnWrapperStyle={tw`justify-between`}
            style={tw`px-1 mb-14`}
            initialNumToRender={10}
            maxToRenderPerBatch={pageSize}
            windowSize={5}
            getItemLayout={(_, index) => {
              const rowHeight = 240;
              const rowIndex = Math.floor(index / 2);
              return {
                length: rowHeight,
                offset: rowHeight * rowIndex,
                index,
              };
            }}
          />
        )}

        <View style={[tw`flex-row justify-center items-center py-3 absolute bottom-0 w-full gap-1`, { backgroundColor: colors.gray4, display: (isLoading) && 'none' }]}>
          <AnimatedButton disabled={page === 1} onPress={() => fetchAnimes(page - 1)} style={[tw`w-8 h-8 flex justify-center items-center rounded-lg`, {display: (page === 1) && 'none', backgroundColor: colors.gray1}]}>
            <AntDesign name='left' size={18} color={(page === 1) ? colors.disabledText : colors.tint}/>
          </AnimatedButton>
          <AnimatedButton disabled={page < 4} onPress={() => fetchAnimes(1)} style={[tw`w-8 h-8 flex justify-center items-center rounded-lg text-white`, {display: (page < 4) && 'none', backgroundColor: colors.gray1}]}>
            <AntDesign name='home' size={18} color={colors.tint}/>
          </AnimatedButton>
          <AnimatedButton disabled={page <= 2} onPress={() => fetchAnimes(page - 2)} style={[tw`w-8 h-8 flex justify-center items-center rounded-lg`, {display: (page <= 2) && 'none', backgroundColor: colors.gray1}]}>
            <ThemedText>
              {page - 2}
            </ThemedText>
          </AnimatedButton>
          <AnimatedButton disabled={page === 1} onPress={() => fetchAnimes(page - 1)} style={[tw`w-8 h-8 flex justify-center items-center rounded-lg`, {display: (page === 1) && 'none', backgroundColor: colors.gray1}]}>
            <ThemedText>
              {page - 1}
            </ThemedText>
          </AnimatedButton>
          <AnimatedButton onPress={() => fetchAnimes(page)} style={[tw`w-8 h-8 flex justify-center items-center rounded-lg`, {backgroundColor: colors.tint}]}>
            <ThemedText style={tw`text-white`}>
              {page}
            </ThemedText>
          </AnimatedButton>
          <AnimatedButton onPress={() => fetchAnimes(page + 1)} style={[tw`w-8 h-8 flex justify-center items-center rounded-lg`, {backgroundColor: colors.gray1}]}>
            <ThemedText>
              {page + 1}
            </ThemedText>
          </AnimatedButton>
          <AnimatedButton onPress={() => fetchAnimes(page + 2)} style={[tw`w-8 h-8 flex justify-center items-center rounded-lg`, {backgroundColor: colors.gray1}]}>
            <ThemedText>
              {page + 2}
            </ThemedText>
          </AnimatedButton>
          <AnimatedButton disabled={!hasMore} onPress={() => fetchAnimes(page + 1)} style={[tw`w-8 h-8 flex justify-center items-center rounded-lg`, {display: (!hasMore) && 'none', backgroundColor: colors.gray1}]}>
            <AntDesign name='right' size={18} color={(!hasMore) ? colors.disabledText : colors.tint}/>
          </AnimatedButton>            
        </View>
      </View>
    </ThemedView>
  );
}

import React, { useEffect, useState } from 'react';
import { ScrollView, Image, View, ActivityIndicator } from 'react-native';
import tw from 'twrnc';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderView from './../../../components/HeaderView';
import axios from 'axios';
import { Environment } from '@/constants/Environment';
import { Anime } from '@/types/anime';
import { Entypo, Feather } from '@expo/vector-icons';

export default function AnimePage() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const params = useLocalSearchParams();
  const CLIENT_ID = Environment.MAL_CLIENT_ID;
  const [loaded, setLoaded] = useState(false);
  const [anime, setAnime] = useState<Anime | null>(null);
  
  const ANIME_ID: string | null = params.id
  ? decodeURIComponent(params.id.toString())
  : null;

  useEffect(() => {
    if (ANIME_ID && !loaded) {
      fetchAnime();
      setLoaded(true);    }
  },[ANIME_ID])
  
  const fetchAnime = async () => {
    try {
      const res = await axios.get(`https://api.myanimelist.net/v2/anime/${ANIME_ID}`, {
        headers: {
          'X-MAL-CLIENT-ID': CLIENT_ID,
        },
        params: {
          fields: 'id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,nsfw,created_at,updated_at,media_type,status,genres,my_list_status,num_episodes,start_season,broadcast,source,average_episode_duration,rating,pictures,background,related_anime,related_manga,recommendations,studios,statistics',
        },
      })
      setAnime(res.data);
    } catch(error: any) {
      console.error('❌ MAL API error:', error.response?.data || error.message);
    } finally {
      setLoaded(true);
    }
  }
  const altTitlesString = [
    ...(anime?.alternative_titles?.synonyms || []),
    anime?.alternative_titles?.en,
    anime?.alternative_titles?.ja,
  ]
    .filter(Boolean) // removes undefined/null
    .join(' · ');

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const start = formatDate(anime?.start_date);
  const end = formatDate(anime?.end_date);


  return (
    <ThemedView style={tw`flex-1 flex-grow mx-auto justify-center w-full`}>
      {
        loaded ?
        <ScrollView contentContainerStyle={tw`flex-1`}>
        <HeaderView 
          title={anime?.title || 'Loading...'}
          subtitle={altTitlesString}
          titleStyle={tw`font-bold text-xl`}
          subtitleStyle={[tw`text-xs`, {color: colors.disabledText}]}
          style={[{backgroundColor: colors.gray1}]}
        />
        <ThemedView style={tw`flex-row w-full`}>
          <Image 
            source={{ uri: anime?.main_picture?.medium }}
            style={tw`aspect-2/3 w-30`}
            resizeMode='contain'
          />
          <View style={tw`p-2 w-full flex-col gap-3`}>
            <View>
              <View style={tw`flex-row gap-1 items-center`}>
                <Feather name='star' size={24} color={colors.text}/>
                <ThemedText style={tw`text-xl`}>
                  {anime?.mean} {' '}
                  <ThemedText style={[tw`text-sm`, {color: colors.disabledText}]}>({anime?.num_scoring_users?.toLocaleString()} users)</ThemedText>
                </ThemedText>
              </View>
              <ThemedText style={{ color: colors.tint }}>
                Ranked #{anime?.rank}
              </ThemedText>
            </View>
            <View>
              <View style={tw`flex-row items-baseline`}>
                <ThemedText style={[tw`text-xl font-bold`,{ textTransform: anime?.media_type == 'tv' || anime?.media_type == 'ona' || anime?.media_type == 'ova' ? 'uppercase' : 'capitalize' }]}>
                  {anime?.media_type}
                </ThemedText>
                <ThemedText style={{ display: (anime?.media_type == 'tv' || anime?.media_type == 'ona' || anime?.media_type == 'ova') ? undefined : 'none' }}>
                  {' '}({anime?.num_episodes} episodes)
                </ThemedText>
              </View>
              <ThemedText>
                Aired: {start} to {end}
              </ThemedText>
            </View>
          </View>
        </ThemedView>
      </ScrollView>
      : <ActivityIndicator size={'large'}/>
      }
    </ThemedView>
  );
};

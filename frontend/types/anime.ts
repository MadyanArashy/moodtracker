export type Picture = {
  medium: string;
  large: string;
};

export type AlternativeTitles = {
  synonyms?: string[];
  en?: string;
  ja?: string;
};

export type Genre = {
  id: number;
  name: string;
};

export type MyListStatus = {
  status?: string;
  score?: number;
  num_episodes_watched?: number;
  is_rewatching?: boolean;
  start_date?: string;
  finish_date?: string;
  priority?: number;
  num_times_rewatched?: number;
  rewatch_value?: number;
  tags?: string;
  comments?: string;
  updated_at?: string;
};

export type StartSeason = {
  year: number;
  season: 'winter' | 'spring' | 'summer' | 'fall';
};

export type Broadcast = {
  day_of_the_week?: string;
  start_time?: string;
};

export type Studio = {
  id: number;
  name: string;
};

export type RelatedAnime = {
  node: {
    id: number;
    title: string;
    main_picture?: Picture;
  };
  relation_type: string;
};

export type Recommendation = {
  node: {
    id: number;
    title: string;
    main_picture?: Picture;
  };
  num_recommendations: number;
};

export type AnimeStatistics = {
  status: {
    watching: number;
    completed: number;
    on_hold: number;
    dropped: number;
    plan_to_watch: number;
  };
  num_list_users: number;
};

export type Anime = {
  id: number;
  title: string;
  main_picture?: Picture;
  alternative_titles?: AlternativeTitles;
  start_date?: string;
  end_date?: string;
  synopsis?: string;
  mean?: number;
  rank?: number;
  popularity?: number;
  num_list_users?: number;
  num_scoring_users?: number;
  nsfw?: string;
  created_at?: string;
  updated_at?: string;
  media_type?: 'tv' | 'ova' | 'movie' | 'special' | 'ona' | 'music';
  status?: 'finished_airing' | 'currently_airing' | 'not_yet_aired';
  genres?: Genre[];
  my_list_status?: MyListStatus;
  num_episodes?: number;
  start_season?: StartSeason;
  broadcast?: Broadcast;
  source?: string;
  average_episode_duration?: number;
  rating?: 'g' | 'pg' | 'pg_13' | 'r' | 'r+' | 'rx';
  studios?: Studio[];
  pictures?: Picture[];
  background?: string;
  related_anime?: RelatedAnime[];
  recommendations?: Recommendation[];
  statistics?: AnimeStatistics;
};

export type AnimeData = {
  node: Anime
};
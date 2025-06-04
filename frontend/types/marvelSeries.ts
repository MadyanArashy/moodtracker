export interface MarvelSeriesResponse {
  code: number;
  status: string;
  copyright: string;
  attributionText: string;
  attributionHTML: string;
  etag: string;
  data: SeriesDataContainer;
}

export interface SeriesDataContainer {
  offset: number;
  limit: number;
  total: number;
  count: number;
  results: Series[];
}

export interface Series {
  id: number;
  title: string;
  description: string | null;
  resourceURI: string;
  urls: Url[];
  startYear: number;
  endYear: number;
  rating: string;
  type: string;
  modified: string;
  thumbnail: Image;
  comics: ComicSummary;
  creators: CreatorSummary;
  characters: CharacterSummary;
}

export interface Url {
  type: string;
  url: string;
}

export interface Image {
  path: string;
  extension: string;
}

export interface ComicSummary {
  available: number;
  collectionURI: string;
  items: ComicSummaryItem[];
  returned: number;
}

export interface ComicSummaryItem {
  resourceURI: string;
  name: string;
}

export interface CreatorSummary {
  available: number;
  collectionURI: string;
  items: CreatorSummaryItem[];
  returned: number;
}

export interface CreatorSummaryItem {
  resourceURI: string;
  name: string;
  role: string;
}

export interface CharacterSummary {
  available: number;
  collectionURI: string;
  items: CharacterSummaryItem[];
  returned: number;
}

export interface CharacterSummaryItem {
  resourceURI: string;
  name: string;
}

export type MarvelComicResponse = {
  code: number;
  status: string;
  copyright: string;
  attributionText: string;
  attributionHTML: string;
  etag: string;
  data: {
    offset: number;
    limit: number;
    total: number;
    count: number;
    results: Comic[];
  };
};

export type Comic = {
  id: number;
  digitalId: number;
  title: string;
  issueNumber: number;
  variantDescription: string;
  description: string;
  modified: string;
  isbn: string;
  upc: string;
  diamondCode: string;
  ean: string;
  issn: string;
  format: string;
  pageCount: number;
  textObjects: TextObject[];
  resourceURI: string;
  urls: Url[];
  series: ResourceItem;
  variants: any[];
  collections: any[];
  collectedIssues: any[];
  dates: ComicDate[];
  prices: ComicPrice[];
  thumbnail: Image;
  images: Image[];
  creators: {
    available: number;
    collectionURI: string;
    items: Creator[];
    returned: number;
  };
  characters: {
    available: number;
    collectionURI: string;
    items: ResourceItem[];
    returned: number;
  };
  stories: {
    available: number;
    collectionURI: string;
    items: Story[];
    returned: number;
  };
  events: {
    available: number;
    collectionURI: string;
    items: ResourceItem[];
    returned: number;
  };
};

type TextObject = {
  type: string;
  language: string;
  text: string;
};

type Url = {
  type: string;
  url: string;
};

type ResourceItem = {
  resourceURI: string;
  name: string;
};

type ComicDate = {
  type: string;
  date: string;
};

type ComicPrice = {
  type: string;
  price: number;
};

type Image = {
  path: string;
  extension: string;
};

type Creator = {
  resourceURI: string;
  name: string;
  role: string;
};

type Story = {
  resourceURI: string;
  name: string;
  type: string;
};

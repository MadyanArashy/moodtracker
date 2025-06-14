export type ArticleItem = {
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

export type Article = {
  status: string;
  totalResults: number;
  articles: ArticleItem[];
};
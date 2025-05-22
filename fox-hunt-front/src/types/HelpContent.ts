export interface Article {
  title: string;
  index?: number;
  notes?: string;
  contents?: object;
}

export interface Topic extends Article {
  id?: number;
  articles: Article[];
}

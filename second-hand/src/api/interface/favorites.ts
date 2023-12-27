export interface Favorites {
  id: string;
  title: string;
  content: string;
  authorId: string;
  author: string;
  category: string;
  viewCount: string;
  likeCount: string;
}

export interface deleteApi {
  id: string | string[] | number | number[];
}

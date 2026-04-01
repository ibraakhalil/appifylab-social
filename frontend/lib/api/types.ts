export type ApiErrorResponse = {
  error: string;
};

export type ApiUser = {
  email: string;
  firstName: string;
  id: string;
  lastName: string;
};

export type AuthResponse = {
  token: string;
  user: ApiUser;
};

export type FeedPost = {
  author: ApiUser;
  commentCount: number;
  contentText: string | null;
  createdAt: string;
  id: string;
  imageUrl: string | null;
  isLiked: boolean;
  likeCount: number;
  visibility: "public" | "private";
};

export type FeedResponse = {
  items: FeedPost[];
  nextCursor: string | null;
};

export type CommentItem = {
  author: ApiUser;
  content: string;
  createdAt: string;
  id: string;
  isLiked: boolean;
  likeCount: number;
  parentId: string | null;
  replies: CommentItem[];
};

export type CommentsResponse = {
  items: CommentItem[];
};

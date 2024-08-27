export interface User {
  _id: string;
  fullname: string;
  username: string;
  email: string;
  password: string;
  image: string;
  bio: string;
  isPrivate: boolean;
  isPremium: boolean;
  followings: Array<{ following: User }>;
  followers: Array<{ follower: User }>;
  blocks: Array<{ block: User }>;
  favourites: Array<{ favourite: User }>;
}

export interface EditUser {
  fullname?: string;
  username?: string;
  email?: string;
  bio?: string;
  isPrivate?: boolean;
}

export interface Album {
  _id: string;
  name: string;
  user: User;
  image: string;
  posts: Array<{ post: Post }>;
}

export interface Post {
  _id: string;
  user: User;
  images: Array<{ image: string }>;
  caption: string;
  image: string;
  isDisplay: boolean;
  isComment: boolean;
  isLike: boolean;
  comments: Array<CommentObj>;
  likes: Array<LikeObj>;
  created_at: Date;
  updated_at: Date;
}

export interface Comment {
  _id: string;
  body: string;
  user: User;
  likes: Array<{ liker: User }>;
  created_at: Date;
  post?: string | Post;
}

export interface CommentObj {
  comment: Comment;
  post?: string;
}

export interface Like {
  _id: string;
  user: User;
  post: Post | Comment;
}

export interface LikeObj {
  liker: Like;
}

export interface Noti {
  _id: string;
  userFrom: User;
  userNoti: User;
  notiType: string;
  notiContent?: Comment;
  postType?: string;
  post?: any;
  created_at: Date;
}

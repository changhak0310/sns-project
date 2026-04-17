export type SocialActor = {
  id: number;
  username: string;
  name: string;
  avatarUrl: string;
  isViewer: boolean;
  isFollowing: boolean;
};

export type SocialComment = {
  id: string;
  content: string;
  createdAt: string;
  author: SocialActor;
};

export type SocialPostStats = {
  likes: number;
  comments: number;
  saves: number;
};

export type SocialPostViewerState = {
  liked: boolean;
  saved: boolean;
  owned: boolean;
};

export type SocialPost = {
  id: string;
  shortcode: string;
  category: string;
  caption: string;
  location: string;
  mediaLabel: string;
  publishedAt: string;
  tags: string[];
  author: SocialActor;
  stats: SocialPostStats;
  viewerState: SocialPostViewerState;
  comments: SocialComment[];
};

export type SocialProfile = SocialActor & {
  bio: string;
  joinedAt: string;
  followerCount: number;
  followingCount: number;
  postCount: number;
};

export type FeedResponseData = {
  items: SocialPost[];
  nextCursor: string | null;
  total: number;
};

export type PostDetailResponseData = {
  post: SocialPost;
};

export type ProfileResponseData = {
  profile: SocialProfile;
  posts: SocialPost[];
  savedPosts: SocialPost[];
  activeTab: "posts" | "saved";
};

export type ExploreResponseData = {
  query: string;
  users: SocialActor[];
  posts: SocialPost[];
};

export type NotificationType = "like" | "comment" | "follow";

export type NotificationItem = {
  id: string;
  type: NotificationType;
  createdAt: string;
  actor: SocialActor;
  post: {
    shortcode: string;
    caption: string;
  } | null;
  message: string;
};

export type NotificationsResponseData = {
  filter: "all" | NotificationType;
  items: NotificationItem[];
};

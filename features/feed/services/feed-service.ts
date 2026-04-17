export type FeedPost = {
  id: string;
  shortcode: string;
  author: {
    name: string;
    username: string;
    fallback: string;
  };
  category: string;
  caption: string;
  location: string;
  mediaLabel: string;
  publishedAt: string;
  stats: {
    likes: number;
    comments: number;
    saves: number;
  };
  tags: string[];
};

const mockFeedPosts: FeedPost[] = [
  {
    id: "orbit-feed-launch",
    shortcode: "orbit-feed-launch",
    author: {
      name: "Preview User",
      username: "preview-user",
      fallback: "PU",
    },
    category: "Product update",
    caption:
      "Shipping the first feed pass for Orbit. The main screen now promotes the newest post first so the app lands on actual content instead of a placeholder.",
    location: "Seoul studio",
    mediaLabel: "Orbit feed mock preview",
    publishedAt: "2026-04-11T09:12:00+09:00",
    stats: {
      likes: 128,
      comments: 24,
      saves: 16,
    },
    tags: ["feed", "mock-data", "orbit"],
  },
];

function sortByNewest(posts: FeedPost[]) {
  return [...posts].sort(
    (left, right) =>
      new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime()
  );
}

export const feedService = {
  getLatestPosts(limit = mockFeedPosts.length) {
    return sortByNewest(mockFeedPosts).slice(0, limit);
  },

  getLatestPost() {
    return this.getLatestPosts(1)[0] ?? null;
  },
};

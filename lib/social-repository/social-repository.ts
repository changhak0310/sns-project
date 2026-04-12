import "server-only";

import { ApiRouteError } from "@/lib/api/route-utils";
import { mockAuthStore } from "@/lib/social-repository/mock-auth-store";
import type { SessionUser, User } from "@/types/auth";
import type {
  ExploreResponseData,
  FeedResponseData,
  NotificationItem,
  NotificationsResponseData,
  ProfileResponseData,
  SocialActor,
  SocialComment,
  SocialPost,
  SocialProfile,
} from "@/types/social";

type PostRecord = {
  id: string;
  shortcode: string;
  authorId: number;
  category: string;
  caption: string;
  location: string;
  mediaLabel: string;
  publishedAt: string;
  tags: string[];
  likedBy: Set<number>;
  savedBy: Set<number>;
};

type CommentRecord = {
  id: string;
  shortcode: string;
  authorId: number;
  content: string;
  createdAt: string;
};

type FollowRecord = {
  followerId: number;
  followingId: number;
  createdAt: string;
};

type ProfileMeta = {
  bio: string;
  joinedAt: string;
};

const profileMetaByUserId = new Map<number, ProfileMeta>([
  [
    1,
    {
      bio: "Building Orbit and testing the first protected social routes.",
      joinedAt: "2026-01-12T08:00:00+09:00",
    },
  ],
  [
    2,
    {
      bio: "Shared product notes, roadmap drops, and launch checklists.",
      joinedAt: "2025-12-19T09:30:00+09:00",
    },
  ],
  [
    3,
    {
      bio: "Street photography and fast-moving city edits from Seoul nights.",
      joinedAt: "2026-02-03T20:15:00+09:00",
    },
  ],
  [
    4,
    {
      bio: "Studio process logs, material tests, and detail shots.",
      joinedAt: "2026-02-18T11:45:00+09:00",
    },
  ],
]);

const postRecords: PostRecord[] = [
  {
    id: "post-1",
    shortcode: "orbit-feed-launch",
    authorId: 1,
    category: "Product update",
    caption:
      "Shipping the first feed pass for Orbit. The main route now lands on fresh content instead of a placeholder shell.",
    location: "Seoul studio",
    mediaLabel: "Orbit feed launch preview",
    publishedAt: "2026-04-11T09:12:00+09:00",
    tags: ["feed", "launch", "orbit"],
    likedBy: new Set([2, 3, 4]),
    savedBy: new Set([2, 3]),
  },
  {
    id: "post-2",
    shortcode: "orbit-roadmap-drop",
    authorId: 2,
    category: "Roadmap",
    caption:
      "Roadmap snapshot for the next sprint: auth guard cleanup, create flow wiring, and profile API stabilization.",
    location: "Orbit room",
    mediaLabel: "Roadmap notes board",
    publishedAt: "2026-04-10T18:40:00+09:00",
    tags: ["roadmap", "sprint", "team"],
    likedBy: new Set([1, 3]),
    savedBy: new Set([1]),
  },
  {
    id: "post-3",
    shortcode: "city-night-walk",
    authorId: 3,
    category: "Photo diary",
    caption:
      "Late-night crosswalk light tests. Keeping the motion blur but pulling the contrast back a notch.",
    location: "Euljiro",
    mediaLabel: "Crosswalk light study",
    publishedAt: "2026-04-09T23:04:00+09:00",
    tags: ["photo", "night", "city"],
    likedBy: new Set([1, 4]),
    savedBy: new Set([1, 2]),
  },
  {
    id: "post-4",
    shortcode: "material-study-04",
    authorId: 4,
    category: "Process",
    caption:
      "Material study 04. Swapped the paper stock and the texture reads much softer under daylight.",
    location: "Studio Mina",
    mediaLabel: "Paper and texture samples",
    publishedAt: "2026-04-08T14:25:00+09:00",
    tags: ["studio", "materials", "process"],
    likedBy: new Set([1, 2]),
    savedBy: new Set([3]),
  },
];

const commentRecords: CommentRecord[] = [
  {
    id: "comment-1",
    shortcode: "orbit-feed-launch",
    authorId: 2,
    content: "This is much closer to the real landing flow. Keep the latest-first order.",
    createdAt: "2026-04-11T09:24:00+09:00",
  },
  {
    id: "comment-2",
    shortcode: "orbit-feed-launch",
    authorId: 3,
    content: "The feed hero reads cleaner now.",
    createdAt: "2026-04-11T09:31:00+09:00",
  },
  {
    id: "comment-3",
    shortcode: "orbit-roadmap-drop",
    authorId: 1,
    content: "Need logout and profile edit APIs in the same pass.",
    createdAt: "2026-04-10T19:03:00+09:00",
  },
];

const followRecords: FollowRecord[] = [
  {
    followerId: 1,
    followingId: 2,
    createdAt: "2026-03-20T10:00:00+09:00",
  },
  {
    followerId: 2,
    followingId: 1,
    createdAt: "2026-03-22T12:10:00+09:00",
  },
  {
    followerId: 3,
    followingId: 1,
    createdAt: "2026-04-01T22:00:00+09:00",
  },
];

function ensureUser(userId: number) {
  const user = mockAuthStore.findUserById(userId);

  if (!user) {
    throw new ApiRouteError("User not found.", 404);
  }

  return user;
}

function ensureProfileMeta(userId: number) {
  const existing = profileMetaByUserId.get(userId);

  if (existing) {
    return existing;
  }

  const nextMeta = {
    bio: "",
    joinedAt: new Date().toISOString(),
  };

  profileMetaByUserId.set(userId, nextMeta);

  return nextMeta;
}

function createActor(user: User, viewerId?: number | null): SocialActor {
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    avatarUrl: user.avatarUrl,
    isViewer: viewerId === user.id,
    isFollowing:
      viewerId !== null &&
      viewerId !== undefined &&
      viewerId !== user.id &&
      followRecords.some(
        (record) => record.followerId === viewerId && record.followingId === user.id
      ),
  };
}

function sortPostsByNewest(records: PostRecord[]) {
  return [...records].sort(
    (left, right) =>
      new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime()
  );
}

function sortCommentsByNewest(records: CommentRecord[]) {
  return [...records].sort(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
  );
}

function createCommentDto(
  record: CommentRecord,
  viewerId?: number | null
): SocialComment {
  const author = mockAuthStore.toPublicUser(ensureUser(record.authorId));

  return {
    id: record.id,
    content: record.content,
    createdAt: record.createdAt,
    author: createActor(author, viewerId),
  };
}

function createPostDto(
  record: PostRecord,
  viewerId?: number | null,
  options: {
    includeComments?: boolean;
  } = {}
): SocialPost {
  const author = mockAuthStore.toPublicUser(ensureUser(record.authorId));
  const comments = sortCommentsByNewest(
    commentRecords.filter((comment) => comment.shortcode === record.shortcode)
  );

  return {
    id: record.id,
    shortcode: record.shortcode,
    category: record.category,
    caption: record.caption,
    location: record.location,
    mediaLabel: record.mediaLabel,
    publishedAt: record.publishedAt,
    tags: [...record.tags],
    author: createActor(author, viewerId),
    stats: {
      likes: record.likedBy.size,
      comments: comments.length,
      saves: record.savedBy.size,
    },
    viewerState: {
      liked:
        viewerId !== null &&
        viewerId !== undefined &&
        record.likedBy.has(viewerId),
      saved:
        viewerId !== null &&
        viewerId !== undefined &&
        record.savedBy.has(viewerId),
      owned: viewerId === record.authorId,
    },
    comments: options.includeComments
      ? comments.map((comment) => createCommentDto(comment, viewerId))
      : [],
  };
}

function createProfileDto(user: User, viewerId?: number | null): SocialProfile {
  const meta = ensureProfileMeta(user.id);
  const followerCount = followRecords.filter(
    (record) => record.followingId === user.id
  ).length;
  const followingCount = followRecords.filter(
    (record) => record.followerId === user.id
  ).length;
  const postCount = postRecords.filter((record) => record.authorId === user.id).length;

  return {
    ...createActor(user, viewerId),
    bio: meta.bio,
    joinedAt: meta.joinedAt,
    followerCount,
    followingCount,
    postCount,
  };
}

function createShortcode(caption: string) {
  const base = caption
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);

  const prefix = base || "post";

  return `${prefix}-${Math.floor(Date.now() / 1000).toString(36)}`;
}

function ensurePost(shortcode: string) {
  const post = postRecords.find((record) => record.shortcode === shortcode);

  if (!post) {
    throw new ApiRouteError("Post not found.", 404);
  }

  return post;
}

function createNotificationItems(viewerId: number) {
  const viewerPosts = postRecords.filter((post) => post.authorId === viewerId);
  const viewerShortcodes = new Set(viewerPosts.map((post) => post.shortcode));
  const postByShortcode = new Map(
    viewerPosts.map((post) => [post.shortcode, post] as const)
  );

  const likeNotifications: NotificationItem[] = [];
  for (const post of viewerPosts) {
    for (const likerId of post.likedBy) {
      if (likerId === viewerId) {
        continue;
      }

      const actor = mockAuthStore.toPublicUser(ensureUser(likerId));
      likeNotifications.push({
        id: `like-${post.shortcode}-${likerId}`,
        type: "like",
        createdAt: post.publishedAt,
        actor: createActor(actor, viewerId),
        post: {
          shortcode: post.shortcode,
          caption: post.caption,
        },
        message: `${actor.name} liked your post.`,
      });
    }
  }

  const commentNotifications = commentRecords
    .filter(
      (comment) =>
        viewerShortcodes.has(comment.shortcode) && comment.authorId !== viewerId
    )
    .map((comment) => {
      const actor = mockAuthStore.toPublicUser(ensureUser(comment.authorId));
      const post = postByShortcode.get(comment.shortcode)!;

      return {
        id: `comment-${comment.id}`,
        type: "comment" as const,
        createdAt: comment.createdAt,
        actor: createActor(actor, viewerId),
        post: {
          shortcode: comment.shortcode,
          caption: post.caption,
        },
        message: `${actor.name} commented on your post.`,
      };
    });

  const followNotifications = followRecords
    .filter((record) => record.followingId === viewerId)
    .map((record) => {
      const actor = mockAuthStore.toPublicUser(ensureUser(record.followerId));

      return {
        id: `follow-${record.followerId}-${record.followingId}`,
        type: "follow" as const,
        createdAt: record.createdAt,
        actor: createActor(actor, viewerId),
        post: null,
        message: `${actor.name} followed you.`,
      };
    });

  return [...likeNotifications, ...commentNotifications, ...followNotifications].sort(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
  );
}

export const socialRepository = {
  ensureProfileForUser(user: User | SessionUser) {
    ensureProfileMeta(user.id);
  },

  getFeed(input: {
    viewerId?: number | null;
    cursor?: string | null;
    limit?: number;
  }): FeedResponseData {
    const limit = input.limit ?? 10;
    const offset = input.cursor ? Number(input.cursor) || 0 : 0;
    const orderedPosts = sortPostsByNewest(postRecords);
    const pageItems = orderedPosts.slice(offset, offset + limit);
    const nextCursor =
      offset + limit < orderedPosts.length ? String(offset + limit) : null;

    return {
      items: pageItems.map((record) => createPostDto(record, input.viewerId)),
      nextCursor,
      total: orderedPosts.length,
    };
  },

  getPost(input: {
    shortcode: string;
    viewerId?: number | null;
  }) {
    const post = ensurePost(input.shortcode);

    return {
      post: createPostDto(post, input.viewerId, {
        includeComments: true,
      }),
    };
  },

  createPost(input: {
    authorId: number;
    caption: string;
    location?: string;
    mediaLabel?: string;
    category?: string;
    tags?: string[];
  }) {
    ensureUser(input.authorId);

    const nextPost: PostRecord = {
      id: `post-${crypto.randomUUID()}`,
      shortcode: createShortcode(input.caption),
      authorId: input.authorId,
      category: input.category?.trim() || "Fresh post",
      caption: input.caption.trim(),
      location: input.location?.trim() || "Orbit",
      mediaLabel: input.mediaLabel?.trim() || "Uploaded post",
      publishedAt: new Date().toISOString(),
      tags: input.tags ?? [],
      likedBy: new Set(),
      savedBy: new Set(),
    };

    postRecords.unshift(nextPost);

    return createPostDto(nextPost, input.authorId, {
      includeComments: true,
    });
  },

  createComment(input: {
    shortcode: string;
    authorId: number;
    content: string;
  }) {
    ensureUser(input.authorId);
    ensurePost(input.shortcode);

    const nextComment: CommentRecord = {
      id: `comment-${crypto.randomUUID()}`,
      shortcode: input.shortcode,
      authorId: input.authorId,
      content: input.content.trim(),
      createdAt: new Date().toISOString(),
    };

    commentRecords.unshift(nextComment);

    return createCommentDto(nextComment, input.authorId);
  },

  setLike(input: {
    shortcode: string;
    viewerId: number;
    liked: boolean;
  }) {
    const post = ensurePost(input.shortcode);

    if (input.liked) {
      post.likedBy.add(input.viewerId);
    } else {
      post.likedBy.delete(input.viewerId);
    }

    return createPostDto(post, input.viewerId, {
      includeComments: true,
    });
  },

  setSave(input: {
    shortcode: string;
    viewerId: number;
    saved: boolean;
  }) {
    const post = ensurePost(input.shortcode);

    if (input.saved) {
      post.savedBy.add(input.viewerId);
    } else {
      post.savedBy.delete(input.viewerId);
    }

    return createPostDto(post, input.viewerId, {
      includeComments: true,
    });
  },

  getProfile(input: {
    username: string;
    viewerId?: number | null;
    tab?: "posts" | "saved";
  }): ProfileResponseData {
    const userRecord = mockAuthStore.findUserByUsername(input.username);

    if (!userRecord) {
      throw new ApiRouteError("User not found.", 404);
    }

    const user = mockAuthStore.toPublicUser(userRecord);
    const authoredPosts = sortPostsByNewest(
      postRecords.filter((record) => record.authorId === user.id)
    ).map((record) => createPostDto(record, input.viewerId));
    const savedPosts = sortPostsByNewest(
      postRecords.filter((record) => record.savedBy.has(user.id))
    ).map((record) => createPostDto(record, input.viewerId));

    return {
      profile: createProfileDto(user, input.viewerId),
      posts: authoredPosts,
      savedPosts,
      activeTab: input.tab ?? "posts",
    };
  },

  setFollow(input: {
    username: string;
    viewerId: number;
    following: boolean;
  }) {
    const targetUserRecord = mockAuthStore.findUserByUsername(input.username);

    if (!targetUserRecord) {
      throw new ApiRouteError("User not found.", 404);
    }

    if (targetUserRecord.id === input.viewerId) {
      throw new ApiRouteError("You cannot follow yourself.", 400);
    }

    const existingIndex = followRecords.findIndex(
      (record) =>
        record.followerId === input.viewerId &&
        record.followingId === targetUserRecord.id
    );

    if (input.following && existingIndex === -1) {
      followRecords.unshift({
        followerId: input.viewerId,
        followingId: targetUserRecord.id,
        createdAt: new Date().toISOString(),
      });
    }

    if (!input.following && existingIndex !== -1) {
      followRecords.splice(existingIndex, 1);
    }

    return this.getProfile({
      username: targetUserRecord.username,
      viewerId: input.viewerId,
      tab: "posts",
    });
  },

  updateProfile(input: {
    userId: number;
    displayName: string;
    bio: string;
    avatarUrl: string;
  }) {
    const updatedUser = mockAuthStore.updateUserProfile({
      userId: input.userId,
      name: input.displayName.trim(),
      avatarUrl: input.avatarUrl.trim(),
    });

    if (!updatedUser) {
      throw new ApiRouteError("User not found.", 404);
    }

    const meta = ensureProfileMeta(input.userId);
    meta.bio = input.bio.trim();

    return {
      sessionUser: mockAuthStore.toSessionUser(updatedUser),
      profile: createProfileDto(updatedUser, input.userId),
    };
  },

  getExplore(input: {
    viewerId?: number | null;
    q?: string | null;
  }): ExploreResponseData {
    const query = input.q?.trim().toLowerCase() ?? "";
    const users = mockAuthStore
      .listPublicUsers()
      .filter((user) => {
        if (!query) {
          return true;
        }

        return (
          user.username.toLowerCase().includes(query) ||
          user.name.toLowerCase().includes(query)
        );
      })
      .map((user) => createActor(user, input.viewerId));

    const posts = sortPostsByNewest(postRecords)
      .filter((post) => {
        if (!query) {
          return true;
        }

        return (
          post.caption.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.includes(query)) ||
          post.location.toLowerCase().includes(query)
        );
      })
      .map((post) => createPostDto(post, input.viewerId));

    return {
      query,
      users,
      posts,
    };
  },

  getNotifications(input: {
    viewerId: number;
    filter?: "all" | "like" | "comment" | "follow";
  }): NotificationsResponseData {
    const filter = input.filter ?? "all";
    const items = createNotificationItems(input.viewerId).filter((item) =>
      filter === "all" ? true : item.type === filter
    );

    return {
      filter,
      items,
    };
  },
};

import Link from "next/link";
import {
  ArrowUpRight,
  Bookmark,
  Heart,
  MapPin,
  MessageCircleMore,
  Sparkles,
} from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { ImageFallback } from "@/components/ui/image-fallback";
import type { FeedPost } from "@/features/feed/services/feed-service";

type FeedPostCardProps = {
  post: FeedPost;
  badgeLabel?: string;
};

function formatPublishedAt(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function FeedPostCard({ post, badgeLabel }: FeedPostCardProps) {
  return (
    <Card bordered elevated interactive className="overflow-hidden bg-[var(--ds-ui-surface)]">
      <CardHeader className="gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3 pb-4">
            <Avatar
              alt={post.author.name}
              fallback={post.author.fallback}
              size="sm"
              ring
              status="online"
            />
            <div className="min-w-0">
              <div className="flex flex-wrap gap-4">
                <CardTitle className="text-base">{post.author.name}</CardTitle>
                <Badge variant="soft" tone="accent" size="sm">
                  {badgeLabel ?? post.category}
                </Badge>
              </div>
              <CardDescription className="mt-1">
                @{post.author.username} - {formatPublishedAt(post.publishedAt)}
              </CardDescription>
            </div>
          </div>
          <Link
            href={`/p/${post.shortcode}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--ds-color-accent-500)]"
          >
            <span>Open</span>
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </CardHeader>

      <CardContent className="mt-0 space-y-4">
        <ImageFallback
          ratio="landscape"
          label={post.mediaLabel}
          icon={<Sparkles className="size-4" aria-hidden />}
          className="bg-[linear-gradient(135deg,rgba(239,109,71,0.14),var(--ds-ui-surface-muted))]"
        />

        <p className="text-sm leading-7 text-[var(--ds-ui-text-primary)]">{post.caption}</p>

        <div className="flex flex-wrap gap-2">
          <Badge
            variant="outline"
            tone="neutral"
            size="sm"
            icon={<MapPin className="h-3.5 w-3.5" />}
          >
            {post.location}
          </Badge>
          {post.tags.map((tag) => (
            <Badge key={tag} variant="soft" tone="neutral" size="sm">
              {tag}
            </Badge>
          ))}
        </div>

        <Divider />

        <div className="flex flex-wrap gap-4 text-sm text-[var(--ds-ui-text-secondary)]">
          <span className="inline-flex items-center gap-2">
            <Heart className="h-4 w-4 text-[var(--ds-color-accent-500)]" aria-hidden />
            {post.stats.likes} likes
          </span>
          <span className="inline-flex items-center gap-2">
            <MessageCircleMore className="h-4 w-4" aria-hidden />
            {post.stats.comments} comments
          </span>
          <span className="inline-flex items-center gap-2">
            <Bookmark className="h-4 w-4" aria-hidden />
            {post.stats.saves} saves
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

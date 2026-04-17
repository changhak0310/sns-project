import { Badge } from "@/components/ui/badge";
import { FeedPostCard } from "@/features/feed/components/feed-post-card";
import { feedService } from "@/features/feed/services/feed-service";

export default function FeedPage() {
  const latestPosts = feedService.getLatestPosts();

  return (
    <section className="flex flex-col gap-4 pb-8">
      <div className="flex items-center justify-between gap-3 px-1 py-1.5">
        <div>
          <h2 className="text-lg font-semibold tracking-[-0.03em] text-[var(--ds-ui-text-primary)]">
            Latest Feed
          </h2>
        </div>
        <Badge variant="outline" tone="neutral">
          {latestPosts.length} item
          {latestPosts.length === 1 ? "" : "s"}
        </Badge>
      </div>

      <div className="space-y-4">
        {latestPosts.map((post, index) => (
          <FeedPostCard
            key={post.id}
            post={post}
            badgeLabel={index === 0 ? "Latest" : undefined}
          />
        ))}
      </div>
    </section>
  );
}

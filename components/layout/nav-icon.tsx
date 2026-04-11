import type { LucideIcon } from "lucide-react";
import {
  Bookmark,
  Circle,
  Home,
  PlusSquare,
  UserRound,
} from "lucide-react";

import { cn } from "@/lib/utils/cn";

const iconMap: Record<string, LucideIcon> = {
  bookmark: Bookmark,
  home: Home,
  "plus-square": PlusSquare,
  profile: UserRound,
  user: UserRound,
  "user-round": UserRound,
};

export function NavIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = iconMap[name] ?? Circle;

  return <Icon aria-hidden="true" className={cn("shrink-0", className)} />;
}

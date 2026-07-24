"use client";

/**
 * PILOT — Ideogram Home (/explore), rebuilt 1:1 on shadcn/ui.
 * Hero (headline + tool pills + composer) → filter row → masonry feed.
 * The feed card is the seed of our future ProductCard. App-shell is reused
 * from ../_shell. Palette = Ideogram; recolor to gallery-warm is a later step.
 */

import {
  SlidersHorizontal,
  Paperclip,
  Sparkles,
  Images,
  Ratio,
  Percent,
  Globe,
  Folder,
  ArrowUp,
  ChevronDown,
  Search,
  Lock,
  Heart,
  MoreHorizontal,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AppSidebar } from "../_shell/app-sidebar";
import { MobileNav } from "../_shell/mobile-nav";
import { ImageActionsMenu } from "../_shell/image-actions-menu";

/* ── data (placeholder) ── */
const HERO_TOOLS: { label: string; badge?: string }[] = [
  { label: "Prompt Builder", badge: "NEW" },
  { label: "Edit image" },
  { label: "Image Studio" },
  { label: "AI Apps" },
];
const CATEGORIES = ["All", "Poster", "T-shirt", "Logo", "Marketing", "Print on demand"];
/* varied aspect ratios drive the masonry rhythm; likes are placeholder counts */
const FEED: { ar: string; likes: number }[] = [
  { ar: "aspect-square", likes: 8 },
  { ar: "aspect-[3/4]", likes: 21 },
  { ar: "aspect-[4/5]", likes: 34 },
  { ar: "aspect-[4/3]", likes: 11 },
  { ar: "aspect-[3/4]", likes: 5 },
  { ar: "aspect-square", likes: 47 },
  { ar: "aspect-[4/5]", likes: 3 },
  { ar: "aspect-[4/3]", likes: 19 },
  { ar: "aspect-[3/4]", likes: 62 },
  { ar: "aspect-square", likes: 7 },
  { ar: "aspect-[4/5]", likes: 28 },
  { ar: "aspect-[3/4]", likes: 14 },
  { ar: "aspect-[4/3]", likes: 9 },
  { ar: "aspect-square", likes: 51 },
  { ar: "aspect-[3/4]", likes: 6 },
  { ar: "aspect-[4/5]", likes: 33 },
];

/* ── composer control pill ── */
function ComposerPill({
  icon: Icon,
  children,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <button className="flex h-8 items-center gap-1.5 rounded-full bg-secondary px-2.5 text-[13px] font-medium text-foreground hover:bg-secondary/70 [&_svg]:size-4">
      <Icon /> {children}
    </button>
  );
}

function ComposerIconBtn({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          aria-label={label}
          className="grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground [&_svg]:size-[18px]"
        >
          <Icon />
        </button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

/* ── feed card (seed of ProductCard) ── */
function FeedCard({ ar, likes }: { ar: string; likes: number }) {
  return (
    <figure className="group relative mb-3 break-inside-avoid overflow-hidden rounded-xl bg-muted">
      <div className={cn("w-full", ar)} />
      {/* hover scrim + top-right ••• */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10 opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
        <ImageActionsMenu
          trigger={
            <Button
              variant="ghost"
              size="icon"
              aria-label="More"
              className="size-8 rounded-full bg-black/45 text-white backdrop-blur hover:bg-black/60 [&_svg]:size-4"
            >
              <MoreHorizontal />
            </Button>
          }
        />
      </div>
      {/* like count bottom-right */}
      <figcaption className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/45 px-2 py-0.5 text-[12px] font-medium text-white backdrop-blur">
        {likes}
        <Heart className="size-3.5" />
      </figcaption>
    </figure>
  );
}

/* ── page ── */
export default function HomePage() {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex h-screen overflow-hidden bg-background text-foreground">
        <AppSidebar activeNav="Home" />

        <main className="flex-1 overflow-y-auto">
          <div className="px-6 pb-24 min-[900px]:pb-16">
            {/* ── hero ── */}
            <section className="mx-auto max-w-[864px] pt-10 text-center">
              <h1 className="font-serif text-[40px] leading-[1.1] tracking-tight min-[900px]:text-[46px]">
                Your next creation starts here
              </h1>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {HERO_TOOLS.map((t) => (
                  <button
                    key={t.label}
                    className="flex h-9 items-center gap-1.5 rounded-full border px-4 text-[14px] font-medium hover:bg-accent"
                  >
                    {t.label}
                    {t.badge && (
                      <Badge className="h-4 rounded bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
                        {t.badge}
                      </Badge>
                    )}
                  </button>
                ))}
              </div>

              {/* composer */}
              <div className="mx-auto mt-6 rounded-[28px] border bg-card p-4 text-left shadow-sm">
                <div className="flex items-start gap-2">
                  <span className="text-[15px] text-muted-foreground">
                    Generate new or upload &amp; edit…
                  </span>
                  <button
                    aria-label="Composer settings"
                    className="ml-auto text-muted-foreground hover:text-foreground [&_svg]:size-[18px]"
                  >
                    <SlidersHorizontal />
                  </button>
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-2">
                  <ComposerIconBtn icon={Paperclip} label="Attach" />
                  <ComposerPill icon={Sparkles}>4.0 (latest)</ComposerPill>
                  <ComposerPill icon={Images}>4</ComposerPill>
                  <ComposerPill icon={Ratio}>9:16</ComposerPill>
                  <div className="ml-auto flex items-center gap-1">
                    <span className="mr-1 flex items-center gap-1 text-[13px] text-muted-foreground [&_svg]:size-4">
                      <Percent /> Auto
                    </span>
                    <ComposerIconBtn icon={Globe} label="Public" />
                    <ComposerIconBtn icon={Folder} label="Save to" />
                    <Button
                      size="icon"
                      aria-label="Generate"
                      className="size-9 rounded-full bg-foreground text-background hover:bg-foreground/90 [&_svg]:size-5"
                    >
                      <ArrowUp />
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            {/* ── filter row ── */}
            <div className="mt-10 flex items-center gap-3">
              <Button className="h-9 shrink-0 gap-1.5 rounded-full bg-foreground px-4 text-[14px] font-semibold text-background hover:bg-foreground/90">
                Explore <ChevronDown className="size-4" />
              </Button>
              <div className="h-5 w-px shrink-0 bg-border" />
              <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
                {CATEGORIES.map((c, i) => (
                  <button
                    key={c}
                    className={cn(
                      "h-9 shrink-0 whitespace-nowrap rounded-full px-4 text-[14px] font-medium transition-colors",
                      i === 0
                        ? "bg-foreground text-background"
                        : "text-foreground hover:bg-accent",
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <div className="relative ml-auto hidden shrink-0 min-[900px]:block">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search all…"
                  aria-label="Search"
                  className="h-9 w-[240px] rounded-full border bg-transparent pl-9 pr-8 text-[13px] outline-none placeholder:text-muted-foreground focus-visible:border-ring"
                />
                <Lock className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            {/* ── masonry feed ── */}
            <div className="mt-4 [column-gap:12px] columns-2 min-[700px]:columns-3 min-[1100px]:columns-4 min-[1700px]:columns-5">
              {FEED.map((f, i) => (
                <FeedCard key={i} ar={f.ar} likes={f.likes} />
              ))}
            </div>
          </div>
        </main>

        <MobileNav active="Home" />
      </div>
    </TooltipProvider>
  );
}

"use client";

/**
 * PILOT — Ideogram single-image detail screen, rebuilt 1:1 on shadcn/ui.
 * Palette = Ideogram (CSS vars in globals.css); recolor to gallery-warm is a later step.
 * Image / thumbnails are neutral placeholders (we don't embed Ideogram's artwork).
 * Structural switch at 900px: stacked (mobile/tablet) ↔ two-column (desktop).
 */

import * as React from "react";
import {
  Home,
  Images,
  FolderOpen,
  Heart,
  SlidersHorizontal,
  Image as ImageIcon,
  Blocks,
  Sparkles,
  MoreHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowUp,
  Share2,
  Download,
  Copy,
  Plus,
  Pencil,
  Shuffle,
  Maximize2,
  Eraser,
  Layers,
  FolderPlus,
  Bell,
  Gem,
  ExternalLink,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/* ── data (placeholder content — shows what each slot holds) ── */
const NAV = [
  { icon: Home, label: "Home" },
  { icon: Images, label: "My images" },
  { icon: FolderOpen, label: "Collections" },
  { icon: Heart, label: "My likes" },
];
const TOOLS = [
  { icon: SlidersHorizontal, label: "Prompt Builder", badge: "NEW" },
  { icon: ImageIcon, label: "Image Studio" },
  { icon: Blocks, label: "AI Apps" },
  { icon: Sparkles, label: "Models" },
  { icon: MoreHorizontal, label: "More" },
];
const DETAILS: [string, string][] = [
  ["Type", "Generation"],
  ["Model", "Ideogram 3.0"],
  ["Style", "Auto"],
  ["Aspect ratio", "3:4"],
  ["Resolution", "864 × 1152"],
  ["Rendering", "Turbo"],
  ["Seed", "1434646911"],
  ["Created", "Jan 30, 2026, 4:24 AM"],
];
const ACTIONS = [
  { icon: Pencil, label: "Edit" },
  { icon: Shuffle, label: "Remix" },
  { icon: Maximize2, label: "Upscale" },
  { icon: Eraser, label: "Remove BG" },
  { icon: Layers, label: "Layerize text" },
];
const PROMPT =
  "Aerial photograph with a slight diagonal tilt, showing the depth between sea and sand. Crystalline turquoise water with color gradation, gentle foam near the shore. White premium-fabric loungers and umbrellas, elegantly arranged. Soft shadows on the sand. A sophisticated, calm, exclusive summer mood. Captured with a high-resolution drone, 28mm-equivalent lens, warm late-morning light.";

/* ── small building blocks ── */
function IconCircle({
  children,
  label,
  className,
}: {
  children: React.ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={label}
          className={cn(
            "size-10 rounded-full bg-secondary text-foreground hover:bg-secondary/70 [&_svg]:size-[18px]",
            className,
          )}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function NavItem({
  icon: Icon,
  label,
  badge,
  collapsed,
  muted,
}: {
  icon: React.ElementType;
  label: string;
  badge?: string;
  collapsed?: boolean;
  muted?: boolean;
}) {
  return (
    <button
      className={cn(
        "flex h-9 w-full items-center gap-3 rounded-md px-3 text-[13px] font-semibold hover:bg-accent",
        muted ? "text-muted-foreground" : "text-foreground",
        collapsed && "justify-center px-0",
      )}
    >
      <Icon className="size-5 shrink-0" strokeWidth={1.75} />
      {!collapsed && (
        <>
          <span className="truncate">{label}</span>
          {badge && (
            <Badge className="ml-auto h-4 rounded bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
              {badge}
            </Badge>
          )}
        </>
      )}
    </button>
  );
}

/* ── sidebar (desktop) ── */
function Sidebar({ collapsed }: { collapsed: boolean }) {
  return (
    <div
      className={cn(
        "flex h-full flex-col bg-sidebar text-sidebar-foreground transition-[width]",
        collapsed ? "w-[65px] items-center" : "w-[219px]",
      )}
    >
      {/* logo */}
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center gap-2">
          <div className="size-6 rounded-md bg-foreground" />
          {!collapsed && (
            <span className="text-lg font-extrabold tracking-tight">Latenca</span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3">
        {/* account switcher */}
        {!collapsed && (
          <button className="mb-2 flex h-10 w-full items-center gap-2 rounded-lg border px-2 text-[13px] font-semibold">
            <Avatar className="size-6">
              <AvatarFallback className="bg-muted text-[10px]">A</AvatarFallback>
            </Avatar>
            <span>Personal</span>
            <ChevronDown className="ml-auto size-4 text-muted-foreground" />
          </button>
        )}

        <nav className="flex flex-col gap-0.5">
          {NAV.map((n) => (
            <NavItem key={n.label} {...n} collapsed={collapsed} />
          ))}
        </nav>

        {!collapsed && (
          <p className="px-3 pb-1 pt-5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Tools
          </p>
        )}
        <nav className="mt-1 flex flex-col gap-0.5">
          {TOOLS.map((t) => (
            <NavItem key={t.label} {...t} collapsed={collapsed} />
          ))}
        </nav>

        {!collapsed && (
          <p className="px-3 pb-1 pt-5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            API
          </p>
        )}
        <nav className="mt-1 flex flex-col gap-0.5">
          <NavItem icon={ExternalLink} label="API Dashboard" collapsed={collapsed} muted />
          <NavItem icon={ExternalLink} label="API Docs" collapsed={collapsed} muted />
        </nav>
      </div>

      {/* bottom: credits + upgrade + user */}
      <div className="mt-auto p-3">
        {!collapsed && (
          <div className="mb-3 rounded-xl border p-3">
            <p className="text-[13px] font-semibold">12 slow credits left</p>
            <p className="text-[12px] text-muted-foreground">Resets in 1 day</p>
            <Button className="mt-3 h-9 w-full gap-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">
              <Gem className="size-4" /> Upgrade
            </Button>
          </div>
        )}
        <div className={cn("flex items-center gap-2", collapsed && "justify-center")}>
          <Avatar className="size-8">
            <AvatarFallback className="bg-muted text-[11px]">A</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <>
              <span className="text-[13px] font-semibold">arturpawlowski</span>
              <Bell className="ml-auto size-4 text-muted-foreground" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── right panel (details/actions) ── */
function DetailPanel() {
  return (
    <div className="flex flex-col gap-4">
      {/* top action row */}
      <div className="flex items-center gap-2">
        <IconCircle label="Like">
          <Heart />
        </IconCircle>
        <IconCircle label="Share">
          <Share2 />
        </IconCircle>
        <IconCircle label="Download">
          <Download />
        </IconCircle>
        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="More"
                className="size-10 rounded-full bg-secondary hover:bg-secondary/70 [&_svg]:size-[18px]"
              >
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[212px]">
              <DropdownMenuItem>Copy image</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-muted-foreground">Edit</DropdownMenuLabel>
              <DropdownMenuItem>Remix</DropdownMenuItem>
              <DropdownMenuItem>Magic Fill</DropdownMenuItem>
              <DropdownMenuItem>Upscale</DropdownMenuItem>
              <DropdownMenuItem>Remove background</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-muted-foreground">Reference</DropdownMenuLabel>
              <DropdownMenuItem>Describe image</DropdownMenuItem>
              <DropdownMenuItem>Use as reference</DropdownMenuItem>
              <DropdownMenuItem>Use as style</DropdownMenuItem>
              <DropdownMenuItem>Use as character</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-muted-foreground">Manage</DropdownMenuLabel>
              <DropdownMenuItem>Add to collection</DropdownMenuItem>
              <DropdownMenuItem>Report</DropdownMenuItem>
              <DropdownMenuItem>Mute creator</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* author */}
      <div className="flex items-center gap-2">
        <Avatar className="size-10">
          <AvatarFallback className="bg-muted text-[13px]">p</AvatarFallback>
        </Avatar>
        <div className="leading-tight">
          <p className="text-[14px] font-semibold text-secondary-foreground/90">
            priscilamktdsg
          </p>
          <p className="text-[12px] text-muted-foreground">6 months ago</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="ml-1 h-[26px] rounded-md px-3 text-[12px] font-semibold"
        >
          Follow
        </Button>
      </div>

      {/* prompt tabs */}
      <div>
        <div className="flex items-center">
          <Tabs defaultValue="prompt">
            <TabsList className="h-auto gap-4 bg-transparent p-0">
              <TabsTrigger
                value="prompt"
                className="h-auto border-0 bg-transparent p-0 text-[13px] font-semibold text-foreground data-[state=inactive]:text-muted-foreground data-[state=active]:shadow-none"
              >
                Prompt
              </TabsTrigger>
              <TabsTrigger
                value="magic"
                className="h-auto border-0 bg-transparent p-0 text-[13px] font-semibold text-foreground data-[state=inactive]:text-muted-foreground data-[state=active]:shadow-none"
              >
                Magic prompt
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="ml-auto flex items-center gap-2 text-muted-foreground">
            <button aria-label="Copy prompt" className="hover:text-foreground">
              <Copy className="size-4" />
            </button>
            <button aria-label="Use prompt" className="hover:text-foreground">
              <Plus className="size-4" />
            </button>
          </div>
        </div>

        <PromptText />
      </div>

      {/* additional details */}
      <Collapsible>
        <CollapsibleTrigger className="group flex w-full items-center justify-between py-1 text-[13px] font-medium">
          View additional details
          <ChevronDown className="size-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <dl className="mt-1">
            {DETAILS.map(([k, v]) => (
              <div
                key={k}
                className="flex h-8 items-center justify-between border-b border-border/60 text-[13px] last:border-0"
              >
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="flex items-center gap-2">
                  {v}
                  {k === "Model" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 rounded-md px-2 text-[11px]"
                    >
                      Use model
                    </Button>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

function PromptText() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="mt-2">
      <p className={cn("text-[13px] leading-relaxed text-muted-foreground", !open && "line-clamp-3")}>
        {PROMPT}
      </p>
      <button
        onClick={() => setOpen((v) => !v)}
        className="mt-1 text-[12px] font-medium text-primary"
      >
        {open ? "See less" : "See more"}
      </button>
    </div>
  );
}

/* ── action buttons + open-in ── */
function ActionButtons() {
  return (
    <div className="mt-4 space-y-1.5">
      <div className="grid grid-cols-2 gap-1.5">
        {ACTIONS.map((a) => (
          <Button
            key={a.label}
            variant="outline"
            className={cn(
              "h-8 justify-center gap-1.5 rounded-lg text-[13px] font-semibold [&_svg]:size-4",
              a.label === "Layerize text" && "col-span-2",
            )}
          >
            <a.icon /> {a.label}
          </Button>
        ))}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="h-8 w-full justify-between rounded-lg bg-foreground px-3 text-[13px] font-semibold text-background hover:bg-foreground/90">
            Open image in…
            <ChevronDown className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="top" className="w-[280px]">
          <DropdownMenuItem disabled>JSON editor</DropdownMenuItem>
          <DropdownMenuItem>Prompt Builder</DropdownMenuItem>
          <DropdownMenuItem>Image Studio</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

/* ── thumbnail strip ── */
function ThumbStrip({ size = 44 }: { size?: number }) {
  return (
    <div className="flex justify-center">
      <div className="flex gap-2">
        {[0, 1, 2, 3].map((i) => (
          <button
            key={i}
            style={{ width: size, height: size }}
            className={cn(
              "shrink-0 rounded-lg bg-muted",
              i === 2 && "ring-2 ring-ring ring-offset-2 ring-offset-background",
            )}
          />
        ))}
      </div>
    </div>
  );
}

/* ── related grid ── */
function RelatedGrid() {
  return (
    <div className="mt-8 grid grid-cols-2 gap-3 min-[900px]:grid-cols-4 min-[1700px]:grid-cols-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="aspect-[3/4] rounded-md bg-muted" />
      ))}
    </div>
  );
}

/* ── page ── */
export default function ImageDetailPage() {
  const [collapsed, setCollapsed] = React.useState(false);
  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex h-screen overflow-hidden bg-background text-foreground">
        {/* sidebar — desktop */}
        <aside className="hidden shrink-0 border-r min-[900px]:block">
          <div className="relative h-full">
            <Sidebar collapsed={collapsed} />
            <button
              onClick={() => setCollapsed((v) => !v)}
              aria-label="Toggle sidebar"
              className="absolute right-2 top-5 hidden size-6 place-items-center rounded-md text-muted-foreground hover:bg-accent min-[900px]:grid"
            >
              <ChevronLeft className={cn("size-4 transition-transform", collapsed && "rotate-180")} />
            </button>
          </div>
        </aside>

        {/* main column */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {/* top bar — desktop */}
          <header className="hidden shrink-0 items-center px-6 py-4 min-[900px]:flex">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Back"
              className="size-10 shrink-0 rounded-full bg-secondary hover:bg-secondary/70"
            >
              <ArrowLeft className="size-5" />
            </Button>
            <div className="mx-auto flex h-14 w-full max-w-[859px] items-center rounded-[28px] border bg-card px-5 shadow-sm">
              <span className="text-[15px] text-muted-foreground">
                Generate new or upload &amp; edit…
              </span>
              <Button
                size="icon"
                className="ml-auto size-9 rounded-full bg-foreground text-background hover:bg-foreground/90"
                aria-label="Generate"
              >
                <ArrowUp className="size-5" />
              </Button>
            </div>
            <div className="w-10 shrink-0" />
          </header>

          {/* scroll body */}
          <main className="flex-1 overflow-y-auto">
            {/* ═══ mobile top (stacked) ═══ */}
            <div className="min-[900px]:hidden">
              <div className="flex items-center px-4 pt-4">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Back"
                  className="size-10 shrink-0 rounded-full bg-secondary hover:bg-secondary/70"
                >
                  <ArrowLeft className="size-5" />
                </Button>
                <div className="mx-auto">
                  <ThumbStrip size={32} />
                </div>
                <div className="w-10 shrink-0" />
              </div>
              {/* image full-bleed mobile / gutters tablet */}
              <div className="mt-3 px-0 min-[600px]:px-[92px]">
                <div className="mx-auto aspect-[3/4] w-full max-w-[585px] bg-muted" />
              </div>
              {/* author */}
              <div className="flex items-center gap-2 px-4 pt-4">
                <Avatar className="size-10">
                  <AvatarFallback className="bg-muted text-[13px]">p</AvatarFallback>
                </Avatar>
                <div className="leading-tight">
                  <p className="text-[14px] font-semibold">priscilamktdsg</p>
                  <p className="text-[12px] text-muted-foreground">About 6 months ago</p>
                </div>
                <Button variant="outline" size="sm" className="ml-auto h-[30px] rounded-md px-3 text-[12px] font-semibold">
                  Follow
                </Button>
              </div>
              {/* prompt + details */}
              <div className="px-4 pb-28 pt-4">
                <PromptText />
                <p className="pb-2 pt-5 text-[14px] font-semibold">Additional details</p>
                <dl>
                  {DETAILS.map(([k, v]) => (
                    <div key={k} className="flex h-8 items-center justify-between border-b border-border/60 text-[13px]">
                      <dt className="text-muted-foreground">{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="pb-3 pt-8 text-[14px] font-semibold">Similar images</p>
                <RelatedGrid />
              </div>
            </div>

            {/* ═══ desktop (two-column) ═══ */}
            <div className="hidden min-[900px]:block">
              <div className="flex gap-6 px-6 pb-6">
                {/* image column with arrows */}
                <div className="flex flex-1 items-center px-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Previous"
                    className="size-10 shrink-0 self-center rounded-full border bg-transparent"
                  >
                    <ChevronLeft className="size-5" />
                  </Button>
                  <div className="mx-auto flex flex-col items-center gap-4">
                    <div className="aspect-[3/4] h-[calc(100vh-180px)] max-h-[860px] w-auto rounded-xl bg-muted" />
                    <ThumbStrip size={44} />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Next"
                    className="size-10 shrink-0 self-center rounded-full border bg-transparent"
                  >
                    <ChevronRight className="size-5" />
                  </Button>
                </div>
                {/* right panel */}
                <div className="w-[320px] shrink-0">
                  <DetailPanel />
                  <ActionButtons />
                </div>
              </div>
              {/* related below fold */}
              <div className="px-6 pb-16">
                <RelatedGrid />
              </div>
            </div>
          </main>

          {/* ═══ mobile fixed bottom bar ═══ */}
          <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex items-center gap-2 bg-gradient-to-t from-background via-background to-transparent px-4 pb-7 pt-6 min-[900px]:hidden">
            <Button className="pointer-events-auto h-12 shrink-0 gap-1.5 rounded-full bg-foreground px-4 text-[14px] font-semibold text-background">
              Open in… <ChevronDown className="size-4" />
            </Button>
            <div className="pointer-events-auto ml-auto flex items-center gap-1.5">
              {[Download, Heart, FolderPlus, MoreHorizontal].map((Icon, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  size="icon"
                  className="size-11 shrink-0 rounded-full bg-secondary [&_svg]:size-5"
                >
                  <Icon />
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

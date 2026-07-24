"use client";

/**
 * PILOT — Ideogram single-image detail screen, rebuilt 1:1 on shadcn/ui.
 * Palette = Ideogram (CSS vars in globals.css); recolor to gallery-warm is later.
 * Image / thumbnails are neutral placeholders (we don't embed Ideogram's artwork).
 * Structural switch at 900px: stacked (mobile/tablet) ↔ two-column (desktop).
 * App-shell (sidebar, theme, ••• menu) comes from ../_shell (shared, reused).
 */

import * as React from "react";
import {
  Heart,
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
  MoreHorizontal,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AppSidebar } from "../_shell/app-sidebar";
import { ImageActionsMenu } from "../_shell/image-actions-menu";

/* ── data (placeholder content — shows what each slot holds) ── */
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
          <ImageActionsMenu
            trigger={
              <Button
                variant="ghost"
                size="icon"
                aria-label="More"
                className="size-10 rounded-full bg-secondary hover:bg-secondary/70 [&_svg]:size-[18px]"
              >
                <MoreHorizontal />
              </Button>
            }
          />
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

      {/* prompt tabs + text */}
      <PromptBlock />

      {/* additional details */}
      <Collapsible>
        <CollapsibleTrigger className="group flex w-full items-center justify-between py-1 text-[13px] font-medium">
          View additional details
          <ChevronDown className="size-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-1">
            <DetailRows />
          </div>
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

/* Prompt / Magic-prompt tabs + copy/use icons + the prompt text.
   Shared by the desktop right panel and the mobile "Image details" tab. */
function PromptBlock() {
  return (
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
  );
}

/* The key/value detail rows. Shared by desktop (inside a Collapsible) and mobile. */
function DetailRows() {
  return (
    <dl>
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
  );
}

/* ── action buttons + open-in ── */
function ActionButtons() {
  return (
    <div className="space-y-1.5">
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
  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex h-screen overflow-hidden bg-background text-foreground">
        {/* sidebar — shared app-shell */}
        <AppSidebar />

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
              {/* segmented switcher: Image details ↔ Similar images (measured 1:1). */}
              <Tabs defaultValue="details" className="gap-0 px-4 pb-28 pt-4">
                <TabsList className="flex h-auto w-fit justify-start gap-1 bg-transparent p-0">
                  <TabsTrigger
                    value="details"
                    className="h-9 rounded-[30px] border-0 px-[14px] text-[14px] font-normal text-muted-foreground data-[state=active]:bg-secondary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                  >
                    Image details
                  </TabsTrigger>
                  <TabsTrigger
                    value="similar"
                    className="h-9 rounded-[30px] border-0 px-[14px] text-[14px] font-normal text-muted-foreground data-[state=active]:bg-secondary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                  >
                    Similar images
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="mt-5">
                  <PromptBlock />
                  <p className="pb-2 pt-5 text-[14px] font-semibold">Additional details</p>
                  <DetailRows />
                </TabsContent>
                <TabsContent value="similar" className="mt-5">
                  <RelatedGrid />
                </TabsContent>
              </Tabs>
            </div>

            {/* ═══ desktop (two-column) ═══ */}
            <div className="hidden min-[900px]:block">
              <div className="flex gap-6 px-6 pb-6">
                {/* image column with arrows hugging the column edges */}
                <div className="flex min-w-0 flex-1 items-center gap-2 px-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Previous"
                    className="size-10 shrink-0 self-center rounded-full border bg-transparent"
                  >
                    <ChevronLeft className="size-5" />
                  </Button>
                  <div className="flex min-w-0 flex-1 flex-col items-center gap-4">
                    <div className="aspect-[3/4] w-full max-w-[calc(min(100vh-180px,860px)*3/4)] rounded-xl bg-muted" />
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
                {/* right panel — full-height card (1:1 Ideogram: 320 wide, radius
                    30, bg --card; content scrolls, actions pinned to the bottom). */}
                <div className="flex h-[calc(100vh-112px)] w-[320px] shrink-0 flex-col overflow-hidden rounded-[30px] bg-card">
                  <div className="min-h-0 flex-1 overflow-y-auto p-5">
                    <DetailPanel />
                  </div>
                  <div className="px-5 pb-5 pt-2">
                    <ActionButtons />
                  </div>
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
              {[
                { Icon: Heart, label: "Like" },
                { Icon: Download, label: "Download" },
                { Icon: FolderPlus, label: "Add to collection" },
              ].map(({ Icon, label }) => (
                <Button
                  key={label}
                  variant="ghost"
                  size="icon"
                  aria-label={label}
                  className="size-11 shrink-0 rounded-full bg-secondary [&_svg]:size-5"
                >
                  <Icon />
                </Button>
              ))}
              <ImageActionsMenu
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="More"
                    className="size-11 shrink-0 rounded-full bg-secondary [&_svg]:size-5"
                  >
                    <MoreHorizontal />
                  </Button>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

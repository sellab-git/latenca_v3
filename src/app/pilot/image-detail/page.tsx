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
  Sun,
  Moon,
  Monitor,
  Wand2,
  FileText,
  ImagePlus,
  Palette,
  User,
  Flag,
  VolumeX,
  Trash2,
  Code,
  LogOut,
  CircleHelp,
  MessageCircle,
  AtSign,
  Play,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
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

/* Placeholder signed-in persona — NEVER the real user's data (this screen is a
   public 1:1 pilot; the account menu is shown for structure only). */
const ACCOUNT = {
  name: "mia.rivera",
  email: "mia@example.com",
  initial: "M",
  plan: "Free",
  credits: 12,
};

/* ── theme (Light / Dark / Auto — lives in the account menu, per Ideogram) ── */
type ThemeMode = "light" | "dark" | "auto";

function isThemeMode(v: unknown): v is ThemeMode {
  return v === "light" || v === "dark" || v === "auto";
}

function useTheme() {
  // read the persisted choice lazily on the client (server → "auto"); no
  // load-then-set effect chain, so no cascading render / localStorage clobber.
  const [mode, setMode] = React.useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "auto";
    const saved = localStorage.getItem("theme");
    return isThemeMode(saved) ? saved : "auto";
  });
  // apply the resolved class + persist; Auto follows the OS and reacts live
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const dark = mode === "dark" || (mode === "auto" && mq.matches);
      document.documentElement.classList.toggle("dark", dark);
    };
    apply();
    localStorage.setItem("theme", mode);
    if (mode !== "auto") return;
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [mode]);
  return { mode, setMode };
}

const THEME_OPTIONS: { value: ThemeMode; label: string; icon: React.ElementType }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "auto", label: "Auto", icon: Monitor },
];

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

/* Segmented control — reusable pill switcher (theme, later: view/currency…).
   New design-system primitive (shadcn has no segmented control). */
function SegmentedControl<T extends string>({
  value,
  onValueChange,
  options,
}: {
  value: T;
  onValueChange: (v: T) => void;
  options: { value: T; label: string; icon: React.ElementType }[];
}) {
  return (
    <div className="flex w-full items-center gap-1 rounded-lg bg-muted p-1">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            onClick={() => onValueChange(o.value)}
            aria-pressed={active}
            className={cn(
              "flex h-7 flex-1 items-center justify-center gap-1.5 rounded-md text-[12px] font-medium transition-colors",
              active
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <o.icon className="size-3.5" />
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/* The image `•••` overflow menu — icons on every item + submenus (Add to
   collection ▸, Report ▸). Shared by the desktop panel and the mobile bar so
   the block is authored once. Icons are the closest Lucide match to Ideogram's. */
function ImageActionsMenu({ trigger }: { trigger: React.ReactNode }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[236px]">
        <DropdownMenuItem>
          <Copy /> Copy image
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Edit</DropdownMenuLabel>
        <DropdownMenuItem>
          <Shuffle /> Remix
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Wand2 /> Magic Fill
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Maximize2 /> Upscale
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Eraser /> Remove background
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Reference</DropdownMenuLabel>
        <DropdownMenuItem>
          <FileText /> Describe image
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ImagePlus /> Use as reference
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Palette /> Use as style
        </DropdownMenuItem>
        <DropdownMenuItem>
          <User /> Use as character
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Manage</DropdownMenuLabel>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <FolderPlus /> Add to collection
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-[180px]">
            <DropdownMenuItem>
              <Plus /> New collection…
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Inspiration</DropdownMenuItem>
            <DropdownMenuItem>Wall art</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Flag /> Report
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-[196px]">
            <DropdownMenuItem>Inappropriate content</DropdownMenuItem>
            <DropdownMenuItem>Spam or misleading</DropdownMenuItem>
            <DropdownMenuItem>Copyright violation</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem>
          <VolumeX /> Mute creator
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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
        "flex h-9 w-full items-center rounded-md px-3 text-[13px] font-semibold hover:bg-accent",
        muted ? "text-muted-foreground" : "text-foreground",
        collapsed && "justify-center px-0",
      )}
    >
      <Icon className="size-5 shrink-0" strokeWidth={1.75} />
      {!collapsed && (
        <>
          {/* tight gaps + snug badge so "Prompt Builder" fits even when the
              sidebar scrollbar is present (steals ~15px of content width). */}
          <span className="ml-2 min-w-0 truncate">{label}</span>
          {badge && (
            <Badge className="ml-1 h-4 shrink-0 rounded bg-primary px-0.5 text-[10px] font-semibold text-primary-foreground">
              {badge}
            </Badge>
          )}
        </>
      )}
    </button>
  );
}

/* ── sidebar (desktop) ── */
function Sidebar({
  collapsed,
  mode,
  onModeChange,
}: {
  collapsed: boolean;
  mode: ThemeMode;
  onModeChange: (m: ThemeMode) => void;
}) {
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
        {/* account + notifications — TWO controls (1:1 Ideogram). Account opens
            the rich menu (identity, plan, actions, segmented theme); the bell is
            its own notifications button. */}
        <div className={cn("flex items-center gap-1", collapsed && "flex-col")}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                aria-label="Account menu"
                className={cn(
                  "flex min-w-0 flex-1 items-center gap-2 rounded-lg px-1 py-1 hover:bg-accent",
                  collapsed && "flex-none justify-center px-0",
                )}
              >
                <Avatar className="size-8">
                  <AvatarFallback className="bg-muted text-[11px]">
                    {ACCOUNT.initial}
                  </AvatarFallback>
                </Avatar>
                {!collapsed && (
                  <span className="min-w-0 truncate text-[13px] font-semibold">
                    {ACCOUNT.name}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="top" className="w-[264px]">
              {/* identity */}
              <div className="flex items-center gap-2 p-1.5">
                <Avatar className="size-9">
                  <AvatarFallback className="bg-muted text-[13px]">
                    {ACCOUNT.initial}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 leading-tight">
                  <p className="truncate text-[13px] font-semibold">{ACCOUNT.name}</p>
                  <p className="truncate text-[12px] text-muted-foreground">
                    {ACCOUNT.email}
                  </p>
                </div>
              </div>
              {/* plan + credits */}
              <div className="flex items-center gap-1.5 px-1.5 pb-2 text-[13px]">
                <span className="font-semibold">{ACCOUNT.plan}</span>
                <span className="text-muted-foreground">·</span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Gem className="size-3.5" /> {ACCOUNT.credits} credits left
                </span>
              </div>
              <div className="px-1 pb-1">
                <Button className="h-9 w-full gap-1.5 rounded-lg bg-foreground text-background hover:bg-foreground/90">
                  <Gem className="size-4" /> Upgrade plan
                </Button>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User /> View profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CircleHelp /> Help &amp; documentation
              </DropdownMenuItem>
              <DropdownMenuItem>
                <VolumeX /> Manage muted users
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Code /> API
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive">
                <Trash2 /> Delete account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut /> Log out
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* theme lives here as a segmented control (per Ideogram) */}
              <div className="p-1.5">
                <SegmentedControl
                  value={mode}
                  onValueChange={onModeChange}
                  options={THEME_OPTIONS}
                />
              </div>
              <DropdownMenuSeparator />
              <div className="flex items-center gap-3 px-2 py-1 text-[11px] text-muted-foreground">
                <button className="hover:text-foreground">Terms</button>
                <button className="hover:text-foreground">Privacy</button>
                <div className="ml-auto flex items-center gap-0.5">
                  {[MessageCircle, AtSign, Play].map((Icon, i) => (
                    <button
                      key={i}
                      aria-label="Social link"
                      className="grid size-6 place-items-center rounded-md hover:bg-accent hover:text-foreground [&_svg]:size-3.5"
                    >
                      <Icon />
                    </button>
                  ))}
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Notifications"
                className={cn(
                  "size-9 shrink-0 rounded-lg text-muted-foreground hover:bg-accent [&_svg]:size-4",
                  collapsed && "size-8",
                )}
              >
                <Bell />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Notifications</TooltipContent>
          </Tooltip>
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
  const [collapsed, setCollapsed] = React.useState(false);
  const { mode, setMode } = useTheme();
  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex h-screen overflow-hidden bg-background text-foreground">
        {/* sidebar — desktop */}
        <aside className="hidden shrink-0 border-r min-[900px]:block">
          <div className="relative h-full">
            <Sidebar collapsed={collapsed} mode={mode} onModeChange={setMode} />
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
              {/* segmented switcher: Image details ↔ Similar images.
                  Measured 1:1 off live Ideogram mobile: left-aligned, h36, radius 30,
                  px 14, 14px/400, active = --secondary pill / --foreground text. */}
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
                {/* image column with arrows — arrows hug the column edges,
                    image centered between them (gap grows on wide screens, per spec). */}
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
                    {/* width fills the column but is capped so height never exceeds
                        min(100vh-180, 860); this prevents overflow at 1024 and keeps
                        the 1440/1920 sizes identical to before. */}
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

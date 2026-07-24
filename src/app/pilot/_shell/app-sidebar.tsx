"use client";

/**
 * Shared app-shell sidebar (desktop). Owns its own collapse state and theme, so
 * a page just drops in <AppSidebar />. Rebuilt 1:1 from Ideogram's shell:
 * logo, workspace switcher, nav + Tools + API groups, credits/Upgrade, and a
 * bottom row of TWO controls (account menu + notifications bell). Account menu
 * carries identity, plan, actions and the segmented Light/Dark/Auto theme.
 * Persona is a placeholder — never the real user's data.
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
  ExternalLink,
  Bell,
  Gem,
  User,
  CircleHelp,
  VolumeX,
  Code,
  Trash2,
  LogOut,
  MessageCircle,
  AtSign,
  Play,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme, THEME_OPTIONS } from "./theme";
import { SegmentedControl } from "./segmented-control";

/* placeholder signed-in persona — NEVER the real user's data */
const ACCOUNT = {
  name: "mia.rivera",
  email: "mia@example.com",
  initial: "M",
  plan: "Free",
  credits: 12,
};

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

function NavItem({
  icon: Icon,
  label,
  badge,
  collapsed,
  muted,
  active,
}: {
  icon: React.ElementType;
  label: string;
  badge?: string;
  collapsed?: boolean;
  muted?: boolean;
  active?: boolean;
}) {
  return (
    <button
      className={cn(
        "flex h-9 w-full items-center rounded-md px-3 text-[13px] font-semibold hover:bg-accent",
        muted ? "text-muted-foreground" : "text-foreground",
        active && "bg-accent",
        collapsed && "justify-center px-0",
      )}
    >
      <Icon className="size-5 shrink-0" strokeWidth={1.75} />
      {!collapsed && (
        <>
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

function SidebarInner({
  collapsed,
  activeNav,
}: {
  collapsed: boolean;
  activeNav?: string;
}) {
  const { mode, setMode } = useTheme();
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
        {/* workspace switcher */}
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
            <NavItem
              key={n.label}
              {...n}
              collapsed={collapsed}
              active={activeNav === n.label}
            />
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

      {/* bottom: credits + upgrade + account/bell */}
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

        {/* account + notifications — TWO controls (1:1 Ideogram) */}
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
              <div className="p-1.5">
                <SegmentedControl
                  value={mode}
                  onValueChange={setMode}
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

/** Full desktop sidebar aside with the collapse toggle. Drop into a page shell. */
export function AppSidebar({ activeNav }: { activeNav?: string }) {
  const [collapsed, setCollapsed] = React.useState(false);
  return (
    <aside className="hidden shrink-0 border-r min-[900px]:block">
      <div className="relative h-full">
        <SidebarInner collapsed={collapsed} activeNav={activeNav} />
        <button
          onClick={() => setCollapsed((v) => !v)}
          aria-label="Toggle sidebar"
          className="absolute right-2 top-5 hidden size-6 place-items-center rounded-md text-muted-foreground hover:bg-accent min-[900px]:grid"
        >
          <ChevronLeft className={cn("size-4 transition-transform", collapsed && "rotate-180")} />
        </button>
      </div>
    </aside>
  );
}

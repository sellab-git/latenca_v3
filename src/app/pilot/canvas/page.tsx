"use client";

/**
 * PILOT — Ideogram Canvas (/canvas), LIGHT rebuild. We take the reusable
 * primitives — the vertical tool rail and the floating zoom/history cluster —
 * plus the shared composer and a blank canvas; the full editor behavior is out
 * of scope (our wall-builder will lean on Mixtiles, not this). Palette = Ideogram.
 */

import {
  Menu,
  Pencil,
  Wand2,
  Expand,
  Shuffle,
  MousePointer2,
  Hand,
  Type,
  ImagePlus,
  Download,
  Lock,
  Undo2,
  Redo2,
  CloudCheck,
  Minus,
  Plus,
  ChevronDown,
  Zap,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Composer } from "../_shell/composer";

/* ── tool rail button (icon + label, active / locked states) ── */
function ToolBtn({
  icon: Icon,
  label,
  active,
  locked,
}: {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  locked?: boolean;
}) {
  return (
    <button className="flex w-full flex-col items-center gap-1 text-[10px] font-medium">
      <span
        className={cn(
          "relative grid size-9 place-items-center rounded-lg [&_svg]:size-5",
          active ? "bg-secondary text-foreground" : "text-foreground hover:bg-accent",
        )}
      >
        <Icon />
        {locked && (
          <Lock className="absolute -right-0.5 -top-0.5 size-3 text-muted-foreground" />
        )}
      </span>
      <span className={active ? "text-foreground" : "text-muted-foreground"}>
        {label}
      </span>
    </button>
  );
}

function ZoomBtn({
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
          className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground [&_svg]:size-4"
        >
          <Icon />
        </button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function RailDivider() {
  return <div className="my-1 h-px w-8 bg-border" />;
}

/* ── page ── */
export default function CanvasPage() {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex h-screen overflow-hidden bg-background text-foreground">
        {/* left tool rail */}
        <aside className="flex w-[78px] shrink-0 flex-col items-center gap-1 border-r px-2 py-3">
          <div className="mb-2 flex flex-col items-center gap-2">
            <div className="size-8 rounded-md bg-foreground" />
            <button
              aria-label="Menu"
              className="grid size-8 place-items-center rounded-md text-foreground hover:bg-accent [&_svg]:size-5"
            >
              <Menu />
            </button>
          </div>
          <ToolBtn icon={Pencil} label="Generate" active />
          <ToolBtn icon={Wand2} label="Magic Fill" locked />
          <ToolBtn icon={Expand} label="Extend" locked />
          <ToolBtn icon={Shuffle} label="Remix" />
          <RailDivider />
          <ToolBtn icon={MousePointer2} label="Select" active />
          <ToolBtn icon={Hand} label="Hand" />
          <ToolBtn icon={Type} label="Text" />
          <RailDivider />
          <ToolBtn icon={ImagePlus} label="Add image" />
          <ToolBtn icon={Download} label="Download" />
        </aside>

        {/* canvas surface */}
        <div className="relative flex-1 overflow-hidden">
          {/* top composer (centered, floating) */}
          <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center px-4 pt-4">
            <Composer className="pointer-events-auto w-full max-w-[760px] border-0 shadow-none" />
          </div>

          {/* top-right upgrade */}
          <div className="absolute right-4 top-4">
            <Button className="h-9 gap-1.5 rounded-full bg-destructive/15 px-3 text-[13px] font-semibold text-destructive hover:bg-destructive/25 [&_svg]:size-4">
              <Zap /> 12 Upgrade
            </Button>
          </div>

          {/* bottom-right zoom / history cluster */}
          <div className="absolute bottom-4 right-4 flex items-center gap-0.5 rounded-xl border bg-card p-1 shadow-sm">
            <ZoomBtn icon={Undo2} label="Undo" />
            <ZoomBtn icon={Redo2} label="Redo" />
            <span
              className="mx-1 grid place-items-center text-muted-foreground [&_svg]:size-4"
              aria-label="Saved"
            >
              <CloudCheck />
            </span>
            <div className="mx-0.5 h-5 w-px bg-border" />
            <ZoomBtn icon={Minus} label="Zoom out" />
            <button className="flex h-8 items-center gap-1 rounded-md px-2 text-[13px] font-medium hover:bg-accent">
              100% <ChevronDown className="size-3.5" />
            </button>
            <ZoomBtn icon={Plus} label="Zoom in" />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

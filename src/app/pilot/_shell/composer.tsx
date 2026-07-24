"use client";

/**
 * Shared generation composer bar (Home hero + Canvas top). Placeholder input,
 * settings, and a control row (attach, model / count / aspect pills, Auto,
 * public, save-to, generate). Wrap-friendly on narrow screens. Reused so the
 * block is authored once.
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
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

export function Composer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-[28px] border bg-card p-4 text-left shadow-sm",
        className,
      )}
    >
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
  );
}

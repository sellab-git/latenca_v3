"use client";

/**
 * PILOT — Ideogram Styles (/styles), rebuilt 1:1 on shadcn/ui.
 * Title + Explore/My-styles tabs + a grid of selectable named style cards
 * (square preview + author + name), with a "Create new style" tile first.
 * This selectable named-card grid is the seed of our collections / shop-by-theme
 * browse. App-shell reused from ../_shell. Palette = Ideogram; recolor later.
 */

import * as React from "react";
import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "../_shell/app-sidebar";
import { MobileNav } from "../_shell/mobile-nav";

/* ── data (placeholder) ── */
const TABS = ["Explore", "My styles"];
const STYLES = [
  "Dramatic Cinema",
  "C4D Cartoon",
  "Halftone Print",
  "Watercolor",
  "Spotlight 80s",
  "90s Nostalgia",
  "Abstract Organic",
  "Analog Nostalgia",
  "Coloring Book I",
  "Children's Book",
  "Golden Hour",
  "Vintage Geo",
  "Pop Art",
  "Oil Painting",
  "Editorial",
];

/* ── style card (seed of a selectable named collection card) ── */
function StyleCard({ name }: { name: string }) {
  return (
    <button className="group flex flex-col text-left">
      <div className="aspect-square overflow-hidden rounded-xl bg-muted">
        <div className="size-full transition-transform duration-200 group-hover:scale-[1.03]" />
      </div>
      <span className="mt-2 text-[12px] text-muted-foreground">Ideogram</span>
      <span className="text-[14px] font-semibold leading-tight">{name}</span>
    </button>
  );
}

/* ── page ── */
export default function StylesPage() {
  const [tab, setTab] = React.useState("Explore");
  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex h-screen overflow-hidden bg-background text-foreground">
        <AppSidebar activeNav="Styles" />

        <main className="flex-1 overflow-y-auto">
          <div className="px-6 pb-24 pt-8 min-[900px]:pb-10">
            <h1 className="text-[28px] font-semibold tracking-tight">Styles</h1>

            {/* tabs */}
            <div className="mt-4 flex items-center gap-1">
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    "h-8 rounded-full px-3 text-[14px] font-medium transition-colors",
                    tab === t
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* grid */}
            <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-5 min-[700px]:grid-cols-3 min-[1100px]:grid-cols-4 min-[1700px]:grid-cols-5">
              {/* create new style */}
              <button className="flex flex-col text-left">
                <div className="grid aspect-square place-items-center rounded-xl bg-muted text-muted-foreground transition-colors hover:bg-accent">
                  <Plus className="size-7" />
                </div>
                <span className="mt-2 text-[14px] font-semibold leading-tight">
                  Create new style
                </span>
              </button>
              {STYLES.map((name) => (
                <StyleCard key={name} name={name} />
              ))}
            </div>
          </div>
        </main>

        <MobileNav active="Tools" />
      </div>
    </TooltipProvider>
  );
}

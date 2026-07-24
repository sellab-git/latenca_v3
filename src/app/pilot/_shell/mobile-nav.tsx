"use client";

/**
 * Mobile bottom navigation (shown < 900px), rebuilt 1:1 from Ideogram mobile:
 * a 60px fixed bar with five slots — Home, Library, a center Create (+) button,
 * Tools, and Account (avatar). Shared across browse screens (Home, Styles…).
 * Persona avatar is a placeholder — never the real user's data.
 */

import { Home, Library, LayoutGrid, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function NavBtn({
  icon: Icon,
  label,
  active,
}: {
  icon: React.ElementType;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={cn(
        "flex h-full flex-1 flex-col items-center justify-center gap-1 text-[10px] font-medium",
        active ? "text-foreground" : "text-muted-foreground",
      )}
    >
      <Icon className="size-6" strokeWidth={active ? 2.25 : 1.75} />
      {label}
    </button>
  );
}

export function MobileNav({ active }: { active?: string }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex h-[60px] items-stretch bg-background min-[900px]:hidden">
      <NavBtn icon={Home} label="Home" active={active === "Home"} />
      <NavBtn icon={Library} label="Library" active={active === "Library"} />
      {/* center Create (+) */}
      <div className="flex flex-1 items-center justify-center">
        <button
          aria-label="Create"
          className="grid size-11 place-items-center rounded-full bg-foreground text-background hover:bg-foreground/90"
        >
          <Plus className="size-6" />
        </button>
      </div>
      <NavBtn icon={LayoutGrid} label="Tools" active={active === "Tools"} />
      <button
        className={cn(
          "flex h-full flex-1 flex-col items-center justify-center gap-1 text-[10px] font-medium",
          active === "Account" ? "text-foreground" : "text-muted-foreground",
        )}
        aria-label="Account"
      >
        <Avatar className="size-6">
          <AvatarFallback className="bg-muted text-[9px]">M</AvatarFallback>
        </Avatar>
        Account
      </button>
    </nav>
  );
}

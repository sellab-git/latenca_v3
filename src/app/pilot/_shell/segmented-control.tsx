"use client";

/**
 * Segmented control — reusable pill switcher (theme today; later view/currency…).
 * shadcn has no segmented control, so this is a new design-system primitive.
 */

import { cn } from "@/lib/utils";

export function SegmentedControl<T extends string>({
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

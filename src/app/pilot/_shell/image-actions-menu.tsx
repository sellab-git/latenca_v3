"use client";

/**
 * The image `•••` overflow menu — icons on every item + submenus (Add to
 * collection ▸, Report ▸). Shared by the image-detail panel and the mobile bar,
 * and reusable on any image/product card. Icons are the closest Lucide match to
 * Ideogram's; submenu leaf items (collections, report reasons) are placeholders.
 */

import * as React from "react";
import {
  Copy,
  Shuffle,
  Wand2,
  Maximize2,
  Eraser,
  FileText,
  ImagePlus,
  Palette,
  User,
  FolderPlus,
  Plus,
  Flag,
  VolumeX,
} from "lucide-react";

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

export function ImageActionsMenu({ trigger }: { trigger: React.ReactNode }) {
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

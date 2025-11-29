import React from "react";
import { BottomBarLink } from "@/types/common";
import {
    ScrollText,
    Plus,
    Heart,
    UserRound,
  } from "lucide-react";

export const BOTTOM_BAR_LINKS: BottomBarLink[] = [
        {
          title: "Confessions",
          icon: React.createElement(ScrollText, { strokeWidth: 2, className: "h-full w-full text-neutral-500 dark:text-neutral-300" }),
          iconFilled: React.createElement(ScrollText, { strokeWidth: 2, fill: "currentColor", className: "h-full w-full text-primary" }),
          href: "/",
        },
        {
          title: "Post",
          icon: React.createElement(Plus, { strokeWidth: 2, className: "h-full w-full text-neutral-500 dark:text-neutral-300" }),
          iconFilled: React.createElement(Plus, { strokeWidth: 2.5, fill: "currentColor", className: "h-full w-full text-primary" }),
          href: "/post",
        },
        {
          title: "Match",
          icon: React.createElement(Heart, { strokeWidth: 2, className: "h-full w-full text-neutral-500 dark:text-neutral-300" }),
          iconFilled: React.createElement(Heart, { strokeWidth: 2, fill: "currentColor", className: "h-full w-full text-primary" }),
          href: "/discover",
        },
        {
          title: "Profile",
          icon: React.createElement(UserRound, { strokeWidth: 2, className: "h-full w-full text-neutral-500 dark:text-neutral-300" }),
          iconFilled: React.createElement(UserRound, { strokeWidth: 2, fill: "currentColor", className: "h-full w-full text-primary" }),
          href: "/profile",
        }
]
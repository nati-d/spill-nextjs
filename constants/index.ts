import React from "react";
import { BottomBarLink } from "@/types/common";
import {
    Github,
    X,
    Home,
    BadgeCent,
  } from "lucide-react";

export const BOTTOM_BAR_LINKS: BottomBarLink[] = [
        {
          title: "Home",
          icon: React.createElement(Home, { className: "h-full w-full text-neutral-500 dark:text-neutral-300" }),
          href: "#",
        },
        {
          title: "Components",
          icon: React.createElement(BadgeCent, { className: "h-full w-full text-neutral-500 dark:text-neutral-300" }),
          href: "#",
        },
        {
          title: "Aceternity UI",
          icon: React.createElement("img", { 
            src: "https://assets.aceternity.com/logo-dark.png", 
            width: 20, 
            height: 20, 
            alt: "Aceternity Logo" 
          }),
          href: "#",
        },
        {
          title: "Twitter",
          icon: React.createElement(X, { className: "h-full w-full text-neutral-500 dark:text-neutral-300" }),
          href: "#",
        },
        {
          title: "GitHub",
          icon: React.createElement(Github, { className: "h-full w-full text-neutral-500 dark:text-neutral-300" }),
          href: "#",
        }
]
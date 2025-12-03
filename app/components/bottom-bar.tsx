import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import { BOTTOM_BAR_LINKS } from "@/constants";

export function BottomBar() {
  
  return (
    <div className="fixed bottom-2 left-2 right-2 z-50 flex items-center justify-center p-1 bg-transparent  backdrop-blur-sm">
      <FloatingDock
        items={BOTTOM_BAR_LINKS}
      />
    </div>
  );
}

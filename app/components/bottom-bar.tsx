import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import { BOTTOM_BAR_LINKS } from "@/constants";

export function BottomBar() {
  
  return (
    <div className="fixed bottom-2 left-2 right-2 z-50 flex items-center justify-center p-1 bg-gray-100 rounded-4xl  ">
      <FloatingDock
        items={BOTTOM_BAR_LINKS}
      />
    </div>
  );
}

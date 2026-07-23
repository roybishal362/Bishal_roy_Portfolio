"use client";

import { useEffect } from "react";
import fluidCursor from "@/hooks/use-FluidCursor";

// Colorful WebGL fluid-cursor (Pavel Dobryakov's fluid sim, MIT). Renders behind
// the content and paints liquid light trails wherever the pointer moves.
export default function FluidCursor() {
  useEffect(() => {
    try {
      fluidCursor();
    } catch {
      /* no WebGL2 — silently skip; the rest of the page is unaffected */
    }
  }, []);

  return (
    <div className="fluid-holder" aria-hidden>
      <canvas id="fluid" className="fluid-canvas" />
    </div>
  );
}

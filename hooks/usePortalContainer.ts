import { useEffect, useState } from "react";

/**
 * Resolves a DOM node by CSS selector, safely under SSR.
 *
 * The lookup only ever runs inside `useEffect`, i.e. after hydration on the
 * client — never during `next build` prerendering, where `document` doesn't
 * exist. Returns `null` on the server and on the very first client render;
 * callers should have a sensible fallback for that (e.g. `BottomSheet`'s
 * `container` prop already falls back to `document.body` when given `null`).
 */
export function usePortalContainer(selector: string = ".root"): HTMLElement | null {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setContainer(document.querySelector<HTMLElement>(selector));
  }, [selector]);

  return container;
}
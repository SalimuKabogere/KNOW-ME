"use client";

import { useEffect, useLayoutEffect } from "react";

// Avoid the SSR warning when using layout effects in Next.js.
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

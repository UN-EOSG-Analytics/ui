"use client";

import * as React from "react";

/**
 * The UN 2.0 corner mark — a triangular badge that slides into the bottom-left
 * corner after the page settles, with the roundel rolling in behind it.
 *
 * Appears in four products. Two of them (open, system-chart) put the keyframes
 * in `globals.css`, where they are dead weight on every page that never renders
 * the logo; transcripts scopes them to the component. This is transcripts'
 * approach, with one thing fixed.
 *
 * THE FIX: it now honours `prefers-reduced-motion` itself. The products that
 * had it relied on a global reduced-motion block in their own `globals.css` —
 * fine there, but a component that ships to other apps cannot assume the host
 * has one. A slide-and-spin entrance is exactly what that preference is for.
 */

const KEYFRAMES = `
  @keyframes un-corner-slide-in {
    0%   { opacity: 0; transform: translateX(-120px); }
    100% { opacity: 1; transform: translateX(0); }
  }
  @keyframes un-two-zero-roll-in {
    0%   { opacity: 0;   transform: translateX(-60px) rotate(-360deg) scale(0.3); }
    70%  { opacity: 0.8; transform: translateX(0)     rotate(0deg)    scale(1.1); }
    100% { opacity: 1;   transform: translateX(0)     rotate(0deg)    scale(1);   }
  }
  .un-corner-hidden    { opacity: 0; transform: translateX(-120px); }
  .un-corner-entrance  { animation: un-corner-slide-in 0.8s ease-out forwards; opacity: 0; }
  .un-roundel-hidden   { opacity: 0; transform: translateX(-60px) rotate(-360deg) scale(0.3); }
  .un-roundel-entrance { animation: un-two-zero-roll-in 1s ease-out forwards; opacity: 0; }

  @media (prefers-reduced-motion: reduce) {
    .un-corner-entrance,
    .un-roundel-entrance { animation: none; opacity: 1; transform: none; }
    .un-corner-hidden,
    .un-roundel-hidden   { opacity: 1; transform: none; }
  }
`;

export interface AnimatedCornerLogoProps {
  /** Accessible name for the link. Translated by the caller. */
  label: string;
  /** Translated "opens in new tab" suffix. */
  newTabLabel?: string;
  href?: string;
  /** Where the corner SVG lives. Override when served from a subpath. */
  src?: string;
  /** ms before the corner slides in, and before the roundel rolls in. */
  delays?: { corner: number; roundel: number };
  className?: string;
}

export function AnimatedCornerLogo({
  label,
  newTabLabel = "opens in new tab",
  href = "https://un-two-zero.network/",
  src = "/images/un-two-zero-corner.svg",
  delays = { corner: 1500, roundel: 2500 },
  className,
}: AnimatedCornerLogoProps) {
  const [cornerClass, setCornerClass] = React.useState("un-corner-hidden");
  const [roundelClass, setRoundelClass] = React.useState("un-roundel-hidden");

  React.useEffect(() => {
    const a = setTimeout(() => setCornerClass("un-corner-entrance"), delays.corner);
    const b = setTimeout(() => setRoundelClass("un-roundel-entrance"), delays.roundel);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, [delays.corner, delays.roundel]);

  return (
    <>
      <style>{KEYFRAMES}</style>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${label} (${newTabLabel})`}
        // Clipped to the lower-left triangle so the square asset reads as a
        // corner fold rather than a floating badge. Hidden below md: it would
        // sit on top of content on a phone.
        className={`fixed bottom-0 left-0 z-30 hidden cursor-pointer transition-opacity [clip-path:polygon(0_0,0_100%,100%_100%)] hover:opacity-80 md:block ${cornerClass} ${className ?? ""}`}
      >
        <img
          src={src}
          alt=""
          width={123}
          height={123}
          className={`select-none ${roundelClass}`}
        />
      </a>
    </>
  );
}

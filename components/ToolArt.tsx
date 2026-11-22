import type { ReactNode } from "react";
import type { ToolTypeId } from "@/lib/types";

// Hand-drawn flat illustrations, one per tool type. `c` is the brand colour.

const D = "#27302e"; // dark housing, rubber, grips
const S = "#98a39f"; // steel
const L = "#dfe4e1"; // light details
const R = "#c2362b"; // laser

function drill(c: string, opts: { cordless: boolean; nose: "chuck" | "hex" | "long"; sideHandle: boolean }) {
  return (
    <>
      {opts.nose === "long" ? (
        <rect x="150" y="53" width="44" height="7" rx="2" fill={S} />
      ) : opts.nose === "hex" ? (
        <rect x="140" y="54" width="22" height="6" rx="1" fill={S} />
      ) : (
        <rect x="150" y="54" width="34" height="5" rx="1" fill={S} />
      )}
      {opts.nose === "hex" ? (
        <rect x="126" y="48" width="16" height="18" rx="3" fill={D} />
      ) : (
        <path d="M128 44h16l8 6v14l-8 6h-16z" fill={D} />
      )}
      <rect x="44" y="38" width="88" height="38" rx="9" fill={c} />
      <rect x="40" y="43" width="12" height="28" rx="4" fill={D} />
      <path d="M64 74h32l-7 52H58z" fill={c} />
      <rect x="96" y="79" width="9" height="15" rx="3" fill={D} />
      <path d="M62 46h22M62 53h22M62 60h22" stroke={D} strokeWidth="3" strokeLinecap="round" opacity=".45" />
      {opts.sideHandle && <rect x="114" y="74" width="10" height="34" rx="4" fill={D} />}
      {opts.cordless ? (
        <rect x="48" y="122" width="58" height="18" rx="4" fill={D} />
      ) : (
        <path d="M72 126c0 14-14 6-22 16" stroke={D} strokeWidth="5" fill="none" strokeLinecap="round" />
      )}
    </>
  );
}

function art(type: ToolTypeId, c: string): ReactNode {
  switch (type) {
    case "hammer-drill":
      return drill(c, { cordless: false, nose: "chuck", sideHandle: true });
    case "drill-driver":
      return drill(c, { cordless: true, nose: "chuck", sideHandle: false });
    case "rotary-hammer":
      return drill(c, { cordless: false, nose: "long", sideHandle: true });
    case "impact-driver":
      return drill(c, { cordless: true, nose: "hex", sideHandle: false });

    case "angle-grinder":
      return (
        <>
          <path d="M22 72c-10 0-14 8-18 18" stroke={D} strokeWidth="5" fill="none" strokeLinecap="round" />
          <rect x="20" y="56" width="118" height="32" rx="15" fill={c} />
          <rect x="128" y="48" width="38" height="44" rx="7" fill={D} />
          <rect x="142" y="18" width="11" height="34" rx="5" fill={D} />
          <path d="M108 96a40 12 0 0 1 80 0z" fill={c} />
          <ellipse cx="148" cy="101" rx="44" ry="8" fill={S} />
          <ellipse cx="148" cy="101" rx="8" ry="2.5" fill={D} />
          <path d="M40 66h34M40 78h34" stroke={D} strokeWidth="3" strokeLinecap="round" opacity=".45" />
        </>
      );
    case "orbital-sander":
      return (
        <>
          <rect x="134" y="74" width="34" height="15" rx="4" fill={D} />
          <rect x="60" y="56" width="80" height="50" rx="16" fill={c} />
          <rect x="74" y="30" width="52" height="32" rx="14" fill={c} />
          <rect x="82" y="38" width="36" height="8" rx="4" fill={D} opacity=".5" />
          <rect x="52" y="104" width="96" height="9" rx="3" fill={D} />
          <rect x="52" y="113" width="96" height="6" rx="2" fill={S} />
        </>
      );
    case "belt-sander":
      return (
        <>
          <path d="M62 62c0-36 62-36 62 0" stroke={D} strokeWidth="10" fill="none" strokeLinecap="round" />
          <rect x="36" y="58" width="128" height="42" rx="8" fill={c} />
          <circle cx="150" cy="52" r="11" fill={D} />
          <rect x="30" y="96" width="140" height="24" rx="12" fill={D} />
          <circle cx="42" cy="108" r="7" fill={S} />
          <circle cx="158" cy="108" r="7" fill={S} />
          <path d="M54 70h40M54 80h40" stroke={D} strokeWidth="3" strokeLinecap="round" opacity=".45" />
        </>
      );
    case "bench-grinder":
      return (
        <>
          <circle cx="50" cy="78" r="30" fill={S} />
          <circle cx="150" cy="78" r="30" fill={S} />
          <path d="M18 78a32 32 0 0 1 64 0z" fill={D} />
          <path d="M118 78a32 32 0 0 1 64 0z" fill={D} />
          <rect x="66" y="50" width="68" height="58" rx="12" fill={c} />
          <rect x="60" y="108" width="80" height="10" rx="2" fill={D} />
          <rect x="48" y="118" width="104" height="10" rx="3" fill={D} />
          <rect x="88" y="84" width="24" height="12" rx="3" fill={D} opacity=".6" />
        </>
      );

    case "circular-saw":
      return (
        <>
          <path d="M92 44c0-34 66-34 66 8" stroke={D} strokeWidth="10" fill="none" strokeLinecap="round" />
          <circle cx="98" cy="88" r="42" fill={S} />
          <circle cx="98" cy="88" r="6" fill={D} />
          <path d="M50 90a48 48 0 0 1 96 0z" fill={c} />
          <rect x="112" y="52" width="44" height="30" rx="7" fill={D} />
          <rect x="28" y="116" width="148" height="8" rx="2" fill={D} />
        </>
      );
    case "jigsaw":
      return (
        <>
          <path d="M66 64c0-36 70-36 70 0" stroke={c} strokeWidth="12" fill="none" strokeLinecap="round" />
          <rect x="52" y="58" width="96" height="38" rx="9" fill={c} />
          <rect x="136" y="62" width="16" height="34" rx="3" fill={D} />
          <rect x="40" y="98" width="118" height="7" rx="2" fill={D} />
          <path d="M141 105h7v30l-7-6z" fill={S} />
          <path d="M64 70h36M64 80h36" stroke={D} strokeWidth="3" strokeLinecap="round" opacity=".45" />
        </>
      );
    case "recip-saw":
      return (
        <>
          <path d="M46 62C10 58 8 104 44 96" stroke={c} strokeWidth="11" fill="none" strokeLinecap="round" />
          <rect x="36" y="56" width="92" height="34" rx="11" fill={c} />
          <rect x="124" y="60" width="24" height="26" rx="4" fill={D} />
          <path d="M148 69l46 2v8h-46z" fill={S} />
          <rect x="50" y="92" width="46" height="20" rx="4" fill={D} />
          <path d="M70 66h34M70 76h34" stroke={D} strokeWidth="3" strokeLinecap="round" opacity=".45" />
        </>
      );
    case "mitre-saw":
      return (
        <>
          <path d="M150 118l-22-56" stroke={D} strokeWidth="11" strokeLinecap="round" />
          <circle cx="100" cy="76" r="34" fill={S} />
          <circle cx="100" cy="76" r="5" fill={D} />
          <path d="M60 78a40 40 0 0 1 80 0z" fill={c} />
          <rect x="52" y="20" width="56" height="11" rx="5" fill={D} />
          <rect x="76" y="28" width="9" height="16" fill={D} />
          <rect x="24" y="106" width="152" height="7" rx="2" fill={S} />
          <rect x="24" y="113" width="152" height="18" rx="3" fill={D} />
        </>
      );

    case "hammer":
      return (
        <>
          <rect x="93" y="36" width="14" height="60" rx="3" fill={S} />
          <rect x="90" y="84" width="20" height="58" rx="8" fill={c} />
          <path d="M94 100h12M94 110h12M94 120h12" stroke={D} strokeWidth="3" strokeLinecap="round" opacity=".45" />
          <path d="M70 16h66v26H70z" fill={D} />
          <rect x="132" y="12" width="14" height="34" rx="3" fill={D} />
          <path d="M72 16C52 14 42 26 38 42l10 2c4-9 12-12 24-4z" fill={D} />
        </>
      );
    case "screwdriver-set":
      return (
        <>
          {[
            { x: 58, top: 30, len: 50 },
            { x: 100, top: 14, len: 66 },
            { x: 142, top: 38, len: 42 },
          ].map(({ x, top, len }) => (
            <g key={x}>
              <rect x={x - 3} y={top + 44} width="6" height={len} fill={S} />
              <path d={`M${x - 3} ${top + 44 + len}h6l-1.5 8h-3z`} fill={D} />
              <rect x={x - 11} y={top} width="22" height="48" rx="9" fill={c} />
              <rect x={x - 11} y={top + 34} width="22" height="8" fill={D} opacity=".5" />
            </g>
          ))}
        </>
      );
    case "wrench":
      return (
        <g transform="rotate(-32 100 75)">
          <rect x="30" y="66" width="120" height="18" rx="8" fill={S} />
          <rect x="38" y="69" width="56" height="12" rx="6" fill={c} />
          <circle cx="158" cy="75" r="26" fill={S} />
          <rect x="158" y="64" width="34" height="22" fill="var(--art-bg, #dde3dc)" />
          <rect x="140" y="71" width="12" height="8" rx="2" fill={D} />
        </g>
      );
    case "pliers":
      return (
        <>
          <path d="M96 76L80 138" stroke={c} strokeWidth="13" strokeLinecap="round" />
          <path d="M104 76l16 62" stroke={c} strokeWidth="13" strokeLinecap="round" />
          <path d="M88 76l4-52 8-10 8 10 4 52z" fill={S} />
          <path d="M100 16v50" stroke={D} strokeWidth="2" />
          <circle cx="100" cy="74" r="8" fill={D} />
        </>
      );

    case "toolbox":
      return (
        <>
          <path d="M72 50c0-30 56-30 56 0" stroke={D} strokeWidth="8" fill="none" strokeLinecap="round" />
          <rect x="30" y="64" width="140" height="68" rx="7" fill={c} />
          <rect x="24" y="48" width="152" height="22" rx="6" fill={D} />
          <rect x="54" y="62" width="16" height="20" rx="3" fill={S} />
          <rect x="130" y="62" width="16" height="20" rx="3" fill={S} />
          <rect x="44" y="98" width="112" height="6" rx="3" fill={D} opacity=".35" />
        </>
      );
    case "tool-bag":
      return (
        <>
          <path d="M62 66c0-46 76-46 76 0" stroke={D} strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M44 60h112l12 66H32z" fill={c} />
          <rect x="72" y="80" width="56" height="32" rx="4" fill={D} opacity=".35" />
          <rect x="72" y="80" width="56" height="8" rx="3" fill={D} opacity=".5" />
          <rect x="28" y="120" width="144" height="14" rx="5" fill={D} />
        </>
      );
    case "organiser":
      return (
        <>
          <rect x="82" y="22" width="36" height="16" rx="4" fill={D} />
          <rect x="26" y="34" width="148" height="100" rx="7" fill={c} />
          {[0, 1, 2].map((row) =>
            [0, 1, 2, 3].map((col) => (
              <rect key={`${row}-${col}`} x={36 + col * 33} y={44 + row * 29} width="28" height="24" rx="3" fill={L} opacity=".85" />
            )),
          )}
          <circle cx="50" cy="56" r="4" fill={S} />
          <circle cx="116" cy="85" r="4" fill={S} />
          <circle cx="149" cy="114" r="4" fill={S} />
        </>
      );
    case "cabinet":
      return (
        <>
          <rect x="44" y="12" width="112" height="10" rx="2" fill={D} />
          <rect x="50" y="20" width="100" height="106" rx="3" fill={c} />
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <rect x="56" y={27 + i * 19} width="88" height="15" rx="2" fill={D} opacity=".3" />
              <rect x="82" y={32 + i * 19} width="36" height="4" rx="2" fill={L} />
            </g>
          ))}
          <circle cx="64" cy="134" r="8" fill={D} />
          <circle cx="136" cy="134" r="8" fill={D} />
        </>
      );

    case "tape":
      return (
        <>
          <rect x="124" y="106" width="58" height="11" fill={L} />
          <path d="M132 106v5M142 106v7M152 106v5M162 106v7M172 106v5" stroke={D} strokeWidth="1.5" />
          <rect x="180" y="101" width="5" height="22" rx="1" fill={D} />
          <rect x="38" y="34" width="92" height="92" rx="18" fill={c} />
          <circle cx="84" cy="78" r="25" fill={D} />
          <circle cx="84" cy="78" r="9" fill={S} />
          <rect x="112" y="44" width="10" height="20" rx="3" fill={D} opacity=".6" />
        </>
      );
    case "level":
      return (
        <g transform="rotate(-8 100 75)">
          <rect x="10" y="58" width="180" height="34" rx="4" fill={c} />
          <rect x="10" y="58" width="180" height="6" rx="3" fill={D} opacity=".4" />
          <rect x="80" y="66" width="40" height="18" rx="5" fill={L} />
          <circle cx="100" cy="75" r="5" fill={S} />
          <path d="M92 66v18M108 66v18" stroke={D} strokeWidth="1.5" />
          <circle cx="34" cy="77" r="9" fill={L} />
          <circle cx="166" cy="77" r="9" fill={L} />
        </g>
      );
    case "laser-level":
      return (
        <>
          <path d="M100 108l-32 34M100 108v34M100 108l32 34" stroke={D} strokeWidth="6" strokeLinecap="round" />
          <path d="M6 70h56M138 70h56" stroke={R} strokeWidth="2.5" strokeDasharray="7 5" />
          <rect x="62" y="38" width="76" height="72" rx="12" fill={c} />
          <circle cx="100" cy="70" r="17" fill={D} />
          <circle cx="100" cy="70" r="6" fill={R} />
          <rect x="84" y="28" width="32" height="12" rx="4" fill={D} />
        </>
      );
    case "distance-meter":
      return (
        <>
          <path d="M100 14V2" stroke={R} strokeWidth="2.5" strokeDasharray="4 3" />
          <rect x="66" y="14" width="68" height="126" rx="12" fill={c} />
          <rect x="75" y="24" width="50" height="44" rx="4" fill={D} />
          <path d="M82 36h36M82 46h24M82 56h30" stroke={L} strokeWidth="3" strokeLinecap="round" />
          <circle cx="100" cy="92" r="11" fill={R} />
          <circle cx="82" cy="118" r="6" fill={D} opacity=".6" />
          <circle cx="100" cy="118" r="6" fill={D} opacity=".6" />
          <circle cx="118" cy="118" r="6" fill={D} opacity=".6" />
        </>
      );
  }
}

export function ToolArt({ type, color, className }: { type: ToolTypeId; color: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 150" aria-hidden="true" focusable="false">
      {art(type, color)}
    </svg>
  );
}

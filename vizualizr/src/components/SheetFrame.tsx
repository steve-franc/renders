import type { ReactNode } from "react";

interface SheetFrameProps {
  sheetNumber: number;
  totalSheets: number;
  title: string;
  purpose: string;
  accentColor: string;
  formatName: string;
  projectTitle: string;
  children: ReactNode;
}

export default function SheetFrame({
  sheetNumber,
  totalSheets,
  title,
  purpose,
  accentColor,
  formatName,
  projectTitle,
  children,
}: SheetFrameProps) {
  return (
    <div
      className="relative bg-paper border border-line px-6 py-7 pb-12"
      style={{ borderColor: "#D8D4C8" }}
    >
      <div className="crop" style={{ top: -7, left: -7 }} />
      <div className="crop" style={{ top: -7, right: -7 }} />
      <div className="crop" style={{ bottom: -7, left: -7 }} />
      <div className="crop" style={{ bottom: -7, right: -7 }} />

      <div className="flex justify-between items-start gap-4 border-b border-line pb-3.5 mb-5 flex-wrap">
        <div>
          <div
            className="font-mono text-[11px] font-medium tracking-wide"
            style={{ color: accentColor }}
          >
            SHEET {String(sheetNumber).padStart(2, "0")}
          </div>
          <h2 className="font-display text-xl font-bold mt-1">{title}</h2>
        </div>
        <div className="font-mono text-[10px] text-grey text-right max-w-[230px] leading-relaxed">
          {purpose}
        </div>
      </div>

      {children}

      <div className="absolute left-6 right-6 bottom-3.5 flex justify-between border-t border-line pt-2 font-mono text-[9.5px] text-grey tracking-wide">
        <span className="text-ink">{projectTitle || "Untitled project"}</span>
        <span>
          {formatName.toUpperCase()} — SHEET {sheetNumber} OF {totalSheets}
        </span>
      </div>
    </div>
  );
}

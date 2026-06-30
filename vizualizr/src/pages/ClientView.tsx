import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { ACCENTS, SHEET_DEFS, type ProjectRow } from "../lib/schema";
import SheetFrame from "../components/SheetFrame";

export default function ClientView() {
  const { slug } = useParams();
  const [project, setProject] = useState<ProjectRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    load(slug);
  }, [slug]);

  async function load(s: string) {
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", s)
      .single();

    if (error || !data) {
      setNotFound(true);
    } else {
      setProject(data as ProjectRow);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center font-mono text-xs text-grey">
        Loading…
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center font-mono text-xs text-grey">
        This project link isn't valid, or the project has been removed.
      </div>
    );
  }

  const accent = ACCENTS[project.format];
  const sheets = SHEET_DEFS[project.format];

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-1.5">
        <div
          className="font-mono text-[10px] tracking-wide"
          style={{ color: accent.color }}
        >
          {accent.code} · {accent.name.toUpperCase()}
        </div>
        <h1 className="font-display text-2xl font-extrabold mt-1">
          {project.title}
        </h1>
        {project.client_line && (
          <div className="font-mono text-[11px] text-grey mt-1">
            {project.client_line}
          </div>
        )}
      </div>

      <div className="grid gap-8 mt-7">
        {sheets.map((sheet, i) => {
          const imageFields = sheet.fields.filter((f) => f.type === "url");
          const textFields = sheet.fields.filter((f) => f.type !== "url");
          return (
            <SheetFrame
              key={sheet.key}
              sheetNumber={i + 1}
              totalSheets={sheets.length}
              title={sheet.title}
              purpose={sheet.purpose}
              accentColor={accent.color}
              formatName={accent.name}
              projectTitle={project.title}
            >
              <div className="h-[3px] w-9 mb-4" style={{ background: accent.color }} />

              {imageFields.length > 0 && (
                <div
                  className="grid gap-3 mb-4"
                  style={{
                    gridTemplateColumns:
                      imageFields.length === 1
                        ? "1fr"
                        : `repeat(${Math.min(imageFields.length, 4)}, 1fr)`,
                  }}
                >
                  {imageFields.map((f) => {
                    const url = project.data[f.k];
                    return (
                      <div key={f.k}>
                        {url ? (
                          <img
                            src={url}
                            alt={f.label}
                            className="w-full block border border-line"
                            onError={(e) => {
                              const img = e.currentTarget as HTMLImageElement;
                              img.style.display = "none";
                              const next = img.nextElementSibling as HTMLElement | null;
                              if (next) next.style.display = "flex";
                            }}
                          />
                        ) : null}
                        <div
                          className="items-center justify-center aspect-video bg-[#ECE9E0] border border-line font-mono text-[11px] text-grey text-center p-2.5"
                          style={{ display: url ? "none" : "flex" }}
                        >
                          {url ? "Image not available" : `${f.label} not added yet`}
                        </div>
                        <div className="font-mono text-[10px] text-grey mt-1.5">
                          {f.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {textFields.map((f) => (
                <div key={f.k} className="mb-3.5">
                  <div className="font-mono text-[10px] text-grey tracking-wide mb-1">
                    {f.label.toUpperCase()}
                  </div>
                  <div
                    className="text-[13.5px] leading-relaxed"
                    style={{ color: project.data[f.k] ? "#3a3833" : "#B4B2A9" }}
                  >
                    {project.data[f.k] || "Not filled in yet."}
                  </div>
                </div>
              ))}
            </SheetFrame>
          );
        })}
      </div>
    </div>
  );
}

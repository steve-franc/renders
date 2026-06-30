import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import {
  ACCENTS,
  SHEET_DEFS,
  titleFieldFor,
  slugify,
  type ProjectRow,
  type FieldDef,
} from "../lib/schema";
import SheetFrame from "../components/SheetFrame";

type SaveState = "idle" | "saving" | "saved" | "error";

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeSheet, setActiveSheet] = useState(0);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!id) return;
    loadProject(id);
  }, [id]);

  async function loadProject(projectId: string) {
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single();

    if (error || !data) {
      setNotFound(true);
    } else {
      setProject(data as ProjectRow);
    }
    setLoading(false);
  }

  const persist = useCallback(
    async (updated: ProjectRow) => {
      setSaveState("saving");
      const { error } = await supabase
        .from("projects")
        .update({
          title: updated.title,
          client_line: updated.client_line,
          data: updated.data,
          slug: updated.slug,
        })
        .eq("id", updated.id);

      if (error) {
        setSaveState("error");
      } else {
        setSaveState("saved");
        setTimeout(() => setSaveState("idle"), 1200);
      }
    },
    []
  );

  function updateField(fieldKey: string, value: string) {
    if (!project) return;
    const sheets = SHEET_DEFS[project.format];
    const titleKey = titleFieldFor(project.format);

    const updated: ProjectRow = {
      ...project,
      data: { ...project.data, [fieldKey]: value },
    };

    if (fieldKey === titleKey) {
      updated.title = value || "Untitled project";
    }
    if (fieldKey === "clientLine") {
      updated.client_line = value;
    }
    // Keep slug roughly in sync with title for nicer client URLs,
    // but only before the project has been meaningfully named once,
    // to avoid silently breaking a link someone already has.
    if (fieldKey === titleKey && value && project.title === "Untitled project") {
      updated.slug = slugify(`${value}-${project.id.slice(0, 6)}`);
    }

    setProject(updated);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => persist(updated), 700);
    void sheets; // sheets referenced for clarity; not otherwise used here
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center font-mono text-xs text-grey">
        Loading project…
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <div className="font-mono text-xs text-grey mb-3">
          Project not found.
        </div>
        <Link to="/" className="font-mono text-xs underline">
          Back to all projects
        </Link>
      </div>
    );
  }

  const accent = ACCENTS[project.format];
  const sheets = SHEET_DEFS[project.format];
  const sheet = sheets[activeSheet];
  const clientUrl = `${window.location.origin}/p/${project.slug}`;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <button
          onClick={() => navigate("/")}
          className="font-mono text-[11.5px] border border-line px-3.5 py-2"
        >
          ← All projects
        </button>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => {
              navigator.clipboard.writeText(clientUrl);
            }}
            className="font-mono text-[11px] border border-line px-3.5 py-2"
            title={clientUrl}
          >
            Copy client link
          </button>
          <a
            href={`/p/${project.slug}`}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-[11px] border px-3.5 py-2"
            style={{ borderColor: accent.color }}
          >
            Open client view ↗
          </a>
        </div>
      </div>

      <div className="flex gap-1.5 flex-wrap my-4">
        {sheets.map((s, i) => (
          <button
            key={s.key}
            onClick={() => setActiveSheet(i)}
            className="font-mono text-[10.5px] px-2.5 py-1.5 border"
            style={{
              borderColor: i === activeSheet ? accent.color : "#D8D4C8",
              color: i === activeSheet ? "#0F0F0E" : "#8A8578",
            }}
          >
            {String(i + 1).padStart(2, "0")} {s.title}
          </button>
        ))}
      </div>

      <SheetFrame
        sheetNumber={activeSheet + 1}
        totalSheets={sheets.length}
        title={sheet.title}
        purpose={sheet.purpose}
        accentColor={accent.color}
        formatName={accent.name}
        projectTitle={project.title}
      >
        <div className="grid gap-4">
          {sheet.fields.map((f: FieldDef) => (
            <div key={f.k}>
              <label className="font-mono text-[10.5px] text-grey tracking-wide block mb-1.5">
                {f.label.toUpperCase()}
              </label>
              {f.type === "textarea" ? (
                <textarea
                  rows={3}
                  value={project.data[f.k] || ""}
                  onChange={(e) => updateField(f.k, e.target.value)}
                  placeholder={`Enter ${f.label.toLowerCase()}…`}
                  className="w-full border border-line bg-paper-dim px-2.5 py-2 text-[13.5px] leading-relaxed outline-none focus:border-ink resize-vertical"
                />
              ) : (
                <input
                  type="text"
                  value={project.data[f.k] || ""}
                  onChange={(e) => updateField(f.k, e.target.value)}
                  placeholder={f.type === "url" ? "https://…" : `Enter ${f.label.toLowerCase()}…`}
                  className="w-full border border-line bg-paper-dim px-2.5 py-2 text-[13.5px] outline-none focus:border-ink"
                />
              )}
              {f.type === "url" && project.data[f.k] && (
                <img
                  src={project.data[f.k]}
                  alt={f.label}
                  className="mt-2 max-w-full max-h-44 border border-line block"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </SheetFrame>

      <div
        className="font-mono text-[10.5px] mt-3 text-right"
        style={{ color: saveState === "error" ? "#C9472B" : "#8A8578" }}
      >
        {saveState === "saving" && "Saving…"}
        {saveState === "saved" && "Saved"}
        {saveState === "error" && "Save failed — check your connection"}
        {saveState === "idle" && "Changes save automatically"}
      </div>
    </div>
  );
}

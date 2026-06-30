import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import {
  ACCENTS,
  slugify,
  titleFieldFor,
  type ProjectFormat,
  type ProjectRow,
} from "../lib/schema";

export default function Dashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [creatingFormat, setCreatingFormat] = useState<ProjectFormat | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setProjects(data as ProjectRow[]);
    }
    setLoading(false);
  }

  async function createProject(format: ProjectFormat) {
    setCreatingFormat(format);
    const baseTitle = "untitled-project";
    let slug = slugify(`${baseTitle}-${Date.now().toString(36)}`);

    const titleKey = titleFieldFor(format);
    const { data, error } = await supabase
      .from("projects")
      .insert({
        slug,
        format,
        title: "Untitled project",
        client_line: null,
        data: { [titleKey]: "" },
      })
      .select()
      .single();

    setCreatingFormat(null);
    setCreating(false);

    if (error) {
      setError(error.message);
      return;
    }
    navigate(`/edit/${data.id}`);
  }

  async function deleteProject(id: string, title: string) {
    if (!window.confirm(`Delete "${title}"? This can't be undone.`)) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      setError(error.message);
      return;
    }
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="font-display text-xl font-extrabold">
            Visualization projects
          </h1>
          <div className="font-mono text-[11px] text-grey mt-1">
            {loading
              ? "Loading…"
              : `${projects.length} ${projects.length === 1 ? "project" : "projects"} saved`}
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 border border-marker text-marker font-mono text-xs px-4 py-3">
          {error}
        </div>
      )}

      {!creating ? (
        <button
          onClick={() => setCreating(true)}
          className="mt-5 font-mono text-[13px] bg-ink text-paper px-5 py-2.5 tracking-wide"
        >
          + New project
        </button>
      ) : (
        <div className="mt-5 border border-line bg-white p-4">
          <div className="font-mono text-[10.5px] text-grey tracking-wide mb-2.5">
            CHOOSE A FORMAT
          </div>
          <div className="flex gap-2.5 flex-wrap">
            {Object.entries(ACCENTS).map(([key, a]) => (
              <button
                key={key}
                disabled={creatingFormat !== null}
                onClick={() => createProject(key as ProjectFormat)}
                className="font-display text-sm font-semibold bg-white border-[1.5px] px-4 py-3 disabled:opacity-50"
                style={{ borderColor: a.color }}
              >
                <div
                  className="font-mono text-[10px] mb-1"
                  style={{ color: a.color }}
                >
                  {a.code}
                </div>
                {creatingFormat === key ? "Creating…" : a.name}
              </button>
            ))}
            <button
              onClick={() => setCreating(false)}
              className="font-display text-sm font-semibold bg-white border-[1.5px] border-line text-grey px-4 py-3"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {!loading && projects.length === 0 && !creating && (
        <div className="mt-6 border border-dashed border-line text-center py-8 px-5">
          <div className="font-mono text-xs text-grey">
            No projects yet. Start one above — pick interior, exterior, or
            full project, then fill in renders and notes sheet by sheet.
          </div>
        </div>
      )}

      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3.5 mt-6">
        {projects.map((proj) => {
          const a = ACCENTS[proj.format];
          return (
            <div
              key={proj.id}
              className="bg-white border border-line p-4 pb-3.5"
              style={{ borderTopWidth: 3, borderTopColor: a.color }}
            >
              <div
                className="font-mono text-[9.5px] tracking-wide mb-2"
                style={{ color: a.color }}
              >
                {a.code} · {a.name.toUpperCase()}
              </div>
              <div className="font-display text-[15px] font-bold mb-1 leading-tight">
                {proj.title || "Untitled project"}
              </div>
              <div className="text-[12.5px] text-grey mb-4 leading-snug">
                {proj.client_line || "No client info yet"}
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => navigate(`/edit/${proj.id}`)}
                  className="font-mono text-[10.5px] border border-line px-2.5 py-1.5"
                >
                  Edit
                </button>
                <button
                  onClick={() => window.open(`/p/${proj.slug}`, "_blank")}
                  className="font-mono text-[10.5px] border border-line px-2.5 py-1.5"
                >
                  View
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/p/${proj.slug}`
                    );
                  }}
                  className="font-mono text-[10.5px] border border-line px-2.5 py-1.5"
                  title="Copy client link"
                >
                  Copy link
                </button>
                <button
                  onClick={() => deleteProject(proj.id, proj.title)}
                  className="font-mono text-[10.5px] border border-marker text-marker px-2.5 py-1.5 ml-auto"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

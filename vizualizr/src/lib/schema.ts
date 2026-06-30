export type ProjectFormat = "interior" | "exterior" | "combined";

export type FieldType = "text" | "textarea" | "url";

export interface FieldDef {
  k: string;
  label: string;
  type: FieldType;
}

export interface SheetDef {
  key: string;
  title: string;
  purpose: string;
  fields: FieldDef[];
}

export interface ProjectRow {
  id: string;
  slug: string;
  format: ProjectFormat;
  title: string;
  client_line: string | null;
  data: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export const ACCENTS: Record<
  ProjectFormat,
  { name: string; color: string; code: string }
> = {
  interior: { name: "Interior", color: "#B89B5E", code: "A-1" },
  exterior: { name: "Exterior", color: "#3D5A4C", code: "A-2" },
  combined: { name: "Full project", color: "#C9472B", code: "A-0" },
};

export const SHEET_DEFS: Record<ProjectFormat, SheetDef[]> = {
  interior: [
    {
      key: "cover",
      title: "Cover",
      purpose: "Sets the room, the date, and who this deck belongs to.",
      fields: [
        { k: "roomName", label: "Room / space name", type: "text" },
        { k: "clientLine", label: "Client / address", type: "text" },
        { k: "scopeLine", label: "Scope of this deck", type: "textarea" },
      ],
    },
    {
      key: "context",
      title: "Camera location",
      purpose: "Shows the client exactly where they're standing.",
      fields: [
        { k: "planImg", label: "Floor plan image URL", type: "url" },
        { k: "contextNote", label: "Why this vantage point", type: "textarea" },
      ],
    },
    {
      key: "hero",
      title: "Hero view",
      purpose: "The single image this room is sold on.",
      fields: [
        { k: "heroImg", label: "Hero render image URL", type: "url" },
        { k: "heroCaption", label: "Caption (cam / time of day)", type: "text" },
      ],
    },
    {
      key: "materials",
      title: "Material & light breakdown",
      purpose: "Close-ups the hero shot is too far back to show.",
      fields: [
        { k: "mat1Img", label: "Flooring image URL", type: "url" },
        { k: "mat2Img", label: "Wall finish image URL", type: "url" },
        { k: "mat3Img", label: "Furniture image URL", type: "url" },
        { k: "mat4Img", label: "Lighting image URL", type: "url" },
        { k: "matNote", label: "Material spec note", type: "textarea" },
      ],
    },
    {
      key: "mood",
      title: "Mood comparison",
      purpose: "Day vs night — optional, include if lighting is part of the pitch.",
      fields: [
        { k: "dayImg", label: "Day render image URL", type: "url" },
        { k: "nightImg", label: "Night render image URL", type: "url" },
      ],
    },
    {
      key: "alt",
      title: "Alternate angle",
      purpose: "A second viewpoint, proving the space holds up from elsewhere.",
      fields: [
        { k: "altImg", label: "Alternate angle image URL", type: "url" },
        { k: "altNote", label: "Why this angle", type: "textarea" },
      ],
    },
  ],
  exterior: [
    {
      key: "cover",
      title: "Cover",
      purpose: "Sets the building, the date, and who this deck belongs to.",
      fields: [
        { k: "buildingName", label: "Building / facade name", type: "text" },
        { k: "clientLine", label: "Client / address", type: "text" },
        { k: "scopeLine", label: "Scope of this deck", type: "textarea" },
      ],
    },
    {
      key: "site",
      title: "Site context",
      purpose: "Orientation, neighbors, and where the camera sits on the plot.",
      fields: [
        { k: "siteImg", label: "Site / aerial plan image URL", type: "url" },
        { k: "siteNote", label: "Orientation logic", type: "textarea" },
      ],
    },
    {
      key: "hero",
      title: "Hero view",
      purpose: "The money shot — usually a 3/4 angle reading form and entry.",
      fields: [
        { k: "heroImg", label: "Hero render image URL", type: "url" },
        { k: "heroCaption", label: "Caption (cam / time of day)", type: "text" },
      ],
    },
    {
      key: "angles",
      title: "Elevations & angles",
      purpose: "Lets the client mentally circle the building.",
      fields: [
        { k: "frontImg", label: "Front elevation image URL", type: "url" },
        { k: "sideImg", label: "Side elevation image URL", type: "url" },
        { k: "rearImg", label: "Rear elevation image URL", type: "url" },
      ],
    },
    {
      key: "facade",
      title: "Facade & material detail",
      purpose: "Texture and material that doesn't read at hero-shot scale.",
      fields: [
        { k: "mat1Img", label: "Cladding image URL", type: "url" },
        { k: "mat2Img", label: "Glazing image URL", type: "url" },
        { k: "mat3Img", label: "Landscape image URL", type: "url" },
        { k: "mat4Img", label: "Entry detail image URL", type: "url" },
      ],
    },
    {
      key: "twilight",
      title: "Twilight / seasonal variation",
      purpose: "Twilight with glowing interior lights reads premium.",
      fields: [
        { k: "dayImg", label: "Day render image URL", type: "url" },
        { k: "twilightImg", label: "Twilight render image URL", type: "url" },
      ],
    },
  ],
  combined: [
    {
      key: "cover",
      title: "Cover",
      purpose: "Whole-building narrative, exterior through interior.",
      fields: [
        { k: "projName", label: "Project name", type: "text" },
        { k: "clientLine", label: "Client / address", type: "text" },
        { k: "deliverables", label: "Deliverables included", type: "textarea" },
      ],
    },
    {
      key: "overview",
      title: "Project overview",
      purpose: "One paragraph: program, size, location, design intent.",
      fields: [{ k: "overviewText", label: "Overview paragraph", type: "textarea" }],
    },
    {
      key: "site",
      title: "Site plan",
      purpose: "Orientation and placement on the plot.",
      fields: [{ k: "siteImg", label: "Site plan image URL", type: "url" }],
    },
    {
      key: "exthero",
      title: "Exterior — hero views",
      purpose: "One to two main angles establishing the building.",
      fields: [
        { k: "ext1Img", label: "Exterior hero image URL", type: "url" },
        { k: "ext2Img", label: "Exterior secondary angle URL", type: "url" },
      ],
    },
    {
      key: "inthero",
      title: "Interior — hero views",
      purpose: "Ordered as a client would actually walk through.",
      fields: [
        { k: "int1Img", label: "Entry / hallway image URL", type: "url" },
        { k: "int2Img", label: "Living / main space image URL", type: "url" },
        { k: "int3Img", label: "Bedroom / secondary space URL", type: "url" },
      ],
    },
    {
      key: "close",
      title: "Closing & next steps",
      purpose: "Deliverables, formats, revisions, contact.",
      fields: [{ k: "contactInfo", label: "Contact info", type: "textarea" }],
    },
  ],
};

export function titleFieldFor(format: ProjectFormat): string {
  if (format === "exterior") return "buildingName";
  if (format === "combined") return "projName";
  return "roomName";
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

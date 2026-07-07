// Tiny, dependency-free markdown-to-HTML renderer for training module content.
//
// Deliberately minimal: this only needs to support the subset of markdown
// actually used in training_modules.content_md (see
// supabase/seed/seed_s6_training_modules.sql) — headings (#, ##, ###), bold,
// italics, bullet lists, numbered lists, paragraphs, and horizontal rules.
//
// Security: all input is HTML-escaped up front. There is no raw-HTML
// passthrough anywhere in this renderer — inline formatting is applied only
// after escaping, and only via fixed-structure replacements, so content_md
// can never inject markup.

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Applies inline formatting (bold, italics) to an already-escaped line.
// Order matters: bold (**) is matched before italics (*) so "**x**" doesn't
// get partially consumed by the italics pattern first.
function renderInline(escaped: string): string {
  let out = escaped;
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return out;
}

type Block =
  | { type: "heading"; level: 1 | 2 | 3; text: string }
  | { type: "hr" }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "p"; text: string };

function parseBlocks(lines: string[]): Block[] {
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === "") {
      i++;
      continue;
    }

    // Horizontal rule: a line that is only --- (3 or more dashes).
    if (/^-{3,}$/.test(trimmed)) {
      blocks.push({ type: "hr" });
      i++;
      continue;
    }

    // Headings: #, ##, ### followed by a space.
    const headingMatch = /^(#{1,3})\s+(.*)$/.exec(trimmed);
    if (headingMatch) {
      const level = headingMatch[1].length as 1 | 2 | 3;
      blocks.push({ type: "heading", level, text: headingMatch[2].trim() });
      i++;
      continue;
    }

    // Bullet list: consecutive lines starting with "-" or "*" plus a space.
    if (/^[-*]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ""));
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    // Numbered list: consecutive lines starting with "1.", "2.", etc.
    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ""));
        i++;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    // Paragraph: consume until a blank line or the start of a new block type.
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^-{3,}$/.test(lines[i].trim()) &&
      !/^(#{1,3})\s+/.test(lines[i].trim()) &&
      !/^[-*]\s+/.test(lines[i].trim()) &&
      !/^\d+\.\s+/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i].trim());
      i++;
    }
    blocks.push({ type: "p", text: paraLines.join(" ") });
  }

  return blocks;
}

/**
 * Renders a markdown string to a clean, readable HTML fragment. All source
 * text is HTML-escaped before any formatting is applied, so no raw HTML in
 * the source can pass through — this is the only entry point that should be
 * used to render training_modules.content_md.
 */
export function renderMarkdown(source: string): string {
  const escaped = escapeHtml(source);
  const lines = escaped.split("\n");
  const blocks = parseBlocks(lines);

  const html = blocks
    .map((block) => {
      switch (block.type) {
        case "heading": {
          const tag = `h${block.level}`;
          const className =
            block.level === 1
              ? "mt-8 text-xl font-semibold text-slate-900 first:mt-0"
              : block.level === 2
              ? "mt-7 text-lg font-semibold text-slate-900 first:mt-0"
              : "mt-6 text-base font-semibold text-slate-900 first:mt-0";
          return `<${tag} class="${className}">${renderInline(block.text)}</${tag}>`;
        }
        case "hr":
          return `<hr class="my-6 border-slate-200" />`;
        case "ul":
          return `<ul class="mt-3 list-disc space-y-1.5 pl-5 text-sm text-slate-700">${block.items
            .map((item) => `<li>${renderInline(item)}</li>`)
            .join("")}</ul>`;
        case "ol":
          return `<ol class="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-slate-700">${block.items
            .map((item) => `<li>${renderInline(item)}</li>`)
            .join("")}</ol>`;
        case "p":
          return `<p class="mt-3 text-sm leading-relaxed text-slate-700">${renderInline(block.text)}</p>`;
      }
    })
    .join("\n");

  return html;
}

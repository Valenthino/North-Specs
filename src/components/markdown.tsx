import * as React from "react";

/**
 * Minimal, dependency-free Markdown renderer for our controlled article and
 * legal content. Supports: ## / ### / #### headings, - and 1. lists,
 * > blockquotes, --- rules, GFM-style pipe tables, **bold**, *italic*,
 * `code` and [links](/href). Not a general-purpose parser.
 */

const INLINE = /(\*\*[^*]+\*\*|\*[^*\n]+\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\))/g;

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  return text.split(INLINE).map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={key}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length > 1) {
      return <code key={key}>{part.slice(1, -1)}</code>;
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return <em key={key}>{part.slice(1, -1)}</em>;
    }
    const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part);
    if (link) {
      const [, label, href] = link;
      const external = /^https?:\/\//.test(href);
      return (
        <a
          key={key}
          href={href}
          {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
        >
          {label}
        </a>
      );
    }
    return <React.Fragment key={key}>{part}</React.Fragment>;
  });
}

const isTableRow = (line: string) => line.trim().startsWith("|") && line.trim().endsWith("|");
const isTableDivider = (line: string) => /^\s*\|[\s:|-]+\|\s*$/.test(line) && line.includes("-");

function splitRow(line: string): string[] {
  return line
    .trim()
    .slice(1, -1)
    .split("|")
    .map((cell) => cell.trim());
}

export function Markdown({ content }: { content: string }) {
  const lines = content.split("\n");
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === "") {
      i++;
      continue;
    }

    if (/^(---|\*\*\*)\s*$/.test(line.trim())) {
      blocks.push(<hr key={key++} />);
      i++;
    } else if (line.startsWith("#### ")) {
      blocks.push(<h4 key={key++}>{renderInline(line.slice(5), `h4-${key}`)}</h4>);
      i++;
    } else if (line.startsWith("### ")) {
      blocks.push(<h3 key={key++}>{renderInline(line.slice(4), `h3-${key}`)}</h3>);
      i++;
    } else if (line.startsWith("## ")) {
      blocks.push(<h2 key={key++}>{renderInline(line.slice(3), `h2-${key}`)}</h2>);
      i++;
    } else if (isTableRow(line) && i + 1 < lines.length && isTableDivider(lines[i + 1])) {
      const head = splitRow(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && isTableRow(lines[i])) {
        rows.push(splitRow(lines[i]));
        i++;
      }
      const tableKey = key++;
      blocks.push(
        <div key={tableKey} className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                {head.map((cell, idx) => (
                  <th key={idx}>{renderInline(cell, `th-${tableKey}-${idx}`)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx}>{renderInline(cell, `td-${tableKey}-${rIdx}-${cIdx}`)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
    } else if (line.startsWith("> ")) {
      const quote: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        quote.push(lines[i].slice(2));
        i++;
      }
      blocks.push(<blockquote key={key++}>{renderInline(quote.join(" "), `q-${key}`)}</blockquote>);
    } else if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ""));
        i++;
      }
      blocks.push(
        <ol key={key++}>
          {items.map((it, idx) => (
            <li key={idx}>{renderInline(it, `ol-${key}-${idx}`)}</li>
          ))}
        </ol>,
      );
    } else if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2));
        i++;
      }
      blocks.push(
        <ul key={key++}>
          {items.map((it, idx) => (
            <li key={idx}>{renderInline(it, `ul-${key}-${idx}`)}</li>
          ))}
        </ul>,
      );
    } else {
      const para: string[] = [];
      while (
        i < lines.length &&
        lines[i].trim() !== "" &&
        !lines[i].startsWith("#") &&
        !lines[i].startsWith("> ") &&
        !lines[i].startsWith("- ") &&
        !isTableRow(lines[i]) &&
        !/^(---|\*\*\*)\s*$/.test(lines[i].trim()) &&
        !/^\d+\.\s/.test(lines[i])
      ) {
        para.push(lines[i]);
        i++;
      }
      blocks.push(<p key={key++}>{renderInline(para.join(" "), `p-${key}`)}</p>);
    }
  }

  return <div className="prose-north">{blocks}</div>;
}

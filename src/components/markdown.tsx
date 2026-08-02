import * as React from "react";

/**
 * Minimal, dependency-free Markdown renderer for our controlled article and
 * legal content. Supports: ## / ### headings, - and 1. lists, > blockquotes,
 * **bold**, and paragraphs. Not a general-purpose parser.
 */

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  // Split on **bold** segments.
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${keyPrefix}-${i}`}>{part.slice(2, -2)}</strong>;
    }
    return <React.Fragment key={`${keyPrefix}-${i}`}>{part}</React.Fragment>;
  });
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

    if (line.startsWith("### ")) {
      blocks.push(<h3 key={key++}>{renderInline(line.slice(4), `h3-${key}`)}</h3>);
      i++;
    } else if (line.startsWith("## ")) {
      blocks.push(<h2 key={key++}>{renderInline(line.slice(3), `h2-${key}`)}</h2>);
      i++;
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

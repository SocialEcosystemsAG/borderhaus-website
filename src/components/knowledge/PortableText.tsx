// Minimaler Renderer fuer Sanity Portable Text, ohne Extra-Dependency. Deckt
// Standard-Bloecke (Absatz, Headings, Listen) und einfache Marks ab. Fuer reiche
// Inhalte kann spaeter @portabletext/react ergaenzt werden.
import { Fragment } from 'react';

interface Span {
  _key?: string;
  _type: string;
  text?: string;
  marks?: string[];
}
interface Block {
  _key?: string;
  _type: string;
  style?: string;
  listItem?: string;
  children?: Span[];
}

function renderSpans(children: Span[] = []) {
  return children.map((span, i) => {
    let node: React.ReactNode = span.text ?? '';
    if (span.marks?.includes('strong')) node = <strong key={`s${i}`}>{node}</strong>;
    if (span.marks?.includes('em')) node = <em key={`e${i}`}>{node}</em>;
    return <Fragment key={span._key ?? i}>{node}</Fragment>;
  });
}

export function PortableText({ value }: { value: unknown }) {
  if (!Array.isArray(value)) return null;
  const blocks = value as Block[];

  const out: React.ReactNode[] = [];
  let list: { type: string; items: Block[] } | null = null;

  const flush = () => {
    if (!list) return;
    const Tag = list.type === 'number' ? 'ol' : 'ul';
    out.push(
      <Tag key={`list-${out.length}`} className="my-4 ml-5 list-disc space-y-1 text-canvas/80">
        {list.items.map((item, i) => (
          <li key={item._key ?? i}>{renderSpans(item.children)}</li>
        ))}
      </Tag>,
    );
    list = null;
  };

  blocks.forEach((block, i) => {
    if (block._type !== 'block') return;
    if (block.listItem) {
      if (!list || list.type !== block.listItem) {
        flush();
        list = { type: block.listItem, items: [] };
      }
      list.items.push(block);
      return;
    }
    flush();
    const content = renderSpans(block.children);
    switch (block.style) {
      case 'h2':
        out.push(<h2 key={block._key ?? i} className="mt-8 text-2xl font-semibold">{content}</h2>);
        break;
      case 'h3':
        out.push(<h3 key={block._key ?? i} className="mt-6 text-xl font-semibold">{content}</h3>);
        break;
      case 'blockquote':
        out.push(
          <blockquote key={block._key ?? i} className="my-4 border-l-2 border-accent pl-4 text-canvas/70">
            {content}
          </blockquote>,
        );
        break;
      default:
        out.push(<p key={block._key ?? i} className="my-4 text-canvas/80">{content}</p>);
    }
  });
  flush();

  return <div className="leading-relaxed">{out}</div>;
}

import Link from 'next/link';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

// Sichtbare Breadcrumb plus strukturierte Daten.
export function Breadcrumb({ items }: { items: { name: string; url: string }[] }) {
  return (
    <>
      <BreadcrumbJsonLd items={items} />
      <nav aria-label="Breadcrumb" className="container-bh pt-6">
        <ol className="flex flex-wrap items-center gap-2 text-xs text-muted">
          {items.map((item, i) => (
            <li key={item.url} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden="true">/</span>}
              {i < items.length - 1 ? (
                <Link href={item.url} className="hover:text-canvas">
                  {item.name}
                </Link>
              ) : (
                <span className="text-canvas/70">{item.name}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

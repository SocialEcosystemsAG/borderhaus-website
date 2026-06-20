import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n';
import { path, type RouteKey } from '@/i18n/routes';
import { Logo } from '@/components/brand/Logo';
import { ORG } from '@/lib/site';

// Footer: dunkler Kontrast-Anker (Abschnitt 3a).
export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const product: { key: RouteKey; label: keyof Dictionary['nav'] }[] = [
    { key: 'howItWorks', label: 'howItWorks' },
    { key: 'services', label: 'services' },
    { key: 'integrations', label: 'integrations' },
    { key: 'pricing', label: 'pricing' },
    { key: 'useCases', label: 'useCases' },
  ];
  const company: { key: RouteKey; label: keyof Dictionary['nav'] }[] = [
    { key: 'impact', label: 'impact' },
    { key: 'about', label: 'about' },
    { key: 'locations', label: 'locations' },
    { key: 'knowledge', label: 'knowledge' },
    { key: 'contact', label: 'contact' },
  ];
  const legal: { key: RouteKey; label: keyof Dictionary['nav'] | string }[] = [
    { key: 'imprint', label: dict.pages.imprint.title },
    { key: 'privacy', label: dict.pages.privacy.title },
    { key: 'terms', label: dict.pages.terms.title },
  ];

  return (
    <footer className="mt-auto bg-canvas text-grey-300">
      <div className="container-bh grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo onDark />
          <p className="max-w-xs text-sm text-grey-300">{dict.footer.tagline}</p>
          <p className="text-xs text-muted">{dict.footer.parent}</p>
        </div>

        <FooterCol title={dict.footer.columns.product}>
          {product.map((item) => (
            <FooterLink key={item.key} href={path(locale, item.key)}>
              {dict.nav[item.label as keyof Dictionary['nav']]}
            </FooterLink>
          ))}
        </FooterCol>

        <FooterCol title={dict.footer.columns.company}>
          {company.map((item) => (
            <FooterLink key={item.key} href={path(locale, item.key)}>
              {dict.nav[item.label as keyof Dictionary['nav']]}
            </FooterLink>
          ))}
        </FooterCol>

        <FooterCol title={dict.footer.columns.legal}>
          {legal.map((item) => (
            <FooterLink key={item.key} href={path(locale, item.key)}>
              {item.label}
            </FooterLink>
          ))}
          <a href={`mailto:${ORG.email}`} className="block text-sm text-grey-300 hover:text-cream">
            {ORG.email}
          </a>
        </FooterCol>
      </div>

      <div className="border-t border-white/10">
        <div className="container-bh flex flex-col items-center justify-between gap-2 py-6 text-xs text-muted sm:flex-row">
          <span>
            © {new Date().getFullYear()} {ORG.legalName}. {dict.footer.rights}
          </span>
          <span className="font-mono uppercase tracking-widest">Borderhaus</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h2 className="label-mono text-grey-200">{title}</h2>
      <nav className="flex flex-col gap-2">{children}</nav>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-sm text-grey-300 transition-colors hover:text-cream">
      {children}
    </Link>
  );
}

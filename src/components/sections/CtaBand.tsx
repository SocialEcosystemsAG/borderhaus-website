import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n';
import { path } from '@/i18n/routes';

// CTA-Band: dunkler Kontrast-Anker (Abschnitt 3a).
export function CtaBand({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="bg-canvas text-cream">
      <div className="container-bh py-16 sm:py-20">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-xl">
            <h2 className="text-3xl sm:text-4xl">{dict.home.ctaBand.heading}</h2>
            <p className="mt-3 text-lg text-grey-300">{dict.home.ctaBand.body}</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link href={path(locale, 'pricing')} className="btn-on-dark">
              {dict.cta.calculate}
            </Link>
            <Link href={path(locale, 'contact')} className="btn-primary">
              {dict.cta.requestQuote}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

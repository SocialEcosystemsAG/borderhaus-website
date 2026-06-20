import { NextRequest, NextResponse } from 'next/server';
import { defaultLocale, locales } from '@/i18n/config';

// Leitet locale-lose Pfade auf eine Sprache. Bevorzugt Accept-Language,
// faellt sonst auf die Standardsprache (DE) zurueck.
function resolveLocale(request: NextRequest): string {
  const header = request.headers.get('accept-language') ?? '';
  const preferred = header
    .split(',')
    .map((part) => part.split(';')[0].trim().slice(0, 2).toLowerCase());
  const match = preferred.find((code) => (locales as readonly string[]).includes(code));
  return match ?? defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Pfad hat bereits eine Locale: nichts tun.
  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return NextResponse.next();

  const locale = resolveLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Statische Assets, API und Next-Interna ausnehmen.
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};

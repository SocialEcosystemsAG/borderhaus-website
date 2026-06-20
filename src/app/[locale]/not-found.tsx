import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="bg-cream text-canvas">
      <div className="container-bh flex min-h-[60vh] flex-col items-start justify-center py-20">
        <p className="label-mono">404</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">Seite nicht gefunden / Page not found</h1>
        <p className="mt-4 max-w-md text-canvas/70">
          Diese Seite gibt es nicht. / This page does not exist.
        </p>
        <div className="mt-8 flex gap-3">
          <Link href="/de" className="btn-primary">
            Zur Startseite
          </Link>
          <Link href="/en" className="btn-secondary">
            To home
          </Link>
        </div>
      </div>
    </section>
  );
}

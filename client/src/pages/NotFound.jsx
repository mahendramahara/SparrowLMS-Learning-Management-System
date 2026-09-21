import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main
      className="flex min-h-screen items-center justify-center px-6"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="text-center">
        <p
          className="text-sm font-semibold uppercase tracking-widest"
          style={{ color: 'var(--color-primary-600)' }}
        >
          404
        </p>
        <h1 className="mt-3 text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Page not found
        </h1>
        <p className="mt-2" style={{ color: 'var(--text-muted)' }}>
          The page you are looking for does not exist.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-lg px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          style={{ backgroundColor: 'var(--color-primary-600)' }}
        >
          Return home
        </Link>
      </div>
    </main>
  );
}

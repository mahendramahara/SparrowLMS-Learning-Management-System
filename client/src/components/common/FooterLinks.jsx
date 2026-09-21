export default function FooterLinks({ title, links }) {
  return (
    <div>
      <h4 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
        {title}
      </h4>
      <ul className="mt-4 space-y-2.5">
        {links.map(link => (
          <li key={link}>
            <a
              href="#"
              className="text-sm transition hover:opacity-80"
              style={{ color: 'var(--text-muted)' }}
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

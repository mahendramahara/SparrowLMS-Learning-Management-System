export default function Pill({ children, onClick, active = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-block whitespace-nowrap px-3.5 py-1 text-xs font-medium rounded-full transition-colors"
      style={
        active
          ? {
              backgroundColor: 'var(--color-primary-600)',
              color: '#ffffff',
            }
          : {
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-subtle)',
            }
      }
    >
      {children}
    </button>
  );
}

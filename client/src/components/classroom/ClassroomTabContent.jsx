import { FileText, Download, BookOpen, Layers } from 'lucide-react';

export default function ClassroomTabContent({ lesson, activeTab = 'overview', onTabChange }) {
  if (!lesson) return null;

  const tabs = [
    { id: 'overview', label: 'Lesson Overview' },
    { id: 'resources', label: `Resources (${lesson.resources?.length || 0})` },
    { id: 'notes', label: 'Study Notes' },
  ];

  return (
    <div
      className="rounded-2xl border p-5 space-y-4"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div
        className="flex items-center gap-2 border-b pb-3"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        {tabs.map(({ id, label }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onTabChange(id)}
              className="rounded-xl px-3.5 py-1.5 text-xs font-semibold transition"
              style={
                isActive
                  ? {
                      backgroundColor: 'var(--color-primary-600)',
                      color: '#ffffff',
                    }
                  : {
                      color: 'var(--text-secondary)',
                      backgroundColor: 'var(--bg-subtle)',
                    }
              }
            >
              {label}
            </button>
          );
        })}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-3">
          <div
            className="flex items-center gap-2 text-xs font-medium"
            style={{ color: 'var(--text-muted)' }}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>{lesson.moduleTitle}</span>
          </div>

          <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            {lesson.title}
          </h3>

          <p
            className="text-xs sm:text-sm leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            {lesson.description}
          </p>
        </div>
      )}

      {activeTab === 'resources' && (
        <div className="space-y-2">
          {lesson.resources && lesson.resources.length > 0 ? (
            lesson.resources.map(res => (
              <div
                key={res.name}
                className="flex items-center justify-between p-3 rounded-xl border transition hover:opacity-85"
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg text-blue-500 bg-blue-500/10">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {res.name}
                    </p>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      {res.size}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="flex items-center gap-1 text-xs font-semibold hover:underline"
                  style={{ color: 'var(--color-primary-600)' }}
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download</span>
                </button>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 py-3">
              No supplementary resources attached to this lesson.
            </p>
          )}
        </div>
      )}

      {activeTab === 'notes' && (
        <div
          className="rounded-xl p-4 border text-xs leading-relaxed font-mono whitespace-pre-wrap"
          style={{
            backgroundColor: 'var(--bg-subtle)',
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-secondary)',
          }}
        >
          {lesson.notes}
        </div>
      )}
    </div>
  );
}

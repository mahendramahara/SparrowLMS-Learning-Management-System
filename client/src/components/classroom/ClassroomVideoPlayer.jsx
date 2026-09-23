import UniversalVideoPlayer from '../common/UniversalVideoPlayer';

export default function ClassroomVideoPlayer({ videoUrl, title }) {
  return (
    <div
      className="overflow-hidden rounded-3xl border shadow-lg"
      style={{
        backgroundColor: '#090d16',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="relative aspect-video w-full bg-black flex items-center justify-center">
        <UniversalVideoPlayer videoUrl={videoUrl} title={title} />
      </div>

      <div
        className="flex items-center justify-between p-4 border-t text-xs"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
          color: 'var(--text-secondary)',
        }}
      >
        <span className="font-bold truncate" style={{ color: 'var(--text-primary)' }}>
          {title}
        </span>
        <span className="rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-blue-500/10 text-blue-500">
          HD 1080p
        </span>
      </div>
    </div>
  );
}

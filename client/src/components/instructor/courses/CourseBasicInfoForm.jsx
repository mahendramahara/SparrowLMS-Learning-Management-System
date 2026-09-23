import { Image, DollarSign, Globe, Layers, Award, UploadCloud } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadMedia } from '../../../services/upload.api';
import CourseCategorySelector from './CourseCategorySelector';

export default function CourseBasicInfoForm({
  title,
  onTitleChange,
  subtitle,
  onSubtitleChange,
  category,
  onCategoryChange,
  level,
  onLevelChange,
  price,
  onPriceChange,
  thumbnail,
  onThumbnailChange,
  description,
  onDescriptionChange,
  language = 'English',
  onLanguageChange,
}) {
  const PRESET_THUMBNAILS = [
    { label: 'Web Dev', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80' },
    { label: 'Mobile App', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80' },
    { label: 'Python / AI', url: 'https://images.unsplash.com/photo-1516116211227-bbc141e6c382?w=600&auto=format&fit=crop&q=80' },
    { label: 'UI / UX', url: 'https://images.unsplash.com/photo-1581291518655-9523b932edcf?w=600&auto=format&fit=crop&q=80' },
    { label: 'Cloud & DevOps', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80' },
  ];

  return (
    <div
      className="rounded-3xl p-6 sm:p-8 border space-y-6 shadow-sm"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div>
        <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
          Course Essentials &amp; Categorization
        </h2>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
          Configure primary metadata, subject taxonomy, target audience level, and commercial pricing.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
            Course Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Master Modern Full Stack Engineering with React 19, TypeScript & Node"
            value={title}
            onChange={e => onTitleChange(e.target.value)}
            className="w-full rounded-2xl py-2.5 px-3.5 text-xs sm:text-sm border outline-none transition font-medium"
            style={{
              backgroundColor: 'var(--bg-subtle)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
            Headline Subtitle
          </label>
          <input
            type="text"
            placeholder="e.g. Build enterprise-ready, scalable microservices and high performance web apps from zero."
            value={subtitle}
            onChange={e => onSubtitleChange(e.target.value)}
            className="w-full rounded-2xl py-2.5 px-3.5 text-xs border outline-none transition"
            style={{
              backgroundColor: 'var(--bg-subtle)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CourseCategorySelector
            value={category}
            onChange={(id, name) => onCategoryChange(id, name)}
          />

          <div className="space-y-1.5">
            <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
              Target Level
            </label>
            <select
              value={level ? level.toLowerCase() : 'beginner'}
              onChange={e => onLevelChange(e.target.value)}
              className="w-full rounded-xl py-2 px-3 text-xs border outline-none"
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-primary)',
              }}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="all levels">All Levels</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
              Primary Language
            </label>
            <select
              value={language}
              onChange={e => onLanguageChange?.(e.target.value)}
              className="w-full rounded-xl py-2 px-3 text-xs border outline-none"
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-primary)',
              }}
            >
              <option value="English">English</option>
              <option value="Nepali">Nepali</option>
              <option value="Hindi">Hindi</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
              Tuition Price ($ USD)
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                $
              </span>
              <input
                type="number"
                min="0"
                value={price}
                onChange={e => onPriceChange(e.target.value)}
                className="w-full rounded-xl py-2 pl-7 pr-3 text-xs border outline-none font-bold"
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
            Course Thumbnail Cover Asset (Individual Upload)
          </label>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div
              className="relative aspect-video w-full sm:w-56 shrink-0 overflow-hidden rounded-2xl border bg-slate-900 shadow-sm"
              style={{ borderColor: 'var(--border-subtle)' }}
            >
              {thumbnail ? (
                <img src={thumbnail} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center text-slate-500">
                  <Image className="h-6 w-6 mb-1" />
                  <span className="text-[10px]">No Thumbnail</span>
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2.5 w-full">
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  placeholder="Paste thumbnail image URL (Unsplash or CDN link)..."
                  value={thumbnail}
                  onChange={e => onThumbnailChange(e.target.value)}
                  className="w-full rounded-xl py-2 px-3 text-xs border outline-none"
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-primary)',
                  }}
                />

                <label
                  className="shrink-0 inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold cursor-pointer transition hover:opacity-90 shadow-sm"
                  style={{
                    borderColor: 'var(--border-subtle)',
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <UploadCloud className="h-3.5 w-3.5 text-blue-500" />
                  <span>Choose Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const res = await uploadMedia(file, 'thumbnail');
                          if (res?.data?.url) {
                            onThumbnailChange(res.data.url);
                            toast.success('Thumbnail uploaded to Cloudinary!');
                          }
                        } catch (err) {
                          const fallbackUrl = URL.createObjectURL(file);
                          onThumbnailChange(fallbackUrl);
                          toast.error('Cloud upload failed, using local preview.');
                        }
                      }
                    }}
                  />
                </label>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-slate-400 font-semibold">Quick Presets:</span>
                {PRESET_THUMBNAILS.map(preset => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => onThumbnailChange(preset.url)}
                    className="rounded-lg px-2.5 py-1 text-[10px] font-bold border transition hover:opacity-80"
                    style={{
                      borderColor: 'var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-1.5 pt-2">
          <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
            Curriculum Overview &amp; Learning Outcomes
          </label>
          <textarea
            rows={4}
            placeholder="Describe what enrolled students will achieve, required prerequisites, and final portfolio projects built throughout this course..."
            value={description}
            onChange={e => onDescriptionChange(e.target.value)}
            className="w-full rounded-2xl py-2.5 px-3.5 text-xs border outline-none transition leading-relaxed"
            style={{
              backgroundColor: 'var(--bg-subtle)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-primary)',
            }}
          />
        </div>
      </div>
    </div>
  );
}

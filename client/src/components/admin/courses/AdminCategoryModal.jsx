import { useState, useEffect } from 'react';
import { X, FolderPlus, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { createCategory, updateCategory } from '../../../services/category.api';

export default function AdminCategoryModal({ isOpen, onClose, category, onSaved }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [slug, setSlug] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name || '');
      setSlug(category.slug || '');
      setDescription(category.description || '');
    } else {
      setName('');
      setSlug('');
      setDescription('');
    }
  }, [category, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async e => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);
    try {
      let saved;
      if (category?._id) {
        const res = await updateCategory(category._id, {
          name: name.trim(),
          description: description.trim(),
        });
        saved = res.data;
        toast.success(`Category "${saved.name}" updated.`);
      } else {
        const res = await createCategory({
          name: name.trim(),
          description: description.trim(),
        });
        saved = res.data;
        toast.success(`Category "${saved.name}" created.`);
      }
      onSaved(saved);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to save category');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="w-full max-w-md rounded-3xl p-6 border shadow-2xl animate-in fade-in zoom-in-95 duration-150"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
      >
        <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div>
            <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
              {category ? 'Edit Category' : 'Create Course Category'}
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Categories saved to database and available to all instructors.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl transition hover:opacity-80"
            style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-muted)' }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              Category Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Artificial Intelligence & ML"
              value={name}
              onChange={e => {
                setName(e.target.value);
                if (!category) {
                  setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
                }
              }}
              className="w-full rounded-xl border px-3 py-2 text-xs outline-none transition"
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Brief description of this course category..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full rounded-xl border px-3 py-2 text-xs outline-none transition resize-none"
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          {slug && (
            <p className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
              Slug: /{slug}
            </p>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-xl px-4 py-2 text-xs font-bold transition hover:opacity-80"
              style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-secondary)' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:opacity-90 active:scale-95 disabled:opacity-60"
              style={{ backgroundColor: 'var(--color-primary-600)' }}
            >
              {isSaving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : category ? (
                <Save className="h-3.5 w-3.5" />
              ) : (
                <FolderPlus className="h-3.5 w-3.5" />
              )}
              <span>{isSaving ? 'Saving...' : category ? 'Save Changes' : 'Create Category'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

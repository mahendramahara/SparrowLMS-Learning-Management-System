import { useState, useRef, useEffect } from 'react';
import { FolderTree, BookOpen, MoreVertical, Edit, Trash2, Plus } from 'lucide-react';

export default function AdminCategoriesGrid({
  categories = [],
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
}) {
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = e => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
          {categories.length} Active {categories.length === 1 ? 'Category' : 'Categories'}
        </p>
        <button
          type="button"
          onClick={onAddCategory}
          className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition hover:opacity-90 active:scale-95"
          style={{ backgroundColor: 'var(--color-primary-600, #2563eb)' }}
        >
          <Plus className="h-3.5 w-3.5" />
          Add Category
        </button>
      </div>

      {categories.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center gap-2 py-16 rounded-2xl border border-dashed"
          style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
        >
          <FolderTree className="h-8 w-8 opacity-30" />
          <p className="text-sm font-semibold">No categories yet. Create the first one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(cat => {
            const catId = cat._id || cat.id;
            const isMenuOpen = openMenuId === catId;

            return (
              <div
                key={catId}
                className="relative flex items-center justify-between rounded-2xl p-5 border transition hover:shadow-sm"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--color-primary-600)' }}
                  >
                    <FolderTree className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                        {cat.name}
                      </h3>
                      {cat.isDefault && (
                        <span className="rounded px-1.5 py-0.5 text-[9px] font-bold bg-slate-500/10 text-slate-400">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {cat.description || `/${cat.slug}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className="inline-flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-bold"
                    style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)' }}
                  >
                    <BookOpen className="h-3.5 w-3.5 text-blue-500" />
                    <span>{cat.coursesCount ?? 0}</span>
                  </span>

                  <div className="relative inline-block text-left">
                    <button
                      type="button"
                      aria-label="Category Options"
                      onMouseDown={e => e.stopPropagation()}
                      onClick={e => {
                        e.stopPropagation();
                        setOpenMenuId(prev => (prev === catId ? null : catId));
                      }}
                      className="p-1.5 rounded-lg border transition hover:opacity-80"
                      style={{
                        borderColor: 'var(--border-subtle)',
                        backgroundColor: isMenuOpen ? 'var(--bg-subtle)' : 'var(--bg-card)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      <MoreVertical className="h-3.5 w-3.5" />
                    </button>

                    {isMenuOpen && (
                      <div
                        ref={menuRef}
                        onMouseDown={e => e.stopPropagation()}
                        onClick={e => e.stopPropagation()}
                        className="absolute right-0 top-full mt-1.5 w-36 rounded-2xl border p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100"
                        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
                      >
                        <button
                          type="button"
                          onClick={() => { setOpenMenuId(null); onEditCategory(cat); }}
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold transition hover:bg-slate-500/10"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          <Edit className="h-3.5 w-3.5 text-blue-500" />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => { setOpenMenuId(null); onDeleteCategory(catId); }}
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold text-rose-500 transition hover:bg-rose-500/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

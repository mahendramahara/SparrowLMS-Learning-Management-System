import { useState, useEffect } from 'react';
import { Check, ChevronDown, Loader2 } from 'lucide-react';
import { getCategories } from '../../../services/category.api';

export default function CourseCategorySelector({ value, onChange }) {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        if (isMounted && res?.success) {
          setCategories(res.data || []);
        }
      } catch {
        // fallback: empty list — admin needs to create categories first
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchCategories();
    return () => { isMounted = false; };
  }, []);

  const selectedCategory = categories.find(c => c._id === value);

  const handleSelect = cat => {
    onChange(cat._id, cat.name);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
        Course Category <span className="text-rose-500">*</span>
      </label>

      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="flex w-full items-center justify-between rounded-xl border px-3 py-2 text-xs transition"
        style={{
          backgroundColor: 'var(--bg-subtle)',
          borderColor: 'var(--border-subtle)',
          color: 'var(--text-primary)',
        }}
      >
        <span className="font-semibold truncate">
          {isLoading ? 'Loading...' : selectedCategory?.name || 'Select Category'}
        </span>
        {isLoading ? (
          <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-slate-400" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-400" />
        )}
      </button>

      {isOpen && !isLoading && (
        <div
          className="absolute left-0 top-full mt-1.5 w-full rounded-2xl border p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100 max-h-64 overflow-y-auto"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
        >
          {categories.length === 0 ? (
            <p className="px-3 py-4 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
              No categories found. Ask an admin to create categories first.
            </p>
          ) : (
            <div className="space-y-0.5">
              {categories.map(cat => {
                const isSelected = cat._id === value;
                return (
                  <button
                    key={cat._id}
                    type="button"
                    onClick={() => handleSelect(cat)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition ${
                      isSelected ? 'bg-blue-600 text-white' : 'hover:bg-slate-500/10'
                    }`}
                    style={!isSelected ? { color: 'var(--text-primary)' } : undefined}
                  >
                    <span className="truncate">{cat.name}</span>
                    {isSelected && <Check className="h-3.5 w-3.5 shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

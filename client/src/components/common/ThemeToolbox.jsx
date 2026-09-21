import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Palette,
  Sun,
  Moon,
  Monitor,
  Type,
  Minus,
  Plus,
  RotateCcw,
  X,
  GripHorizontal,
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const PALETTES = [
  { id: 'blue', name: 'Blue', color: '#4f46e5' },
  { id: 'emerald', name: 'Emerald', color: '#059669' },
  { id: 'purple', name: 'Purple', color: '#9333ea' },
  { id: 'orange', name: 'Orange', color: '#ea580c' },
];

const FONTS = [
  { id: 'modern', name: 'Modern Sans', style: "'Avenir Next', 'Segoe UI', sans-serif" },
  { id: 'editorial', name: 'Editorial Serif', style: "Georgia, 'Times New Roman', serif" },
  { id: 'mono', name: 'Clean Mono', style: "'SFMono-Regular', Consolas, monospace" },
];

const FONT_SIZES = ['small', 'medium', 'large'];

export default function ThemeToolbox() {
  const {
    theme,
    setTheme,
    colorScheme,
    setColorScheme,
    fontSize,
    setFontSize,
    fontFamily,
    setFontFamily,
  } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState(() => {
    try {
      const saved = localStorage.getItem('sparrow_toolbox_pos');
      if (saved) return JSON.parse(saved);
    } catch (err) {
      void err;
    }
    return {
      x: typeof window !== 'undefined' ? window.innerWidth - 76 : 300,
      y: typeof window !== 'undefined' ? window.innerHeight - 84 : 500,
    };
  });

  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, posX: 0, posY: 0 });
  const hasMovedRef = useRef(false);
  const containerRef = useRef(null);

  const clampPosition = useCallback((x, y) => {
    const maxX = Math.max(0, window.innerWidth - 68);
    const maxY = Math.max(0, window.innerHeight - 68);
    return {
      x: Math.min(Math.max(16, x), maxX),
      y: Math.min(Math.max(16, y), maxY),
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setPosition(prev => clampPosition(prev.x, prev.y));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [clampPosition]);

  const handlePointerDown = e => {
    if (e.target.closest('.toolbox-interactive')) return;
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    const clientX = e.clientX ?? e.touches?.[0]?.clientX;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY;
    dragStartRef.current = {
      x: clientX,
      y: clientY,
      posX: position.x,
      posY: position.y,
    };
  };

  useEffect(() => {
    const handlePointerMove = e => {
      if (!isDraggingRef.current) return;
      const clientX = e.clientX ?? e.touches?.[0]?.clientX;
      const clientY = e.clientY ?? e.touches?.[0]?.clientY;
      if (clientX === undefined || clientY === undefined) return;

      const deltaX = clientX - dragStartRef.current.x;
      const deltaY = clientY - dragStartRef.current.y;

      if (Math.hypot(deltaX, deltaY) > 4) {
        hasMovedRef.current = true;
      }

      const nextX = dragStartRef.current.posX + deltaX;
      const nextY = dragStartRef.current.posY + deltaY;
      const clamped = clampPosition(nextX, nextY);
      setPosition(clamped);
    };

    const handlePointerUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        if (hasMovedRef.current) {
          localStorage.setItem('sparrow_toolbox_pos', JSON.stringify(position));
        }
      }
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchmove', handlePointerMove, { passive: false });
    window.addEventListener('touchend', handlePointerUp);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [clampPosition, position]);

  const handleTriggerClick = () => {
    if (!hasMovedRef.current) {
      setIsOpen(prev => !prev);
    }
  };

  const handleStepFontSize = direction => {
    const idx = FONT_SIZES.indexOf(fontSize);
    if (direction === 'increase' && idx < FONT_SIZES.length - 1) {
      setFontSize(FONT_SIZES[idx + 1]);
    } else if (direction === 'decrease' && idx > 0) {
      setFontSize(FONT_SIZES[idx - 1]);
    }
  };

  const handleResetDefaults = () => {
    setTheme('system');
    setColorScheme('blue');
    setFontSize('medium');
    setFontFamily('modern');
  };

  const panelLeft = position.x > 340 ? position.x - 300 : position.x;
  const panelTop = position.y > 420 ? position.y - 400 : position.y + 60;

  return (
    <div
      ref={containerRef}
      className="fixed z-50 select-none print:hidden"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
        className="group relative flex items-center justify-center cursor-move"
      >
        <button
          type="button"
          onClick={handleTriggerClick}
          aria-label="Open Appearance Toolbox"
          className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-xl transition duration-200 hover:scale-105 active:scale-95"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25)',
          }}
        >
          <Palette className="h-5 w-5" style={{ color: 'var(--color-primary-600)' }} />
        </button>

        <span
          className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[9px] font-bold text-white shadow-sm ring-2"
          style={{ backgroundColor: 'var(--color-primary-600)', ringColor: 'var(--bg-card)' }}
        >
          <GripHorizontal className="h-2 w-2" />
        </span>
      </div>

      {isOpen && (
        <div
          className="toolbox-interactive fixed w-80 rounded-2xl p-4 shadow-2xl backdrop-blur-lg border transition-all duration-200 text-sm"
          style={{
            left: `${Math.max(12, Math.min(window.innerWidth - 332, panelLeft))}px`,
            top: `${Math.max(12, Math.min(window.innerHeight - 420, panelTop))}px`,
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-primary)',
            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.35)',
          }}
        >
          <div
            className="flex items-center justify-between pb-3 border-b"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <div className="flex items-center gap-2 font-semibold">
              <Palette className="h-4 w-4" style={{ color: 'var(--color-primary-600)' }} />
              <span>Appearance & Display</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetDefaults}
                title="Reset to defaults"
                className="rounded-lg p-1.5 transition hover:opacity-70"
                style={{ color: 'var(--text-muted)' }}
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close"
                className="rounded-lg p-1.5 transition hover:opacity-70"
                style={{ color: 'var(--text-muted)' }}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="space-y-4 pt-3">
            <div>
              <label
                className="text-xs font-medium uppercase tracking-wider"
                style={{ color: 'var(--text-muted)' }}
              >
                Theme Mode
              </label>
              <div
                className="grid grid-cols-3 gap-1.5 mt-1.5 p-1 rounded-xl"
                style={{ backgroundColor: 'var(--bg-subtle)' }}
              >
                {[
                  { id: 'system', label: 'System', Icon: Monitor },
                  { id: 'light', label: 'Light', Icon: Sun },
                  { id: 'dark', label: 'Dark', Icon: Moon },
                ].map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTheme(id)}
                    className="flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-medium transition"
                    style={
                      theme === id
                        ? {
                            backgroundColor: 'var(--bg-card)',
                            color: 'var(--text-primary)',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                          }
                        : { color: 'var(--text-muted)' }
                    }
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                className="text-xs font-medium uppercase tracking-wider"
                style={{ color: 'var(--text-muted)' }}
              >
                Accent Color
              </label>
              <div className="grid grid-cols-4 gap-2 mt-1.5">
                {PALETTES.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setColorScheme(p.id)}
                    className="flex flex-col items-center gap-1.5 rounded-xl p-2 border transition"
                    style={
                      colorScheme === p.id
                        ? { borderColor: p.color, backgroundColor: `${p.color}18`, fontWeight: 600 }
                        : { borderColor: 'var(--border-subtle)' }
                    }
                  >
                    <span
                      className="h-4 w-4 rounded-full shadow-inner ring-1 ring-black/10"
                      style={{ backgroundColor: p.color }}
                    />
                    <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                      {p.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  className="text-xs font-medium uppercase tracking-wider"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Content Size
                </label>
                <span
                  className="text-xs font-semibold capitalize"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {fontSize}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <button
                  type="button"
                  onClick={() => handleStepFontSize('decrease')}
                  disabled={fontSize === 'small'}
                  className="flex flex-1 items-center justify-center gap-1 rounded-lg border py-1.5 text-xs font-medium transition disabled:opacity-40 hover:opacity-70"
                  style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
                >
                  <Minus className="h-3.5 w-3.5" />
                  <span>Smaller</span>
                </button>
                <div className="grid grid-cols-3 gap-1 flex-1">
                  {FONT_SIZES.map(sz => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setFontSize(sz)}
                      className="rounded-lg py-1.5 text-[11px] font-medium uppercase transition"
                      style={
                        fontSize === sz
                          ? { backgroundColor: 'var(--color-primary-600)', color: '#ffffff' }
                          : { backgroundColor: 'var(--bg-subtle)', color: 'var(--text-muted)' }
                      }
                    >
                      {sz[0]}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => handleStepFontSize('increase')}
                  disabled={fontSize === 'large'}
                  className="flex flex-1 items-center justify-center gap-1 rounded-lg border py-1.5 text-xs font-medium transition disabled:opacity-40 hover:opacity-70"
                  style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Larger</span>
                </button>
              </div>
            </div>

            <div>
              <label
                className="text-xs font-medium uppercase tracking-wider"
                style={{ color: 'var(--text-muted)' }}
              >
                Typography
              </label>
              <div className="space-y-1 mt-1.5">
                {FONTS.map(f => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFontFamily(f.id)}
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition"
                    style={
                      fontFamily === f.id
                        ? {
                            fontFamily: f.style,
                            backgroundColor: 'var(--color-primary-50)',
                            color: 'var(--color-primary-700)',
                            fontWeight: 600,
                          }
                        : { fontFamily: f.style, color: 'var(--text-secondary)' }
                    }
                  >
                    <div className="flex items-center gap-2">
                      <Type className="h-3.5 w-3.5 opacity-70" />
                      <span>{f.name}</span>
                    </div>
                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      Ag
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

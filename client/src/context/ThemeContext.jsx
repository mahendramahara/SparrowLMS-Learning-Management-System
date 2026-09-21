import { useEffect, useState } from 'react';
import { ThemeContext } from './themeContextDef';

const palettes = {
  blue: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
    focus: 'rgba(79, 70, 229, 0.25)',
  },
  emerald: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
    focus: 'rgba(5, 150, 105, 0.25)',
  },
  purple: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
    focus: 'rgba(147, 51, 234, 0.25)',
  },
  orange: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
    focus: 'rgba(234, 88, 12, 0.25)',
  },
};

const fontFamilies = {
  modern: {
    body: "'Avenir Next', 'Segoe UI', sans-serif",
    display: "'Avenir Next', 'Segoe UI', sans-serif",
  },
  editorial: {
    body: "Georgia, 'Times New Roman', serif",
    display: "Georgia, 'Times New Roman', serif",
  },
  mono: {
    body: "'SFMono-Regular', Consolas, monospace",
    display: "'SFMono-Regular', Consolas, monospace",
  },
};

const hexToRgb = hex => {
  const clean = hex.replace('#', '');
  const num = parseInt(clean, 16);
  return `${(num >> 16) & 255} ${(num >> 8) & 255} ${num & 255}`;
};

const applyThemeTokens = (theme, colorScheme, fontSize, fontFamily) => {
  const root = document.documentElement;
  const palette = palettes[colorScheme] || palettes.blue;
  const fonts = fontFamilies[fontFamily] || fontFamilies.modern;
  const dark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const colors = dark
    ? {
        primary: '#0b1120',
        surface: '#0f172a',
        subtle: '#1e293b',
        card: '#131d34',
        text: '#f8fafc',
        secondary: '#cbd5e1',
        muted: '#94a3b8',
        border: '#1e2942',
        medium: '#334155',
        shadow: '0 4px 6px -1px rgba(0,0,0,.3)',
      }
    : {
        primary: '#f8fafc',
        surface: '#ffffff',
        subtle: '#f1f5f9',
        card: '#ffffff',
        text: '#0f172a',
        secondary: '#475569',
        muted: '#64748b',
        border: '#e2e8f0',
        medium: '#cbd5e1',
        shadow: '0 1px 3px rgba(15,23,42,.06)',
      };

  const paletteProps = {};
  Object.entries(palette).forEach(([key, value]) => {
    if (key === 'focus') {
      paletteProps['--color-primary-focus'] = value;
      paletteProps['--color-blue-focus'] = value;
    } else {
      paletteProps[`--color-primary-${key}`] = value;
      paletteProps[`--color-primary-${key}-rgb`] = hexToRgb(value);
      paletteProps[`--color-blue-${key}`] = value;
      paletteProps[`--color-blue-${key}-rgb`] = hexToRgb(value);
    }
  });

  Object.entries({
    '--bg-primary': colors.primary,
    '--bg-surface': colors.surface,
    '--bg-subtle': colors.subtle,
    '--bg-card': colors.card,
    '--text-primary': colors.text,
    '--text-secondary': colors.secondary,
    '--text-muted': colors.muted,
    '--border-subtle': colors.border,
    '--border-medium': colors.medium,
    '--shadow-card': colors.shadow,
    '--font-size-base': `${fontSize === 'small' ? 14 : fontSize === 'large' ? 18 : 16}px`,
    '--font-body': fonts.body,
    '--font-display': fonts.display,
    '--font-mono': "'SFMono-Regular', Consolas, monospace",
    '--radius-sm': '0.375rem',
    '--radius-md': '0.5rem',
    '--radius-lg': '0.75rem',
    '--radius-xl': '1rem',
    '--transition-fast': '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    '--transition-normal': '250ms cubic-bezier(0.4, 0, 0.2, 1)',
    ...paletteProps,
  }).forEach(([key, value]) => root.style.setProperty(key, value));

  root.style.fontSize = 'var(--font-size-base)';
  root.classList.toggle('dark', dark);
  root.classList.toggle('light', !dark);
  root.setAttribute('data-theme', colorScheme);
  root.setAttribute('data-font-family', fontFamily);
  root.setAttribute('data-font-size', fontSize);
  return dark;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'system';
  });

  const [colorScheme, setColorScheme] = useState(() => {
    return localStorage.getItem('colorScheme') || 'blue';
  });

  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem('fontSize') || 'medium';
  });

  const [fontFamily, setFontFamily] = useState(() => {
    return localStorage.getItem('fontFamily') || 'modern';
  });

  const [resolvedDark, setResolvedDark] = useState(false);

  useEffect(() => {
    const applyTheme = () =>
      setResolvedDark(applyThemeTokens(theme, colorScheme, fontSize, fontFamily));
    applyTheme();
    localStorage.setItem('theme', theme);

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme, colorScheme, fontSize, fontFamily]);

  useEffect(() => {
    localStorage.setItem('colorScheme', colorScheme);
  }, [colorScheme]);

  useEffect(() => {
    localStorage.setItem('fontSize', fontSize);
    localStorage.setItem('fontFamily', fontFamily);
  }, [fontSize, fontFamily]);

  const toggleTheme = () => {
    setTheme(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  };

  const value = {
    theme,
    setTheme,
    colorScheme,
    setColorScheme,
    fontSize,
    setFontSize,
    fontFamily,
    setFontFamily,
    isDark: resolvedDark,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

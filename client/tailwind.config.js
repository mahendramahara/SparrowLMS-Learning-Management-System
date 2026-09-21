const withOpacity = (varName) => {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${varName}-rgb), ${opacityValue})`;
    }
    return `var(${varName})`;
  };
};

const makeColorPalette = (prefix) => ({
  50: withOpacity(`${prefix}-50`),
  100: withOpacity(`${prefix}-100`),
  200: withOpacity(`${prefix}-200`),
  300: withOpacity(`${prefix}-300`),
  400: withOpacity(`${prefix}-400`),
  500: withOpacity(`${prefix}-500`),
  600: withOpacity(`${prefix}-600`),
  700: withOpacity(`${prefix}-700`),
  800: withOpacity(`${prefix}-800`),
  900: withOpacity(`${prefix}-900`),
});

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: makeColorPalette('--color-primary'),
        blue: makeColorPalette('--color-primary'),
        surface: 'var(--bg-surface)',
        subtle: 'var(--bg-subtle)',
        card: 'var(--bg-card)',
        'app-primary': 'var(--bg-primary)',
        'txt-primary': 'var(--text-primary)',
        'txt-secondary': 'var(--text-secondary)',
        'txt-muted': 'var(--text-muted)',
        'border-subtle': 'var(--border-subtle)',
        'border-medium': 'var(--border-medium)',
      },
      backgroundColor: {
        primary: 'var(--bg-primary)',
        surface: 'var(--bg-surface)',
        subtle: 'var(--bg-subtle)',
        card: 'var(--bg-card)',
      },
      textColor: {
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        muted: 'var(--text-muted)',
      },
      borderColor: {
        subtle: 'var(--border-subtle)',
        medium: 'var(--border-medium)',
      },
      fontFamily: {
        sans: ['var(--font-body)'],
        display: ['var(--font-display)'],
      },
    },
  },
  plugins: [],
}

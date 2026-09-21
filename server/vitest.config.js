const { defineConfig } = require('vitest/config');

module.exports = defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'coverage/',
        '**/*.config.js',
        '**/tests/**',
      ],
    },
    setupFiles: ['./tests/setup.js'],
    include: ['**/*.test.js', '**/*.spec.js'],
    testTimeout: 10000,
  },
});

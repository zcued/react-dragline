module.exports = {
  preset: 'ts-jest',
  setupFiles: ['./enzyme.setup.ts'],
  collectCoverage: true,
  globals: {
    'ts-jest': {
      diagnostics: false,
    },
  },
}
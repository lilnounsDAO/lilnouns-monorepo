module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'packages/*/tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off"
  },
  root: true,
  env: {
    node: true,
  },
  ignorePatterns: ['**/*.js', 'dist', '**/*.d.ts'],
};

import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactNativePlugin from 'eslint-plugin-react-native';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/**
 * Brewmate lint policy.
 *
 * The project rules in CLAUDE.md are enforced here as ERRORS, not suggestions.
 * Everything below fails `pnpm lint` and therefore fails CI.
 */

const MAX_COMPONENT_LINES = 150;

/** 0, 1 and -1 are the only numeric literals allowed outside a constants file. */
const ALLOWED_NUMBERS = [0, 1, -1];

const TOKEN_FILES = ['frontend/src/theme/tokens/**/*.ts'];

/**
 * The only directories where a numeric literal may sit inside an object
 * literal. Everywhere else a number must come from one of these files.
 *
 * The seed folder is reference data - ratio windows, collar ranges, micron
 * curves - which is nothing but numbers written down once. Naming each of them
 * would produce a constants file that is a worse copy of the same list.
 */
const CONSTANT_FILES = [
  '**/constants/**/*.ts',
  'frontend/src/theme/tokens/**/*.ts',
  'server/src/db/seed/seedData/**/*.ts',
];

const TOOLING_FILES = ['eslint.config.mjs', '**/*.config.js', '**/*.config.mjs', '**/*.config.ts'];

const HEX_COLOR_MESSAGE =
  'Hex colours are only allowed in frontend/src/theme/tokens. Import a token from @/theme instead.';
const URL_MESSAGE =
  'Hardcoded URLs are forbidden. Put the value in a config module and read it from the environment.';
const HEX_COLOR_PATTERN = String.raw`/#[0-9a-fA-F]{3,8}\b/`;
const URL_PATTERN = String.raw`/^(https?|ws|wss|postgres|postgresql):\/\//`;

/** Bans every hex colour literal, including ones hidden in template strings. */
const noHexColors = [
  {
    selector: `Literal[value=${HEX_COLOR_PATTERN}]`,
    message: HEX_COLOR_MESSAGE,
  },
  {
    selector: `TemplateElement[value.raw=${HEX_COLOR_PATTERN}]`,
    message: HEX_COLOR_MESSAGE,
  },
];

/** Bans absolute URLs written straight into application code. */
const noHardcodedUrls = [
  {
    selector: `Literal[value=${URL_PATTERN}]`,
    message: URL_MESSAGE,
  },
  {
    selector: `TemplateElement[value.raw=${URL_PATTERN}]`,
    message: URL_MESSAGE,
  },
];

/** `as` is allowed only for `as const`; anything else needs an explained disable. */
const noTypeAssertions = [
  {
    selector: "TSAsExpression:not(:has(TSTypeReference > Identifier[name='const']))",
    message:
      'Type assertions hide real type errors. Narrow the type properly, or add an eslint-disable line that explains why the assertion is safe.',
  },
];

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/.expo/**',
      'server/drizzle/**',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // ---------------------------------------------------------------------
  // Project rules - these are the ones CLAUDE.md calls binding.
  // ---------------------------------------------------------------------
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        { allowExpressions: false, allowTypedFunctionExpressions: true },
      ],
      '@typescript-eslint/no-magic-numbers': [
        'error',
        {
          ignore: ALLOWED_NUMBERS,
          ignoreArrayIndexes: true,
          ignoreDefaultValues: true,
          ignoreEnums: true,
          ignoreNumericLiteralTypes: true,
          ignoreReadonlyClassProperties: true,
          ignoreTypeIndexes: true,
          enforceConst: true,
          detectObjects: true,
        },
      ],
      'no-restricted-syntax': ['error', ...noHexColors, ...noHardcodedUrls, ...noTypeAssertions],
      'no-console': 'error',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'prefer-const': 'error',
      'no-param-reassign': 'error',
    },
  },

  // ---------------------------------------------------------------------
  // Frontend: React Native rules that make hardcoding impossible.
  // ---------------------------------------------------------------------
  {
    files: ['frontend/**/*.ts', 'frontend/**/*.tsx'],
    languageOptions: {
      globals: { ...globals.browser },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'react-native': reactNativePlugin,
    },
    settings: { react: { version: 'detect' } },
    rules: {
      'react-native/no-inline-styles': 'error',
      'react-native/no-color-literals': 'error',
      'react-native/no-raw-text': 'error',
      'react-native/no-unused-styles': 'error',
      'react-native/no-single-element-style-arrays': 'error',
      'react/jsx-no-literals': [
        'error',
        { noStrings: true, allowedStrings: [], ignoreProps: true },
      ],
      'react/self-closing-comp': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'max-lines-per-function': [
        'error',
        { max: MAX_COMPONENT_LINES, skipBlankLines: true, skipComments: true },
      ],
      'max-lines': [
        'error',
        { max: MAX_COMPONENT_LINES, skipBlankLines: true, skipComments: true },
      ],
    },
  },

  // Design tokens are the single place colour literals may exist.
  {
    files: TOKEN_FILES,
    rules: { 'no-restricted-syntax': ['error', ...noHardcodedUrls, ...noTypeAssertions] },
  },

  // Constants and tokens are where numbers are allowed to be written down.
  {
    files: CONSTANT_FILES,
    rules: { '@typescript-eslint/no-magic-numbers': 'off' },
  },

  // Server and shared code runs on Node.
  {
    files: ['server/**/*.ts', 'shared/**/*.ts'],
    languageOptions: { globals: { ...globals.node } },
  },

  // Tooling configuration is not application code.
  {
    files: TOOLING_FILES,
    languageOptions: { globals: { ...globals.node } },
    rules: {
      '@typescript-eslint/no-magic-numbers': 'off',
      'no-restricted-syntax': ['error', ...noHexColors],
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },

  // Plain JS tooling files are not part of any tsconfig, so type-aware
  // linting is switched off for them explicitly.
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    ...tseslint.configs.disableTypeChecked,
    languageOptions: {
      globals: { ...globals.node },
      parserOptions: { projectService: false, project: false, program: null },
    },
  },

  prettierConfig,
);

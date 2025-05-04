import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginReact from 'eslint-plugin-react';
import globals from 'globals';
import path from 'path';

const customRules = {
  rules: {
    'match-exported-name': customMatchExportedNameRule(),
  },
};

const EXTERNAL_DEPENDENCIES = [
  'lodash',
  'react',
  'react-dom/client',
  'react-hook-form',
  'react-router-dom',
];

export default [
  {
    files: ['client/src/**/*.{js,jsx}'],
    languageOptions: { globals: globals.browser },
    ...eslintPluginReact.configs.flat.recommended,
    plugins: {
      'custom-rules': customRules,
      import: eslintPluginImport,
    },
    rules: {
      'import/order': [
        'warn',
        {
          alphabetize: { order: 'asc', caseInsensitive: true },
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
          /*
            Internal dependencies are being interpreted as external due to aliasing (babelrc).
            Rather than list every alias here, list every external dependency; there are fewer of
            them and they rarely change. Everything not fitting the pattern will be considered internal.
          */
          pathGroups: [
            {
              pattern: `{${EXTERNAL_DEPENDENCIES.join(',')}}`,
              group: 'external',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
        },
      ],
      'react/prop-types': 'off',
      'custom-rules/match-exported-name': 'warn',
      'func-style': ['error', 'declaration', { allowArrowFunctions: false }],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];

////////////////////

// Custom rule to ensure default export name matches filename.
function customMatchExportedNameRule() {
  return {
    meta: {
      type: 'suggestion',
      docs: {
        description: 'Ensure default export name matches filename.',
      },
      schema: [],
      messages: {
        mismatch:
          'Default export "{{ exportName }}" should match filename "{{ expectedName }}".',
      },
    },
    create(context) {
      const filename = path.basename(
        context.getFilename(),
        path.extname(context.getFilename()),
      );

      return {
        ExportDefaultDeclaration(node) {
          if (node.declaration && node.declaration.id) {
            const exportName = node.declaration.id.name;
            const expectedName = filename;

            if (exportName !== expectedName) {
              context.report({
                node,
                messageId: 'mismatch',
                data: {
                  exportName,
                  expectedName,
                },
              });
            }
          }
        },
      };
    },
  };
}

import antfu from '@antfu/eslint-config'
import tailwindcss from 'eslint-plugin-tailwindcss'

export default antfu(
  {
    ignores: ['dist'],
    rules: {
      'no-console': 'warn',
      'unused-imports/no-unused-vars': 'warn',
      'no-unused-vars': 'warn',
    },
  },
  ...tailwindcss.configs['flat/recommended'],
)

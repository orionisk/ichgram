import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'no-console': 'warn',
    'unused-imports/no-unused-vars': 'warn',
  },
})

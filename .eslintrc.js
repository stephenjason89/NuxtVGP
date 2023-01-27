module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
        es6: true,
    },
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    extends: [
        '@nuxtjs',
        '@nuxtjs/eslint-config-typescript',
        'plugin:nuxt/recommended',
        'plugin:vue/vue3-recommended',
        'plugin:prettier/recommended',
    ],
    rules: {
        'no-console': 'off',
        '@typescript-eslint/no-unused-vars': ['error', { args: 'after-used', argsIgnorePattern: '^_' }],
        'vue/multi-word-component-names': 0,
    },
}

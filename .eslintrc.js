module.exports = {
	root: true,
	env: { browser: true, node: true },
	extends: ['@nuxtjs/eslint-config-typescript', 'plugin:nuxt/recommended', 'plugin:prettier/recommended'],
	rules: { 'no-console': 'off', 'vue/html-self-closing': ['error', { html: { void: 'always' } }] },
}

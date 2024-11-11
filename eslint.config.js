// @ts-check
import antfu from '@antfu/eslint-config'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
export default antfu(
	{
		stylistic: false,
		rules: {
			'no-console': 'off',
			'ts/consistent-type-definitions': 'off',
			'vue/block-order': [
				'error',
				{
					order: [['template', 'script'], 'style'],
				},
			],
		},
	},
	eslintPluginPrettierRecommended,
	{ ignores: ['pnpm-lock.yaml', 'client/types/codegen/*.ts'] },
)

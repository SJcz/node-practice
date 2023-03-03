module.exports = {
	env: {
		commonjs: true,
		es6: true,
		node: true
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 12
	},
	plugins: ['@typescript-eslint/eslint-plugin'],
	extends: [
		'plugin:@typescript-eslint/recommended'
	],
	rules: {
		'@typescript-eslint/interface-name-prefix': 'off',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-var-requires': 'off',
		'@typescript-eslint/no-tabs': 'off',
		indent: [
			'warn',
			'tab',
			{ SwitchCase: 1}
			// 强制统一缩进
		],
		quotes: [
			'warn',
			'single'
			// 单引号
		],
		semi: [
			'warn',
			'never'
			// 不加分号
		],
		'no-trailing-spaces': [
			'off'
		],
		'no-whitespace-before-property': [
			'warn'
		],
		'space-before-blocks': [
			'warn'
		],
		'space-before-function-paren': [
			'off'
		],
		'space-in-parens': [
			'warn'
		],
		'space-infix-ops': [
			'warn'
		],
		'no-tabs': ['off'],
		'@typescript-eslint/no-empty-function': ['off']
	}
}

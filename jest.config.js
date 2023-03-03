/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
	// All imported modules in your tests should be mocked automatically
	automock: false,

	// Stop running tests after `n` failures
	bail: 5,

	// Automatically clear mock calls, instances and results before every test
	clearMocks: true,

	// Indicates whether the coverage information should be collected while executing the test
	collectCoverage: false,

	// The directory where Jest should output its coverage files
	coverageDirectory: 'coverage',

	// An array of regexp pattern strings used to skip coverage collection
	coveragePathIgnorePatterns: [
		'\\\\node_modules\\\\'
	],

	// Indicates which provider should be used to instrument code for coverage
	coverageProvider: 'v8',

	// A list of reporter names that Jest uses when writing coverage reports
	coverageReporters: [
		'json',
		'text',
		'lcov',
		'clover'
	],

	// jest 测试 TS 时, 不支持 import/from 这种模块的导入, 所以需要换成 ts-jest 来预解析
	'transform': {
		'\\.(ts|tsx)$': '<rootDir>/node_modules/ts-jest/preprocessor.js'
	},

	// The glob patterns Jest uses to detect test files
	testMatch: [
		'**/?(*.)+(spec|test).[t]s?(x)'
	],
}

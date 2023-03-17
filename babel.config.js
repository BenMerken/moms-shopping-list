module.exports = function (api) {
	api.cache(true)
	return {
		presets: ['babel-preset-expo'],
		plugins: [
			"babel-plugin-styled-components",
			[
				'module-resolver',
				{
					root: ['./src'],
					alias: {
						'@assets': './assets',
						'@components': './src/components',
						'@hooks': './src/hooks',
						'@navigation': './src/navigation',
						'@screens': './src/screens',
						'@types': './src/types',
						'@utils': './src/utils'
					}
				}
			]
		]
	}
}

module.exports = function (api) {
	api.cache(true);
	return {
		presets: ['babel-preset-expo'],
		plugins: [
			[
				'module-resolver',
				{
					alias: {
						'@api': './src/API.ts',
						'@assets': './assets',
						'@components': './src/components',
						'@config': './src/config',
						'@contexts': './src/contexts',
						'@screens': './src/screens',
						'@utils': './src/utils',
					},
				},
			],
		],
	};
};

import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { reactRouter } from '@react-router/dev/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
	plugins: [reactRouter(), tailwindcss(), tsconfigPaths()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
});

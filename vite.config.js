import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

export default defineConfig({
	plugins: [react()],
	server: {
		https: {
			cert: fs.readFileSync(process.env.SSL_CRT_FILE),
			key: fs.readFileSync(process.env.SSL_KEY_FILE),
		},
	},
});

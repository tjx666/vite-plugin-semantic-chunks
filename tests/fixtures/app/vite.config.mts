import vitePluginVue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import vitePluginSemanticChunks from 'vite-plugin-semantic-chunks';

export default defineConfig({
    plugins: [vitePluginVue(), vitePluginSemanticChunks()],
    build: {
        modulePreload: {
            polyfill: false,
        },
        minify: false,
        rollupOptions: {
            // external: ['vue'],
        },
    },
});

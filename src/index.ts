import { readPackageUpSync } from 'read-pkg-up';
import type { Plugin } from 'vite';

function getChunkPkgName(facadeModuleId: string | null) {
    if (!facadeModuleId) return '';

    const closestPkg = readPackageUpSync({ cwd: facadeModuleId });
    if (!closestPkg) return '';

    return `${closestPkg.packageJson.name.replace(/\//, '+')}+`;
}

const assetExtToFolderMap = new Map([
    [/.(jpe?g|a?png)$/, 'image'],
    [/.(mp4|mov|ts|flv|avi)$/, 'video'],
    [/.(mp3|aac|wav|flac)$/, 'audio'],
    [/.(ttf|woff|woff2|otf|eot)$/, 'font'],
]);

export default function vitePluginSematicChunks(): Plugin {
    return {
        name: 'vite-plugin-sematic-chunks',
        config() {
            return {
                worker: {
                    rollupOptions: {
                        output: {
                            entryFileNames(chunkInfo) {
                                const pkgNameAndDir = getChunkPkgName(chunkInfo.facadeModuleId);
                                return `js/worker/${pkgNameAndDir}[name]-[hash].js.js`;
                            },
                        },
                    },
                },
                build: {
                    rollupOptions: {
                        output: {
                            assetFileNames(chunkInfo) {
                                const assetFileName = chunkInfo.name;
                                let assetFolder = '[ext]';
                                if (assetFileName) {
                                    for (const [reg, folder] of assetExtToFolderMap.entries()) {
                                        if (reg.test(assetFileName)) {
                                            assetFolder = folder;
                                            break;
                                        }
                                    }
                                }
                                return `${assetFolder}/[name]-[hash][extname]`;
                            },
                            chunkFileNames(chunkInfo) {
                                const namespaces: string[] = [];
                                if (chunkInfo.isDynamicEntry) {
                                    namespaces.push('dynamic');
                                } else {
                                    namespaces.push('chunks');
                                }

                                if (chunkInfo.isImplicitEntry) {
                                    namespaces.push('implicit');
                                }

                                const chunksFolder = namespaces.join('-');
                                const chunkPkgName = getChunkPkgName(chunkInfo.facadeModuleId);
                                return `js/${chunksFolder}/${chunkPkgName}[name]-[hash].js`;
                            },
                            entryFileNames() {
                                return `[name]-[hash].js`;
                            },
                        },
                    },
                },
            };
        },
    };
}

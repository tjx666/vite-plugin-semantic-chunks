import path from 'node:path';

import { readPackageUpSync } from 'read-pkg-up';
import type { Plugin } from 'vite';

function getLongerChunkPath(facadeModuleId: string | null) {
    if (!facadeModuleId) return '';

    const latestPackageJSON = readPackageUpSync({ cwd: facadeModuleId });
    const dirName = path.basename(path.dirname(facadeModuleId));
    const pkgName = latestPackageJSON?.packageJson.name.replace(/\//, '+');
    return `${pkgName}+${dirName}+`;
}

const assetExtToFolderMap = new Map([
    [/.(jpe?g|a?png)$/, 'image'],
    [/.(mp4|mov|ts|flv|avi)$/, 'video'],
    [/.(mp3|aac|wav|flac)$/, 'audio'],
]);
function getAssetFolder(assetFileName: string | undefined) {
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
}

export function vitePluginSematicChunks(): Plugin {
    return {
        name: 'vite-plugin-sematic-chunks',
        config() {
            return {
                build: {
                    rollupOptions: {
                        output: {
                            assetFileNames(assetInfo) {
                                return getAssetFolder(assetInfo.name);
                            },
                            chunkFileNames(chunkInfo) {
                                const namespaces: string[] = [];
                                if (chunkInfo.isImplicitEntry) {
                                    namespaces.push('implicit');
                                }
                                if (chunkInfo.isDynamicEntry) {
                                    namespaces.push('dynamic');
                                }
                                const chunksFolder =
                                    namespaces.length > 0 ? namespaces.join('-') : 'chunks';
                                const chunkPkg = getLongerChunkPath(chunkInfo.facadeModuleId);
                                return `js/${chunksFolder}/${chunkPkg}[name]-[hash].js`;
                            },
                            entryFileNames() {
                                return 'main-[hash].js';
                            },
                        },
                    },
                },
            };
        },
    };
}

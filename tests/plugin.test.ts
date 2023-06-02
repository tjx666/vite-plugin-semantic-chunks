import fs from 'node:fs/promises';
import { resolve } from 'node:path';

import { execa } from 'execa';
import { expect, test } from 'vitest';

const cwd = resolve(__dirname, './fixtures/app');
test('basic', async () => {
    const tree = await fs.readFile(resolve(cwd, 'tree.txt'), 'utf8');
    const { stdout } = await execa('tree', ['dist'], { preferLocal: true, cwd });
    console.log(stdout);
    expect(tree).toBe(stdout);
});

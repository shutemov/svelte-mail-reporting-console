import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('MField', () => {
  it('composes label and error atom', () => {
    const source = readFileSync(resolve('src/lib/ui/molecules/MField.svelte'), 'utf-8');
    expect(source).toContain('export let label');
    expect(source).toContain('<AErrorMessage');
  });
});

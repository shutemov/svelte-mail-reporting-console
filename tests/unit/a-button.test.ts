import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('AButton', () => {
  it('declares disabled and loading semantics', () => {
    const source = readFileSync(resolve('src/lib/ui/atoms/AButton.svelte'), 'utf-8');
    expect(source).toContain("export let disabled = false");
    expect(source).toContain("export let onclick");
    expect(source).toContain("aria-busy={loading}");
  });
});

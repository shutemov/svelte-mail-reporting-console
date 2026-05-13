export function humanizeToken(value: string): string {
  return value.replaceAll(/[_-]+/g, ' ');
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

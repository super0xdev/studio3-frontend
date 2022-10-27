export function shortenString(str: string) {
  return str.substring(0, 6) + '...' + str.substring(str.length - 4);
}

export function splitFileName(str: string) {
  const idx = str.lastIndexOf('.');
  return [str.substring(0, idx), str.substring(idx, str.length)];
}

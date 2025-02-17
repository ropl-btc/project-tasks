export function getPreviewText(content: string): string {
  const plainText = content.replace(/<[^>]*>/g, '');
  const firstLine = plainText
    .split('\n')
    .find(line => line.trim().length > 0);
  
  return firstLine || 'Empty note...';
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1) + '…';
}